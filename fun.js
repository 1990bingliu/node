// 相机飞行过去
function btnHome(){
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(globalView.posX, globalView.posY, globalView.posZ),
    orientation: {
      heading: globalView.heading,
      pitch: globalView.pitch,
      roll: globalView.roll,
    },
  });
}

// 查看当前相机 camera 数据
function btnNowView(){
const view = {
  posX: viewer.camera.position.x,
  posY: viewer.camera.position.y,
  posZ: viewer.camera.position.z,
  heading: viewer.camera.heading,
  pitch: viewer.camera.pitch,
  roll: viewer.camera.roll,
}
var info = JSON.stringify(view);
$('.msg-show').html(`camera:${info}`);
}

//viewer.zoomTo(bimModel);
setTimeout(function(){btnHome();},1500);
// 以文件形式 加载路线对象等

// 相机飞行
showPartPerspective = name => {
  const globalView = viewDatas[name]
  if (globalView) {
    viewer.camera.flyTo({
      destination: new Cesium.Cartesian3(globalView.posX, globalView.posY, globalView.posZ),
      orientation: {
        heading: globalView.heading,
        pitch: globalView.pitch,
        roll: globalView.roll,
      },
    })
  }
}

function drawPoint(point) {
  const pointEntry = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt),
    point: {
      pixelSize: 10,
      color: Cesium.Color.CHARTREUSE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  })
  return pointEntry;
}

var tmpPoint;
$(document).ready(function(){
  $('#viewCrossing').change(function(){
    var name = $(this).val()
    showPartPerspective(name);
  });


  $('.viewPick').on('click',function(){
    var isckeck = $(this).is(':checked');
    if(isckeck){
      //注册点击事件
      console.log(isckeck);
      viewer.screenSpaceEventHandler.setInputAction(function(clickEvent){
        var cartesian;
        var msg = ''
        if(viewer.scene.pick(clickEvent.position)){
          msg = "pick success:";
          cartesian = viewer.scene.pickPosition(clickEvent.position);
        } else {
          var ray = viewer.camera.getPickRay(clickEvent.position);
          cartesian = viewer.scene.globe.pick(ray,viewer.scene);
        }

        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
        const lon = Cesium.Math.toDegrees(cartographic.longitude) // 经度
        const lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬度
        // const height = Math.ceil(cartographic.height) // 海拔
        const point = { lon, lat, alt: cartographic.height }

        //清空点
        console.log(tmpPoint)
        if(tmpPoint!=null) viewer.entities.remove(tmpPoint);
        //绘制点
        tmpPoint = drawPoint(point);

        //显示数据
        var info = JSON.stringify(point);
        $('.msg-show').html(`${msg}:${info}`);
        console.log(msg,cartesian,point);

      },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }else{ 
      //清空
      if(tmpPoint!=null) viewer.entities.remove(tmpPoint);
      tmpPoint = null;

      // 取消注册
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      $('.msg-show').html('');
    }

  });

 });