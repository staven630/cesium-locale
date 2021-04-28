# cesium-locale
```bash
npm i cesium-locale
````

# 使用

```bash
npm i cesium-locale
```

```js
import { Viewer, createWorldTerrain } from 'cesium';
import CesiumLocale from "cesium-locale";

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: createWorldTerrain(),
});

viewer.cesiumWidget.creditContainer.style.display = "none";

new CesiumLocale(viewer);
```