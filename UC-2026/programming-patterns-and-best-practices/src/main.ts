import "./style.css";

// Optional: If you're loading secure web maps
// import { configureOAuth } from "./auth/configureOAuth";
// configureOAuth({
//   // Default portalUrl is ArcGIS Online
//   // Only set if using other portals
//   portalUrl: "YOUR_PORTAL_URL",
//   appId: "YOUR_APP_ID",
// });

// Individual imports for each Map, Chart and Calcite component
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-feature-table";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/charts-components/components/arcgis-chart";
import "@esri/calcite-components/components/calcite-list";
import "@esri/calcite-components/components/calcite-list-item";
import "@esri/calcite-components/components/calcite-meter";
import "@esri/calcite-components/components/calcite-panel";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";

// Import modules and types from the SDK's core API
import type WebMap from "@arcgis/core/WebMap.js";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import type GroupLayer from "@arcgis/core/layers/GroupLayer.js";

const mapElement = document.querySelector("arcgis-map") as unknown as HTMLElement & {
  map: WebMap;
  goTo: (target: unknown) => Promise<void>;
};
const tableElement = document.querySelector("#featureTable") as HTMLElement & {
  layer: FeatureLayer;
  objectIds: unknown[] | null;
  filterGeometry: unknown;
  actionColumnConfig: unknown;
};
const chartElement = document.querySelector("#chart") as HTMLElement & {
  layer: FeatureLayer;
  model: unknown;
  runtimeDataFilters: unknown;
};
const stateListElement = document.querySelector("#stateList") as HTMLElement;

type StateListItem = { label: string; production?: number; value?: string };

const createStateList = (items: StateListItem[], maxProduction: number) => {
  stateListElement.innerHTML = items
    .map(
      ({ label, production, value }, index) => `
        <calcite-list-item label="${label}" value="${value ?? ""}" ${index === 0 ? "selected" : ""}>
          ${production ? `<calcite-meter max="${maxProduction}" value="${production}" scale="s" fill-type="single" slot="content-bottom"></calcite-meter>` : ""}
        </calcite-list-item>`,
    )
    .join("");
};

let layer: FeatureLayer;
let states: FeatureLayer;
let initialViewpoint: unknown;

const resetFocus = () => {
  void mapElement.goTo(initialViewpoint);
  layer.featureEffect = null;
  states.featureEffect = {
    filter: { where: "1=1" },
    excludedEffect: "opacity(0)",
    includedEffect: "drop-shadow(0, 0, 24px, darkgray)",
  };
  tableElement.filterGeometry = null;
  tableElement.objectIds = null;
  chartElement.runtimeDataFilters = null;
};

const selectState = async (stateName?: string) => {
  if (!stateName) {
    resetFocus();
    return;
  }

  const query = layer.createQuery();
  query.where = `${query.where} AND StateName = '${stateName}'`;
  const objectIds = (await layer.queryObjectIds(query)) ?? [];
  const { extent } = await layer.queryExtent(query);

  if (!extent) {
    return;
  }

  void mapElement.goTo(extent.expand(1.5));
  layer.featureEffect = {
    filter: { where: query.where },
    excludedEffect: "opacity(0.25) grayscale(0.5) blur(2px)",
  };
  states.featureEffect = {
    filter: { where: `STATE_NAME = '${stateName}'` },
    excludedEffect: "opacity(0)",
    includedEffect: "drop-shadow(0, 0, 24px, darkgray)",
  };
  tableElement.filterGeometry = extent;
  tableElement.objectIds = objectIds;
  chartElement.runtimeDataFilters = {
    where: `${layer.objectIdField} IN (${objectIds.join(",")})`,
  };
};

mapElement.addEventListener("arcgisViewReadyChange", async () => {
  const map = mapElement.map;
  initialViewpoint = map.initialViewProperties.viewpoint;
  layer = map.allLayers.find(
    (candidate): candidate is FeatureLayer => candidate.title === "Change in harvested wheat from 1997 to 2022",
  ) as FeatureLayer;
  chartElement.layer = layer;
  chartElement.model = layer.charts?.[4];

  const boundaries = map.layers.at(0) as GroupLayer;
  states = boundaries?.layers.at(0) as FeatureLayer;
  states.renderer = { type: "simple", symbol: { type: "simple-fill", color: "white" } };

  const featureSet = await layer.queryFeatures({
    where: layer.createQuery().where,
    groupByFieldsForStatistics: ["StateName"],
    outStatistics: [{ statisticType: "sum", onStatisticField: "Wheat_prod_2022", outStatisticFieldName: "data" }],
  });
  const features = featureSet.features
    .sort((a, b) => b.attributes.data - a.attributes.data)
    .slice(0, 5);
  const maxProduction = Math.max(...features.map(({ attributes }) => attributes.data));
  createStateList(
    [
      { label: "All" },
      ...features.map(({ attributes }) => ({ label: attributes.StateName, production: attributes.data, value: attributes.StateName })),
    ],
    maxProduction,
  );
  tableElement.layer = layer;
  tableElement.actionColumnConfig = {
    label: "Go to feature",
    icon: "zoom-to-object",
    callback: (event: { feature: unknown }) => void mapElement.goTo(event.feature),
  };
});

stateListElement.addEventListener("calciteListItemSelect", (event) => {
  const item = event.target as HTMLElement & { value?: string };
  void selectState(item.value);
});

mapElement.addEventListener("arcgisViewChange", (event) => {
  tableElement.filterGeometry = (event.target as HTMLElement & { extent: unknown }).extent;
});
