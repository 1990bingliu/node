//加载地形
terrainLayer = new Cesium.CesiumTerrainProvider({
  url: `resource/terrain`,
  requestWaterMask: true,
  credit: '',
});
viewer.terrainProvider = terrainLayer;

// 3D tiles调试工具
/*
viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
*/

// 加载3DTile,倾斜摄影模型 

bimModel = new Cesium.Cesium3DTileset({
  url: '/bimstatic/gisModels/part1/Production_2.json',
  maximumScreenSpaceError:  1, // Temporary workaround for low memory mobile devices - Increase maximum error to 8.
  maximumNumberOfLoadedTiles:  1000, // Temporary workaround for low memory mobile devices - Decrease (disable) tile cache.
});

viewer.scene.primitives.add(bimModel);
//viewer.zoomTo(bimModel);


// 初始视角坐标
const globalView = {
  posX: -2403104.2385636913,
  posY: 5387159.94191326,
  posZ: 2446754.6579857892,
  heading: 0.4277303591713224,
  pitch: -1.3255961755545487,
  roll: 0.004107272957088348,
}

//viewer.zoomTo(bimModel);


const promiseRoad = Cesium.GeoJsonDataSource.load('resource/model/roadline.geojson');
promiseRoad.then(dataSource => {
  viewer.dataSources.add(dataSource)

  // 获取 entities 数组
  const entities = dataSource.entities.values
  const color = Cesium.Color.fromRandom({
    red: 0,
    green: 0.5,
    blue: 0.85,
    alpha: 0.8,
  })

  const color2 = Cesium.Color.fromRandom({
    red: 1,
    green: 1,
    blue: 0,
    alpha: 0.8,
  })
  
  for (let i = 0; i < entities.length; i += 1) {
    const entity = entities[i]
    if (i <= 1) {
      entity.polyline.material = color
    } else {
      entity.polyline.material = color2
    }
    entity.polyline.clampToGround = true
  }
})



// 加载站点文件数据
const promise = Cesium.GeoJsonDataSource.load('resource/model/stationPoint.geojson');
promise.then(dataSource => {
  viewer.dataSources.add(dataSource)

  // 获取 entities 数组
  const entities = dataSource.entities.values
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    Name = entity.properties.getValue('Name')

    entity.billboard = {}

    entity.point = {
      pixelSize: 5,
      color: Cesium.Color.DARKTURQUOISE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    }
    entity.label = {
      text: Name.Name,
      font: '20px  SimHei',
      showBackground: true,
      // backgroundColor :new Cesium.Color(0, 0.98, 0.6, 0.2),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      backgroundPadding: new Cesium.Cartesian2(5, 5),
      // fillColor: new Cesium.Color(0,0,0, 1),
      pixelOffset: new Cesium.Cartesian2(0, -20),
      scaleByDistance: new Cesium.NearFarScalar(6.0e2, 1.0, 6.0e4, 0.0),
    }
    //entity.description = '<div>test</div>'
  }
})


// 加载道岔模型文件数据
const url = `resource/model/turnout.geojson`
const promise2 = Cesium.GeoJsonDataSource.load(url)
promise2.then(dataSource => {
  viewer.dataSources.add(dataSource)
  // 获取 entities 数组
  const entities = dataSource.entities.values
  const color = Cesium.Color.fromRandom({
    red: 0,
    green: 0.5,
    blue: 0.85,
    alpha: 0.6,
  })
  for (let i = 0; i < entities.length; i += 1) {
    
    const entity = entities[i]

    const height = entity.properties.getValue('height')
    entity.polygon.material = color
    entity.polygon.outlineColor = color
    entity.polygon.extrudedHeight = height.height
  }
})

 // 加载路口模型文件数据
 const url2 = `resource/model/crossing.geojson`
 const promiseRoad2 = Cesium.GeoJsonDataSource.load(url2)
 promiseRoad2.then(dataSource => {
   viewer.dataSources.add(dataSource)

   const entities = dataSource.entities.values
   const color = Cesium.Color.fromRandom({
     red: 0,
     green: 0.5,
     blue: 0.85,
     alpha: 0.4,
   })
   const color2 = Cesium.Color.fromRandom({
     red: 1,
     green: 0,
     blue: 0,
     alpha: 0.4,
   })
   for (let i = 0; i < entities.length; i += 1) {
     const entity = entities[i]
     const height = entity.properties.getValue('height').height

     // 严重拥堵路口遮罩颜色
     if (i === 4) {
       entity.polygon.material = color2
       entity.polygon.outlineColor = color2
     } else {
       entity.polygon.material = color
       entity.polygon.outlineColor = color
     }
     entity.polygon.extrudedHeight = height
   }
 });


 // 加载变电站
 createIconLayer = (datas) => {
  for (let i = 0; i < datas.length; i += 1) {
    const data = datas[i]
    const entity = {
      // id: data.text.name,
      // show:false,
      //parent: layerObject[id],
      position: Cesium.Cartesian3.fromDegrees(data.position.lon, data.position.lat, data.position.alt),
      billboard: {
        image: `resource${data.url}`,
        width: 100,
        height: 100,
        scale: 0.5,
        heightReference: Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(6.0e2, 1.0, 6.0e4, 0.0),
      },
      label: {
        text: createTrainLabelText(data.text),
        font: '12px SimHei',
        showBackground: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        // fillColor: new Cesium.Color(0.003, 0.098, 0.208, 1),
        pixelOffset: new Cesium.Cartesian2(0, -50),
        scaleByDistance: new Cesium.NearFarScalar(6.0e2, 1.0, 6.0e4, 0.0),
      },
    }
    viewer.entities.add(entity)
  }
}

createTrainLabelText = data => {
  let textStr = ''
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key]
      textStr += `${key}:${value}\n`
    }
  }
  return textStr
}

createIconLayer(substationDatas);
