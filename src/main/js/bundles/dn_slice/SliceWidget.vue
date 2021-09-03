<!--

    Copyright (C) 2021 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <v-container
        class="pa-1">
        <v-btn
            block
            ripple
            color="primary"
            @click="$emit('newSlice')">
            <v-icon left>
                flip
            </v-icon>
            {{ i18n.slice }}
        </v-btn>
        <v-btn
            block
            ripple
            color="secondary"
            @click="$emit('clearSlice')">
            <v-icon left>
                replay
            </v-icon>
            {{ i18n.cancel }}
        </v-btn>
        <v-divider class="my-3"></v-divider>
        <v-btn
            block
            ripple
            class="mb-3"
            color="secondary"
            @click="$emit('excludeLayer')">
            <v-icon left>
                playlist_add
            </v-icon>
            {{ i18n.excludeLayer }}
        </v-btn>
        <v-alert
            :value="excludeLayerActive"
            type="info"
        >
            {{ i18n.excludedLayersHint }}
        </v-alert>
        <h5 v-if="excludedLayers.length">
            {{ i18n.excludedLayers }}
        </h5>
        <v-list
            v-if="excludedLayers.length">
            <v-list-tile
                v-for="layer in excludedLayers"
                :key="layer.id"
            >
                <v-list-tile-action>
                    <v-btn
                        icon
                        tile
                        ripple
                        @click="$emit('removeExcludedLayer', layer.id)">
                        <v-icon>
                            icon-trashcan
                        </v-icon>
                    </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title v-text="layer.title"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        data: function () {
            return {
                i18n: {
                    type: Object,
                    default: function () {
                        return {
                            layer: "Layer:"
                        }
                    }
                },
                excludedLayers: [],
                state: null,
                excludeLayerActive: false
            }
        }
    };
</script>
