import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let renderer, camera;
let line;
let stats;
let car;
let raycaster;
let mouseHelper;
const dracoLoader = new DRACOLoader();
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3()
};
var scene = new THREE.Scene();
const mouse = new THREE.Vector2();
const intersects = [];
const position = new THREE.Vector3();//相机位置
const orientation = new THREE.Euler();//相机方向
let select = [];
inti();

function inti() {

  scene.background = new THREE.Color(0x333333);
  scene.environment = new RGBELoader().load('venice_sunset_1k.hdr');
  scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.fog = new THREE.Fog(0x333333, 10, 30);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  stats = new Stats();
  document.body.appendChild(stats.dom);

  dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');
  const geometry = new THREE.BufferGeometry();

	geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
  line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color:0xff0000}) );
  scene.add( line );

  loadModel();


  /*const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(80, 100, 50);
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  directionalLight.target.position.set(0, 0, 0);
  scene.add(directionalLight);
  // 辅助线
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
  scene.add(dirLightHelper);*/

  //camera.position.z = 100;
  camera.position.set(10, 0, 12);
  
  //camera.lookAt(0, 0, 0)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false; //禁止右键拖拽

  const cx = 0,cy = 2,cz = 0; //通过OrbitControls辅助设置
  camera.lookAt(cx, cy, cz);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
  controls.target.set(cx, cy, cz); //与lookAt参数保持一致
  controls.update();
  controls.minDistance = 7;
  controls.maxDistance = 30;
  controls.rotateSpeed = 1; //旋转速度
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件

  /*距离消息
  controls.addEventListener('change',function(){
    //相机位置与目标观察点距离
    const dis = controls.getDistance();
    console.log('dis',dis);
  })*/
  /*var axesHelper = new THREE.AxesHelper(12); //坐标轴辅助线
  scene.add(axesHelper);  */

  mouseHelper = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1, 0.1), new THREE.MeshNormalMaterial());
  //mouseHelper.visible = false;
  scene.add(mouseHelper);

  // 鼠标交互
  line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  scene.add(line);

  //网格线绘制
  var grid = new THREE.GridHelper(24, 24, 0xFF0000, 0x444444);
  grid.material.opacity = 0.4;
  grid.material.transparent = true;
  //grid.rotation.x = Math.PI/2.0;
  scene.add(grid);


  window.addEventListener( 'resize', onWindowResize );

  let moved = false;

  controls.addEventListener( 'change', function () {

    moved = true;

  } );

  window.addEventListener( 'pointerdown', function () {

    moved = false;

  } );

  window.addEventListener( 'pointerup', function ( event ) {

    if ( moved === false ) {

      checkIntersection( event.clientX, event.clientY );

      //if ( intersection.intersects ){};
    }

  } );

  window.addEventListener( 'pointermove', onPointerMove );

  function onPointerMove( event ) {

    if ( event.isPrimary ) {
      var divObj = renderer.domElement.getBoundingClientRect();
      //修正鼠标坐标
      checkIntersection( event.clientX, event.clientY-divObj.top );
    }

  }
  
  raycaster = new THREE.Raycaster();
  // 射线交叉计算 鼠标-模型交点面
   function checkIntersection (x,y) {
    if ( car === undefined ) return;

    mouse.x = ( x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( y / window.innerHeight ) * 2 + 1;
    //console.log('mouse', mouse.x);
    //console.log('mouse', mouse.y);
    raycaster.setFromCamera( mouse, camera );
    //raycaster.intersectObject( car, false, intersects );
   
     // 遍历car中的所有子模型
     car.children.forEach(child => {
      // 检查子模型是否是
      if (child.name.includes('K')||child.name.includes('D')) {
          raycaster.intersectObject(child, false, intersects);

      }
  });
    if ( intersects.length > 0 ) {
        //console.log('intersection', intersects.length);
        
      const p = intersects[ 0 ].point;
      mouseHelper.position.copy( p );
      intersection.point.copy( p );

      const normalMatrix = new THREE.Matrix3().getNormalMatrix( car.matrixWorld );

      const n = intersects[ 0 ].face.normal.clone();
      n.applyNormalMatrix( normalMatrix );
      n.multiplyScalar( 1 );
      n.add( intersects[ 0 ].point );

      intersection.normal.copy( intersects[ 0 ].face.normal );
      mouseHelper.lookAt( n );

      const positions = line.geometry.attributes.position;
      positions.setXYZ( 0, p.x, p.y, p.z );
      console.log('Mouse Y:', mouseHelper.position.y);
      console.log('Position Y:', p.y);
      positions.setXYZ( 1, n.x, n.y, n.z );
      positions.needsUpdate = true;
      //console.log('line', intersects[ 0 ].point);
      intersection.intersects = true;

      intersects.length = 0;

    } else {

      intersection.intersects = false;

    }
  }
  // 射线交叉计算


  const gui = new GUI();
  gui.open();
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load('ID3-app.gltf', function (gltf) {
    car = gltf.scene;
    console.log('控制台查看加载gltf文件返回的对象结构', gltf);
    console.log('gltf对象场景属性', gltf.scene);
    scene.add(car);
  }, undefined, function (error) {
    console.error(error);
  });

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

var render = function () {
  requestAnimationFrame( render );
  stats.update();
  renderer.render(scene, camera);
};

render();
