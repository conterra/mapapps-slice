/*
 * Copyright (C) 2019 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import SliceWidget from "./SliceWidgetModel.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import CancelablePromise from "apprt-core/CancelablePromise";
import Slice from "esri/widgets/Slice";

class SliceWidgetFactory {

    activate() {
        this._initComponent();
    }

    createInstance() {
        return new VueDijit(this.vm);
    }

    _initComponent() {
        const vm = this.vm = new Vue(SliceWidget);
        let excludedLayersProp = this._properties.excludedLayers;

        vm.i18n = this._i18n.get().widget;
        vm.excludedLayers = excludedLayersProp;

        // listen to view model methods
        vm.$on('startup', () => {

        });
        vm.$on('newSlice', () => {
            this.slice();
        });
        vm.$on('clearSlice', () => {
            this.clear();
        });

        vm.$on('excludeLayer', () => {
            vm.exLayerActive = !vm.exLayerActive;
            this.excludeLayer(vm.exLayerActive);
        });

        vm.$on('removeLayer', (layerDesc) => {
            this.removeLayer(layerDesc)
        });

    }

    slice() {
        this.vm.exLayerActive = false;
        this.excludeLayer(this.vm.exLayerActive);
        let view = this._mapWidgetModel.view;
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            let sliceButton = document.getElementById("sliceButton");
            if (this.sliceWidget) {
                if (this.vm.excludedLayers.length > 0) {
                    this.vm.excludedLayers.forEach(layerDesc => {
                        this.removeLayer(layerDesc);
                    })
                }
                this.sliceWidget.destroy();
                this.sliceWidget = null;
            }
            this.sliceWidget = new Slice({
                view: view
            });
            if (this.vm.excludedLayers.length > 0) {
                this.vm.excludedLayers.forEach(layerDesc => {
                    let layer = this._mapWidgetModel.map.findLayerById(layerDesc.id);
                    this.sliceWidget.viewModel.excludedLayers.add(layer);
                })
            }
            this.sliceWidget.viewModel.newSlice();
            oncancel("Slice Widget Canceled")
        });
    }

    clear() {
        this.vm.exLayerActive = false;
        this.vm.excludedLayers = [];
        this.excludeLayer(this.vm.exLayerActive);
        let sliceButton = document.getElementById("sliceButton");
        if (sliceButton.classList.contains("sliceActive")) {
            sliceButton.classList.remove("sliceActive");
        }
        if (this.sliceWidget) {
            this.sliceWidget.viewModel.clearSlice();
            this.sliceWidget.destroy();
            this.sliceWidget = null;
        }
    }


    excludeLayer(active) {
        let button = document.getElementById("exLayer");
        let view = this._mapWidgetModel.view;
        if (active) {
            if (!button.classList.contains("sliceActive")) {
                button.classList.add("sliceActive");
            }
            this.popupWatcher = view.popup.watch("visible", (e) => {
                view.popup.close()
            });
            this.onClickHandler = view.on("click", (e) => {
                let screenPoint = {
                    x: e.x,
                    y: e.y
                };

                view.hitTest(screenPoint).then((response) => {
                    if (response.results.length) {
                        let layer = response.results[0].graphic.layer;
                        let layerIncluded = false;
                        if (this.vm.excludedLayers.length > 0) {
                            this.vm.excludedLayers.forEach(alreadyExcluded => {
                                if (alreadyExcluded.id === layer.id) {
                                    layerIncluded = true
                                }
                            });
                        }
                        if (!layerIncluded) {
                            this.vm.excludedLayers.push({id: layer.id, name: layer.title});
                            if (this.sliceWidget) {
                                this.sliceWidget.viewModel.excludedLayers.add(layer);
                            }
                        }
                    }
                });
            });
        } else {
            if (button.classList.contains("sliceActive")) {
                button.classList.remove("sliceActive");
            }
            if (this.onClickHandler) {
                this.onClickHandler.remove();
            }
            if (this.popupWatcher) {
                this.popupWatcher.remove();
            }
        }

    }

    removeLayer(layerDesc) {
        let layerId;
        if (layerDesc.layer) {
            layerId = layerDesc.layer.id;
        } else {
            layerId = layerDesc.id;
        }

        let layer = this._mapWidgetModel.map.findLayerById(layerId);
        if (this.sliceWidget) {
            this.sliceWidget.viewModel.excludedLayers.remove(layer);
        }
        let tempArray = [];
        this.vm.excludedLayers.forEach(layer => {
            if (layerId !== layer.id) {
                tempArray.push(layer)
            }
        });
        this.vm.excludedLayers = tempArray;
    }
}


module.exports = SliceWidgetFactory;
