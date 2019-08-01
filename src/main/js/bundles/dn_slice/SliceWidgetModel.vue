<template>
    <v-container
        grid-list-md
        fluid
        class="pa-1">
        <v-btn
            id="sliceButton"
            block
            ripple
            color="primary"
            @click="$emit('newSlice', {})">
            {{ i18n.slice }}
        </v-btn>
        <v-btn
            block
            ripple
            color="primary"
            @click="$emit('clearSlice', {})">
            {{ i18n.cancel }}
        </v-btn>
        <v-divider class="my-3"></v-divider>
        <v-btn
            id="exLayer"
            block
            ripple
            color="secondary"
            input-value="exLayerActive"
            @click="$emit('excludeLayer', {})">
            <v-icon
                dark
                left>
                icon-layer
            </v-icon>
            {{ i18n.excludeLayer }}
        </v-btn>
        <h5 v-if="excludedLayers.length>0">{{ i18n.exclLayers }}</h5>
        <p v-if="exLayerActive && excludedLayers.length<1">{{ i18n.exclLayersHint }}</p>
        <v-list
            dense v-if="excludedLayers.length">
            <v-list-tile
                v-for="layer in excludedLayers"
                :key="layer.id"
                target="_blank"
            >
                <v-list-tile-action>
                    <v-btn
                        icon
                        tile
                        ripple
                        @click="$emit('removeLayer', {layer})">
                        <v-icon>
                            icon-trashcan
                        </v-icon>
                    </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title v-text="layer.name"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        components: {},
        mixins: [Bindable],
        props: {
            i18n: {
                type: Object,
                default: function () {
                    return {
                        layer: "Layer:"
                    }
                }
            },
            excludedLayers: {
                type: Array,
                default: () => []
            },
            exLayerActive:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        }
    };
</script>
