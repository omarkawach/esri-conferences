import { useState } from "react";

import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-panel";

import type WebMap from "@arcgis/core/WebMap";

import { hello } from "@devtech/utils";

type Props = {
  itemId: string;
  description?: string;
};

export default function MapPanel({
  itemId,
  description = hello("from the shared utils package"),
}: Props) {
  const [heading, setHeading] = useState("");
  const [summary, setSummary] = useState(description);

  const onViewReady = (event: Event) => {
    const mapElement = event.target as HTMLArcgisMapElement;
    const webmap = mapElement?.map as WebMap;
    const portalItem = webmap.portalItem;
    const nextHeading = portalItem?.title ?? "";
    const nextSummary =
      portalItem?.snippet || portalItem?.description || description;

    setHeading(nextHeading);
    setSummary(nextSummary);
  };

  return (
    <calcite-panel
      heading={heading}
      description={summary}
      className="map-panel"
    >
      <arcgis-map item-id={itemId} onarcgisViewReadyChange={onViewReady}>
        <arcgis-zoom slot="top-left"></arcgis-zoom>
        <arcgis-search slot="top-right"></arcgis-search>
        <arcgis-expand slot="bottom-left">
          <arcgis-legend></arcgis-legend>
        </arcgis-expand>
      </arcgis-map>
      <style>{`
        .map-panel {
          --calcite-panel-space: 0.75rem;
          border-radius: 12px;
        }

        arcgis-map {
          display: block;
          height: 420px;
          width: 100%;
        }

      `}</style>
    </calcite-panel>
  );
}
