import * as fabric from 'fabric';



function setupCanvasDrawing() {

  var canvas = new fabric.Canvas('canvas133',{
  backgroundColor:'white',
  preserveObjectProportions: true, 
  width: 1024, // 设置画布的宽度
  height: 1024});
  var element = document.querySelector('.lower-canvas');
  element.style.width = '500px';
  element.style.height = '500px';
  var element1 = document.querySelector('.upper-canvas');
  element1.style.width = '500px';
  element1.style.height = '500px';

  let polygon;

   function addPolygon() {
    // 定义多边形的点
    var points = [
      {x: 100, y: 100},
      {x: 200, y: 100},
      {x: 200, y: 200},
      {x: 100, y: 200}
    ];

    // 创建多边形
    polygon = new fabric.Polygon(points, {
      left: 200,
      top: 50,
      fill: 'yellow',
      strokeWidth: 1,
      stroke: 'grey',
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'rgba(0,0,255,0.5)',
      cornerStyle: 'circle'
    });
    addControl(polygon)
  

    // 将多边形添加到 canvas
    canvas.add(polygon);
    canvas.setActiveObject(polygon);
  }

  function addControl(ele) {
    ele.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
      transparentCorners: false,
      cornerStyle: 'circle',
      cornerColor: 'rgba(0,0,255,0.5)'
    });

  };
  const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  var deleteImg = document.createElement('img');
  deleteImg.src = deleteIcon;
  function deleteObject(_eventData, transform) {
    const canvas = transform.target.canvas;
    canvas.remove(transform.target);
    canvas.requestRenderAll();
  }
  function renderIcon(ctx, left, top, _styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  let _clipboard;
  function Copy() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    canvas
      .getActiveObject()
      .clone()
      .then((cloned) => {
        _clipboard = cloned;
      });
  }
  async function Paste() {
    // clone again, so you can do multiple copies.
    const clonedObj = await _clipboard.clone();
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
    });
    addControl(clonedObj);
    if (clonedObj instanceof fabric.ActiveSelection) {
      // active selection needs a reference to the canvas.
      clonedObj.canvas = canvas;
      clonedObj.forEachObject((obj) => {
        canvas.add(obj);
      });
      // this should solve the unselectability
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }
    _clipboard.top += 10;
    _clipboard.left += 10;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  }
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'c') {
       Copy();
        console.log('copy操作');
    }
});
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'v') {
     Paste();
      console.log('paste操作');
  }
});
document.getElementById('add').addEventListener('click',function(){
  addPolygon();
});

document.getElementById('bgc').addEventListener('change',function(){
  var colorValue = this.value;
  canvas.set(
  {backgroundColor: colorValue});
  canvas.renderAll();
});
document.getElementById('upload').addEventListener('click', function(event) {
      document.getElementById('up1').click();
});

document.getElementById('up1').onchange = function handleImage(e) {
  var reader = new FileReader();
    reader.onload = function (event){
      var imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = function () {
        var image = new fabric.Image(imgObj);
        image.set({
              angle: 0,
              padding: 10,
              scaleY:1,
              scaleX:1,
              transparentCorners: false,
              cornerStyle: 'circle',
              cornerColor: 'rgba(0,0,255,0.5)'
        });
        addControl(image);
        canvas.centerObject(image);
        canvas.add(image);
        canvas.renderAll();
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }

}

// child.material.map = new THREE.CanvasTexture( drawingCanvas );
//child.material.map.needsUpdate = true;
export { setupCanvasDrawing };