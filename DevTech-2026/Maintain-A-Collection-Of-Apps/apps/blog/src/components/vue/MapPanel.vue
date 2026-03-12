<script setup lang="ts">
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-panel";

import type WebMap from "@arcgis/core/WebMap";

import { hello } from "@devtech/utils";

import { ref } from "vue";

type Props = {
  itemId: string;
  description?: string;
};

const props = defineProps<Props>();
const heading = ref("");
const summary = ref(
  props.description ?? hello("from the shared utils package"),
);

const onViewReady = (event: Event) => {
  const mapElement = event.target as HTMLArcgisMapElement;
  const webmap = mapElement?.map as WebMap;
  const portalItem = webmap.portalItem;
  const nextHeading = portalItem?.title ?? "Blog demo";
  const nextSummary =
    portalItem?.snippet || portalItem?.description || summary.value;

  heading.value = nextHeading;
  summary.value = nextSummary;
};
</script>

<template>
  <calcite-panel :heading="heading" :description="summary" class="map-panel">
    <arcgis-map :item-id="props.itemId" @arcgisViewReadyChange="onViewReady">
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-search slot="top-right"></arcgis-search>
      <arcgis-expand slot="bottom-left">
        <arcgis-legend></arcgis-legend>
      </arcgis-expand>
    </arcgis-map>
  </calcite-panel>
</template>

<style scoped>
.map-panel {
  --calcite-panel-space: 0.75rem;
  border-radius: 12px;
}

arcgis-map {
  display: block;
  height: 420px;
  width: 100%;
}
</style>
