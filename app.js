Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTgwODZjZS01MjNmLTRkZDQtOWI1Yy03YTM3ZTg3ODhlNmMiLCJpZCI6MTU1NjMsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjgxOTA0NTh9.p7RArNqBvgRRt5aGoZaKPArg_DjpCoh6xnVbRqGVoBU';
viewer = new Cesium.Viewer('cesiumContainer',{
    scene3DOnly: true,
    geocoder: true,
    homeButton: true,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton : false,
    animation: true,
    creditsDisplay: false,  //无法隐藏，通过手动修改cesium.js源码(serach key=by bing)
    timeline: true,
    fullscreenButton: true,
    selectionIndicator: false,
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      layer: 'tdtVecBasicLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
      show: false,
      enablePickFeatures: false, // 禁止卫图层鼠标点选
    })
});

/*
显示隐藏默认按钮 控件 参考
https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=view
*/

// Remove default base layer
//viewer.imageryLayers.remove(viewer.imageryLayers.get(0));

// Add Sentinel-2 imagery
//viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId : 3954 }));

// Load Cesium World Terrain
/*viewer.terrainProvider = Cesium.createWorldTerrain({
  requestWaterMask : true, // required for water effects
  requestVertexNormals : true // required for terrain lighting
});*/


// Enable depth testing so things behind the terrain disappear. 最上面的方可见
//viewer.scene.globe.depthTestAgainstTerrain = true;

// Enable lighting based on sun/moon positions
//viewer.scene.globe.enableLighting = true;


// Create an initial camera view
var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
var homeCameraView = {
    destination : initialPosition,
    orientation : {
        heading : initialOrientation.heading,
        pitch : initialOrientation.pitch,
        roll : initialOrientation.roll
    }
};
// Set the initial view
//viewer.scene.camera.setView(homeCameraView);

//实现相机飞行
// Add some camera flight animation options
homeCameraView.duration = 2.0;
homeCameraView.maximumHeight = 2000;
homeCameraView.pitchAdjustHeight = 2000;
homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
// Override the default home button
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
    e.cancel = true;
    viewer.scene.camera.flyTo(homeCameraView);
});


// Set up clock and timeline.
viewer.clock.shouldAnimate = true; // make the animation play when the viewer starts
viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
viewer.clock.multiplier = 2; // sets a speedup
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range



// 贴着地面画线
var line = viewer.entities.add({
  name:'line camp to ground',
  polyline:{
    positions: Cesium.Cartesian3.fromDegreesArray([-75,35,-125,35]),
    width: 10,
    material: Cesium.Color.BLUE,
    clampToGround: true
  }
});

// 画一条有海拔的线
var line = viewer.entities.add({
  name:'line',
  polyline:{
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75,35,500000,-125,35,500000]),
    width: 5,
    material: new Cesium.PolylineOutlineMaterialProperty({
      color : Cesium.Color.ORANGE,
      outlineWidth : 2,
      outlineColor : Cesium.Color.RED
  })
  }
});


// 画一个多边形状面
var bluePolygon = viewer.entities.add({
  name : 'Blue polygon with holes',
  polygon : {
      hierarchy : Cesium.Cartesian3.fromDegreesArray([-99.0, 30.0,
                                                          -85.0, 30.0,
                                                          -85.0, 40.0,
                                                          -99.0, 40.0]),
      material : Cesium.Color.BLUE.withAlpha(0.5),
      //extrudedHeight: 300000, //拉伸高度
      height : 200000,
      outline : true, // height is required for outline to display
      outlineColor: Cesium.Color.RED
  }
});

// 画一个box
var redBox = viewer.entities.add({
  name : 'Red box with black outline',
  position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
  box : {
      dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
      material : Cesium.Color.RED.withAlpha(0.5),
      outline : true,
      outlineColor : Cesium.Color.BLACK
  }
});


// 画一个圆
var greenCircle = viewer.entities.add({
  name : 'Green circle at height with ouline',
  position : Cesium.Cartesian3.fromDegrees(-131.0,40.0,15000.0),
  ellipse : {
    semiMinorAxis : 300000.0,
    semiMajorAxis : 300000.0,
    height : 0,
    material : Cesium.Color.GREEN,
    outline : true // height must be set for outline to display
  }
});

//viewer.zoomTo(viewer.entities);

// 画一个球体
var redSphere = viewer.entities.add({
  name : 'Red sphere with black outline',
  position: Cesium.Cartesian3.fromDegrees(-127.0, 60.0, 300000.0),
  ellipsoid : {
      radii : new Cesium.Cartesian3(300000.0, 300000.0, 300000.0),
      material : Cesium.Color.RED.withAlpha(0.5),
      outline : true,
      outlineColor : Cesium.Color.BLACK
  }
});

// 添加一个 Billboard 图片
viewer.entities.add({
  position : Cesium.Cartesian3.fromDegrees(-30, 40.03883),
  billboard :{
      image : 'resource/logo.png'
  }
});


// 添加图片
viewer.entities.add({
    position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
    billboard : {
        image : 'resource/autodesk.png', // default: undefined
        show : true, // default
        pixelOffset : new Cesium.Cartesian2(0, -50), // default: (0, 0)
        eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
        horizontalOrigin : Cesium.HorizontalOrigin.CENTER, // default
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM, // default: CENTER
        //scale : 2.0, // default: 1.0
        //color : Cesium.Color.LIME, // default: WHITE
        //rotation : Cesium.Math.PI_OVER_FOUR, // default: 0.0
        //alignedAxis : Cesium.Cartesian3.ZERO, // default
        //width : 100, // default: undefined
        //height : 25 // default: undefined
    }
});


// 添加lable
viewer.entities.add({
  position : Cesium.Cartesian3.fromDegrees(-75.1641667, 39.9522222),
  label : {
      text : 'www.teoform.com',
      font : '24px Helvetica',
      fillColor : Cesium.Color.SKYBLUE,
      outlineColor : Cesium.Color.BLACK,
      outlineWidth : 2,
      style : Cesium.LabelStyle.FILL_AND_OUTLINE
  }
});

// 设置标签属性
var entity = viewer.entities.add({
    position : Cesium.Cartesian3.fromDegrees(-75.1641667, 39.9522222, 300000.0),
    label : {
        text : 'Philadelphia'
    }
});
entity.label.scale = 2.0;
entity.label.showBackground = true;
