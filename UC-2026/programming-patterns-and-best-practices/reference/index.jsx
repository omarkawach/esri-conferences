import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Calcite components
import '@esri/calcite-components/components/calcite-list'
import '@esri/calcite-components/components/calcite-list-item'
import '@esri/calcite-components/components/calcite-meter'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'
import '@esri/calcite-components/components/calcite-panel'
import '@esri/calcite-components/components/calcite-shell'

// Map components
import '@arcgis/map-components/components/arcgis-feature-table'
import '@arcgis/map-components/components/arcgis-legend'
import '@arcgis/map-components/components/arcgis-expand'
import '@arcgis/map-components/components/arcgis-placement'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-zoom'

// Charts components
import { defineCustomElements } from '@arcgis/charts-components/dist/loader'
defineCustomElements(window, {
  resourcesUrl: 'https://js.arcgis.com/charts-components/4.32/assets',
})

import { App } from './App'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
