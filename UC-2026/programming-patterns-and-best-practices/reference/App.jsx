import React, { useRef, useState } from 'react'

export const App = () => {
  const mapRef = useRef(null)
  const tableRef = useRef(null)
  const stateListRef = useRef(null)
  const chartRef = useRef(null)
  const [stateList, setStateList] = useState([])
  const [states, setStates] = useState([])
  const [maxProduction, setMaxProduction] = useState(0)
  const [layer, setLayer] = useState(null)

  const onViewReadyChange = async () => {
    const layer = mapRef.current.map.allLayers.find(
      (layer) => layer.title === 'Change in harvested wheat from 1997 to 2022',
    )
    setLayer(layer)

    chartRef.current.layer = layer
    chartRef.current.model = layer.charts[4]
    const boundaries = mapRef.current.map.layers.at(0)
    const states = boundaries.layers.at(0)
    states.renderer = {
      type: 'simple',
      symbol: {
        type: 'simple-fill',
        color: 'white',
      },
    }
    setStates(states)

    const stateListData = await createStatesList(layer)
    setStateList(stateListData)
  }

  const createStatesList = async (layer) => {
    const featureSet = await layer.queryFeatures({
      where: layer.createQuery().where,
      groupByFieldsForStatistics: ['StateName'],
      outStatistics: [
        {
          statisticType: 'sum',
          onStatisticField: 'Wheat_prod_2022',
          outStatisticFieldName: 'data',
        },
      ],
    })
    const features = featureSet.features
      .sort(({ attributes: { data: a } }, { attributes: { data: b } }) => b - a)
      .slice(0, 5)

    const max = Math.max(...features.map(({ attributes: { data } }) => data))
    setMaxProduction(max)

    return [
      { label: 'All' },
      ...features.map(({ attributes: { data, StateName } }) => ({
        label: StateName,
        production: data,
        value: StateName,
      })),
    ]
  }

  const selectState = async (stateName) => {
    if (!stateName) {
      resetFocus()
      return
    }
    const query = layer.createQuery()
    query.where = query.where + ` AND StateName = '${stateName}'`

    const objectIds = await layer.queryObjectIds(query)
    const { extent } = await layer.queryExtent(query)

    const focusInfo = {
      state: stateName,
      label: stateName,
      query,
      extent,
      objectIds,
    }

    applyFocus(focusInfo)
  }

  const applyFocus = (focusInfo) => {
    mapRef.current.goTo(focusInfo.extent.expand(1.5))
    layer.featureEffect = {
      filter: { where: focusInfo.query.where },
      excludedEffect: 'opacity(0.25) grayscale(0.5) blur(2px)',
    }
    states.featureEffect = {
      filter: { where: `STATE_NAME = '${focusInfo.state}'` },
      excludedEffect: 'opacity(0)',
      includedEffect: 'drop-shadow(0, 0, 24px, darkgray)',
    }
    tableRef.current.filterGeometry = focusInfo.geometry
    tableRef.current.objectIds = focusInfo.objectIds
    chartRef.current.runtimeDataFilters = {
      where: `${layer.objectIdField} IN (${focusInfo.objectIds.join(',')})`,
    }
  }

  const resetFocus = () => {
    mapRef.current.goTo(mapRef.current.map.initialViewProperties.viewpoint)
    layer.featureEffect = null
    states.featureEffect = {
      filter: { where: '1=1' },
      excludedEffect: 'opacity(0)',
      includedEffect: 'drop-shadow(0, 0, 24px, darkgray)',
    }
    tableRef.current.filterGeometry = null
    tableRef.current.objectIds = null
    chartRef.current.runtimeDataFilters = null
  }

  return (
    <calcite-shell className="app-theme">
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          slot="logo"
          heading="Change in harvested wheat from 1997 to 2022"
          icon="presentation"
        ></calcite-navigation-logo>
      </calcite-navigation>

      <div className="main-container">
        <div className="map-container">
          <arcgis-map
            id="map"
            className="map"
            item-id="e8497cf46dfb4252a3f57e81cb611092"
            ref={mapRef}
            onarcgisViewReadyChange={onViewReadyChange}
            onarcgisViewChange={(e) => {
              if (tableRef.current) {
                tableRef.current.filterGeometry = e.target.extent
              }
            }}
          >
            <arcgis-zoom position="top-left"></arcgis-zoom>
            <arcgis-expand position="bottom-left">
              <arcgis-legend></arcgis-legend>
            </arcgis-expand>
            <arcgis-expand position="top-right" mode="floating">
              <arcgis-placement>
                <calcite-panel className="states-list app-theme">
                  <calcite-list
                    id="stateList"
                    selection-mode="single-persist"
                    selection-appearance="border"
                    ref={stateListRef}
                    oncalciteListItemSelect={(e) => selectState(e.target.value)}
                  >
                    {stateList.map(({ label, production, value }, index) => (
                      <calcite-list-item label={label} value={value} selected={index === 0}>
                        {production && (
                          <calcite-meter
                            max={maxProduction}
                            value={production}
                            scale="s"
                            fill-type="single"
                            slot="content-bottom"
                          ></calcite-meter>
                        )}
                      </calcite-list-item>
                    ))}
                  </calcite-list>
                </calcite-panel>
              </arcgis-placement>
            </arcgis-expand>
          </arcgis-map>
        </div>

        <div className="with-chart-container">
          <arcgis-feature-table
            className="table"
            id="featureTable"
            reference-element="#map"
            ref={tableRef}
            layer={layer}
            actionColumnConfig={{
              label: 'Go to feature',
              icon: 'zoom-to-object',
              callback: (event) => mapRef.current.goTo(event.feature),
            }}
          ></arcgis-feature-table>
          <arcgis-chart className="chart" ref={chartRef}></arcgis-chart>
        </div>
      </div>
    </calcite-shell>
  )
}
