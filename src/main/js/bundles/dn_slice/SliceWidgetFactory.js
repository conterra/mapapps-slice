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
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import SliceViewModel from "esri/widgets/Slice/SliceViewModel";
import SliceWidget from "./SliceWidget.vue";
import Observers from "apprt-core/Observers";

const _sliceViewModel = Symbol("_sliceViewModel");
const _observers = Symbol("_observers");

class SliceWidgetFactory {

    activate() {
        const observers = this[_observers] = new Observers();
        this._initComponent();

        const toolWatch = this._tool.watch("active", (name, oldValue, newValue) => {
            if (!newValue) {
                this.clear();
            }
        });
        observers.add(toolWatch);
    }

    deactivate() {
        this[_observers].clean();
        this.clear();
    }

    createInstance() {
        return new VueDijit(this.vm);
    }

    _initComponent() {
        const sliceViewModel = this[_sliceViewModel] = new SliceViewModel();
        this._getView().then((view) => {
            sliceViewModel.set("view", view);
        });
        const vm = this.vm = new Vue(SliceWidget);
        vm.i18n = this._i18n.get().widget;

        // listen to view model methods
        vm.$on('newSlice', () => {
            this.slice();
        });
        vm.$on('clearSlice', () => {
            this.clear();
        });

        vm.$on('excludeLayer', () => {
            this.excludeLayer();
        });

        vm.$on('removeExcludedLayer', (id) => {
            this.removeLayer(id);
        });

        const observers = this[_observers];
        observers.add(sliceViewModel.watch("excludedLayers", (excludedLayers) => {
            if (excludedLayers) {
                excludedLayers.on("after-changes", () => {
                    vm.excludedLayers = excludedLayers.map(({id, title}) => {
                        return {
                            id,
                            title
                        }
                    }).toArray();
                });
            }
        }));
        observers.add(Binding.for(vm, sliceViewModel)
            .syncToLeft("state")
            .enable()
            .syncToLeftNow());
    }

    slice() {
        const sliceViewModel = this[_sliceViewModel];
        sliceViewModel.newSlice();
    }

    clear() {
        const sliceViewModel = this[_sliceViewModel];
        sliceViewModel.clearSlice();
        sliceViewModel.excludedLayers.removeAll();
    }

    excludeLayer() {
        const view = this._mapWidgetModel.view;
        const sliceViewModel = this[_sliceViewModel];
        const onClickHandler = view.on("click", (event) => {
            view.hitTest(event).then((response) => {
                const results = response.results;
                if (results.length) {
                    const layer = results[0].graphic.layer;
                    const alreadyExcluded = sliceViewModel.excludedLayers.find((excludedLayer) => {
                        return excludedLayer.id === layer.id;
                    });
                    if (alreadyExcluded) {
                        return;
                    }
                    sliceViewModel.excludedLayers.add(layer);
                }
            });
            event.stopPropagation();
            this[_observers].remove(onClickHandler);
            onClickHandler.remove();
        });
        this[_observers].add(onClickHandler);
    }

    removeLayer(id) {
        const map = this._mapWidgetModel.map;
        const layer = map.findLayerById(id);
        if (!layer) {
            return;
        }
        const sliceViewModel = this[_sliceViewModel];
        sliceViewModel.excludedLayers.remove(layer);
    }

    _getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve, reject) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }
}


module.exports = SliceWidgetFactory;
