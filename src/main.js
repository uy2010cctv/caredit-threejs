import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { createLight } from "./js/light"
import { ground } from "./js/ground"
import { setupCanvasDrawing } from "./js/canvas"


import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



let renderer, camera;
let line;
let stats;
let car;
let raycaster;
let mouseHelper;
let selectedIndex;
let index = 0;
let canvastexture = [];
//const dracoLoader = new DRACOLoader();
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3()
};
var scene = new THREE.Scene();
const mouse = new THREE.Vector2();
const intersects = [];
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
let select ;
const size = new THREE.Vector3( 0.25, 0.25, 0.25 );

let obj = {
  color:0x00ffff,
  roughness: 1, // 初始粗糙度
  metalness: 0, // 初始金属度
};

let selectpart = {
  name: '',
  color:0x00ffff,
  roughness: 1, 
  metalness: 0, 
};



const editmode = {
  decalsedit: false,
  coloredit: true,
  opencanvas: false,
};

const selectorContainer = document.getElementById('selector');
const DecalsContainer = document.getElementById('decalslist');
const listde = document.createDocumentFragment();
const des = [];
const list = document.createDocumentFragment();
const imgs = [];

const decalsparams = {
  Scale: 0.25,
};

const decalTextureUrls = [
  'decals/dogs.png'
  ];
const textureLoader = new THREE.TextureLoader();
let decalTextures = [];
updateDecalTextures();

const decalMaterial = new THREE.MeshPhongMaterial({
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: - 4,
  wireframe: false
});
/*
const customMaterial = new THREE.ShaderMaterial({
  vertexShader: PLAIN_VERT,
  fragmentShader: PLAIN_FULL_FRAG,
  depthTest: true,
  depthWrite: false,
  uniforms: {
    mainTex: {
      value: decalTextures[0],
    },
  },
  polygonOffset: true,
  polygonOffsetFactor: -4,
  wireframe: false,
  blending: THREE.CustomBlending,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneMinusSrcAlphaFactor,
});*/

const decals = [];
let decalsIdCounter = 0;



inti();


function inti() { 
  createLight(scene);
  ground(scene);
  setupCanvasDrawing();
  scene.environment = new RGBELoader().load('hdr1.hdr');
  scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment.colorSpace = THREE.SRGBColorSpace;
  
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  stats = new Stats();
  document.body.appendChild(stats.dom);

 //dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');
  const geometry = new THREE.BufferGeometry();

	geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
  line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color:0xff0000,transparent: true, // 设置材质为透明
  opacity: 0}) );
  scene.add( line );

  loadModel();


  //camera.position.z = 100;
  camera.position.set(5,1,9);
  
  //camera.lookAt(0, 0, 0)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false; //禁止右键拖拽

  const cx = 0,cy = 1.5,cz = 0; //通过OrbitControls辅助设置
  camera.lookAt(cx, cy, cz);
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
  controls.target.set(cx, cy, cz); //与lookAt参数保持一致
  controls.update();
  controls.minDistance = 5;
  controls.maxDistance = 10;
  controls.minPolarAngle = 1.2;//最小相机倾角
  controls.maxPolarAngle = 1.57;//最大相机倾角
  controls.rotateSpeed = 1; //旋转速度
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {

    renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件


  mouseHelper = new THREE.Mesh(new THREE.TetrahedronGeometry(0.01, 0), new THREE.MeshNormalMaterial());
  mouseHelper.visible = false;
  scene.add(mouseHelper);

  // 鼠标交互





  window.addEventListener( 'resize', onWindowResize );
  let moved = false;

  controls.addEventListener( 'change', function () {
    moved = true;
   // console.log('controls.', controls)

  } );

  window.addEventListener( 'pointerdown', function () {
    moved = false;
;
  } );

  window.addEventListener( 'pointerup', function ( event ) {
    if ( moved === false ) {
      var divObj = renderer.domElement.getBoundingClientRect();
      //修正鼠标坐标
      checkIntersection( event.clientX, event.clientY-divObj.top );
      if(editmode.decalsedit === true){
      addDecal();

    }
    updateGUI()
    try {
      selectpart = {  
        name: select.object.name,     
        color:select.object.material.color,
        roughness: select.object.material.roughness,         
        metalness: select.object.material.metalness,  
      };

      console.log('selectpart', select.object);
      } catch (error) {
        console.log('Not defined');
      }
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
  // 射线交叉计算 鼠标-模型交点面--------------------------------------------------
   function checkIntersection (x,y) {
    if ( car === undefined ) return;

    mouse.x = ( x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( y / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    //raycaster.intersectObject( car, false, intersects );
   
     // 遍历car中的所有子模型
     car.children.forEach(child => {
      // 检查子模型是否是
      if (child.name.includes('K')||child.name.includes('D')||child.name.includes('H')) {
          raycaster.intersectObject(child, false, intersects);
          select = intersects[0] ;
      }
  });
    if ( intersects.length > 0 ) {
        
      const p = intersects[ 0 ].point;
      mouseHelper.position.copy( p );
      intersection.point.copy( p );

      const normalMatrix = new THREE.Matrix3().getNormalMatrix( car.matrixWorld );

      const n = intersects[ 0 ].face.normal.clone();
      n.applyNormalMatrix( normalMatrix );
      n.multiplyScalar( 0.5 );
      n.add( intersects[ 0 ].point );

      intersection.normal.copy( intersects[ 0 ].face.normal );
      mouseHelper.lookAt( n );

      const positions = line.geometry.attributes.position;
      positions.setXYZ( 0, p.x, p.y, p.z );
      positions.setXYZ( 1, n.x, n.y, n.z );
      positions.needsUpdate = true;
      intersection.intersects = true;

      intersects.length = 0;

    } else {

      intersection.intersects = false;

    }
    
  }
//GUI-----------------------------------------------------

  decalTextureUrls.forEach((item, index) => {
    const imgDom = document.createElement('img');
    imgDom.classList.add('img');
    imgDom.src = item;
    imgDom.id = 'de';
    imgs.push(imgDom);
    imgDom.onclick = () => {
      imgs.forEach(item => item.classList.remove('active'));
      if (selectedIndex === index) {
        selectedIndex = -1;
        return;
      }
      selectedIndex = index;
      imgDom.classList.add('active');
    };
    list.appendChild(imgDom);
  });

  selectorContainer.append(list);

  const gui = new GUI();
  const colerFolder = gui.addFolder('Modify material 颜色材质');
  colerFolder.close();
  colerFolder.add(editmode, 'coloredit');
  colerFolder.addColor(obj, 'color').onChange(function (value) {
      car.children.forEach(child => {
      // 检查子模型是否是,have bug
      if (child.name.includes('H1')||child.name.includes('K1')) {
        if(editmode.coloredit === true){
          child.material.color.set(value);
        }//console.log('修改颜色',child);
      }})
  });//全车改色颜色选择器
  colerFolder.add(obj, 'roughness', 0, 1).onChange(function(value) {
    car.children.forEach(child => {
      // 检查子模型是否是,have bug
      if (child.name.includes('H1')||child.name.includes('K1')) {
        if(editmode.coloredit === true){
        child.material.roughness = value;
        }
      }})
});
colerFolder.add(obj, 'metalness', 0, 1).onChange(function(value) {
  car.children.forEach(child => {
      // 检查子模型是否是,have bug
      if (child.name.includes('H1')||child.name.includes('K1')) {
        child.material.metalness = value;
      }})
});

function updateGUI() {
  try{
  colerFolder4.setValue(select.object.name);
  colerFolder3.setValue(select.object.material.color.getHex().toString(16));
  colerFolder5.setValue(select.object.material.roughness );
  colerFolder6.setValue(select.object.material.metalness);
  canvasFolder2.setValue(select.object.name);} catch (error) {
      }
}
const colerFolder2 = colerFolder.addFolder('Part Modify');
const colerFolder4 = colerFolder2.add(selectpart, 'name')
const colerFolder3 = colerFolder2.addColor(selectpart, 'color').onChange( function(value) {
  car.children.forEach(child => {
    if (child.name === colerFolder4.getValue()) {
      child.material.color.set(value);
    }})
});
const colerFolder5 = colerFolder2.add(selectpart, 'roughness', 0, 1).onChange( function(value) {
  car.children.forEach(child => {
    if (child.name === colerFolder4.getValue()) {
      child.material.roughness = value;
    }})
});
const colerFolder6 = colerFolder2.add(selectpart,'metalness', 0, 1).onChange( function(value) {
  car.children.forEach(child => {
    if (child.name === colerFolder4.getValue()) {
      child.material.metalness = value;
    }})
});


const decalsFolder = gui.addFolder('Decals System 贴纸系统 (demo)');
decalsFolder.close();
decalsFolder.add(editmode, 'decalsedit').onChange(function(value) {
  if(editmode.decalsedit === true){
    document.getElementById("selector").style.display = 'flex';
    document.getElementById("decalslist").style.display = 'flex';
    document.querySelector(".options-container").style.display = 'flex';
    }else{  
      document.getElementById("selector").style.display = 'none';  
      document.getElementById("decalslist").style.display = 'none';
      document.querySelector(".options-container").style.display = 'none'; 

    }  
});

const canvasFolder = gui.addFolder('Canvas System (demo)');
canvasFolder.close();
canvasFolder.add(editmode, 'opencanvas').onChange(function(value) {
  if(editmode.opencanvas === true){
    document.getElementById("drawing-canvas").style.display = 'flex';
    canvastexture = new THREE.CanvasTexture(document.getElementById("canvas133"));
    canvastexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    car.children.forEach(child => {
      if (child.name.includes('H1')||child.name.includes('K1')||child.name.includes('K2')) {
        child.material.color.set('white');
        child.material.map = canvastexture;
        child.material.map.minFilter = THREE.LinearFilter
        child.material.map.colorSpace = 'srgb'
        //console.log("map",child.material.map)
      }})
    }else{  
      document.getElementById("drawing-canvas").style.display = 'none';
    }  
});

decalsFolder.add(decalsparams,'Scale', 0, 2);

  gui.open();
  //
 
}

function loadModel() {
  const loader = new GLTFLoader();
 // loader.setDRACOLoader(dracoLoader);
  loader.load('ID3-app2.gltf'
  , function (gltf) {
    car = gltf.scene;
    console.log('控制台查看加载gltf文件返回的对象结构', gltf);
    console.log('gltf对象场景属性', gltf.scene);
    scene.add(car);
    document.getElementById("container").style.display = 'none';

  }, function (xhr) {

    const percent = xhr.loaded / xhr.total;
    // console.log('加载进度' + percent);
    const percentDiv = document.getElementById("per"); //进度条元素
    percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
    percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文本
    // Math.floor:小数加载进度取整
    percentDiv.innerHTML = Math.floor(percent * 100) + '%'; //进度百分比

  }, function (error) {
    console.error(error);
  });

}

function createdecal(geometry, material) {
  // 递增编号
  decalsIdCounter += 1;

  const mesh = new THREE.Mesh(geometry, material);

  // 设置decals的名字
  mesh.name = `decals_${decalsIdCounter}`;

  return mesh;
}

function addDecal() {
  //position.copy( intersection.point );
  position.z = intersection.point.z;
  position.y = intersection.point.y;
  position.x = intersection.point.x;
  orientation.copy( camera.rotation ); 
  //orientation.copy( mouseHelper.rotation ); 
  const material1 = decalMaterial.clone();
  if (selectedIndex >= 0) {
    index = selectedIndex;
  }
  material1.map = decalTextures[index];
  let aspectRatio = material1.map.image.width / material1.map.image.height;
  size.set( decalsparams.Scale, decalsparams.Scale/aspectRatio, decalsparams.Scale);

try {
  const decal1 = new DecalGeometry( select.object, position, orientation, size )


  const m = new createdecal(decal1, material1 );
  m.renderOrder = decals.length; // give decals a fixed render order

  decals.push( m );
  Decalslist();
  select.object.attach( m );
} catch (error) {
  //console.log('未选中目标');
}
}

function Decalslist(){
  des.length = 0;
  decals.forEach((item, index) => {
    const deDom = document.createElement('li');
    deDom.classList.add('li');
    deDom.id = `decal-${index}`;
    deDom.textContent = item.name; 
    deDom.addEventListener('click', () => {
      des.forEach((item) => item.classList.remove('active'));
      if (deDom.classList.contains('active')) {
        deDom.classList.remove('active');
      } else {
        deDom.classList.add('active');
        console.log('点击贴纸', item);
      }
    });
    des.push(deDom);
    const decalsimg = document.createElement('img');
    decalsimg.src = item.material.map.image.src;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      car.children.forEach(child => {
        child.children.forEach(decal4 => {
          if (decal4.name === item.name) {
          decals.splice(decals.indexOf(item), 1);
          child.remove(decal4);
          console.log('de', decal4);
          }
        });
      });
      Decalslist();
    });
    deDom.appendChild(decalsimg);
    deDom.appendChild(deleteBtn);
    listde.appendChild(deDom);
  });
  DecalsContainer.innerHTML = '';
  DecalsContainer.append(listde);


}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
//upload decal texture--------------------------------------------------------------------
function updateDecalTextures() {
  decalTextures = decalTextureUrls.map(url => {
    return textureLoader.load(url);
  });
}

function updatePageElements() {
  updateDecalTextures();
  imgs.length = 0;
  // 重新遍历decalTextureUrls数组
  decalTextureUrls.forEach((item, index) => {
    const imgDom = document.createElement('img');
    imgDom.classList.add('img');
    imgDom.src = item;
    imgDom.id = 'de';
    imgs.push(imgDom);
    imgDom.onclick = () => {
      //debugger
      imgs.forEach(item => item.classList.remove('active'));
      if (selectedIndex === index) {
        selectedIndex = -1;
        return;
      }
      selectedIndex = index;
      imgs[index].classList.add('active');
    };
    //console.log('add list');
    list.appendChild(imgDom);
  });
 // console.log('decalTextureUrls:',decalTextureUrls);
  selectorContainer.innerHTML = '';
  selectorContainer.append(list);
}

document.querySelector('.upload-container').addEventListener('click', function(event) {
  if (event.target.classList.contains('upload-icon')) {
      document.getElementById('fileInput').click();
  }
});

document.getElementById('fileInput').addEventListener('change', function() {
  
  const file = this.files[0];

  if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = function(e) {
          const imageUrl = e.target.result;
          //const imageArray = JSON.parse(sessionStorage.getItem('images')) || [];
          let imageArray = [];
          imageArray.push(imageUrl);
          //sessionStorage.setItem('images', JSON.stringify(imageArray));
          decalTextureUrls.push(imageArray[imageArray.length - 1]);
        
          updatePageElements();
      };

      reader.readAsDataURL(file);
  } else {
      alert('Please select a PNG image file to upload.');
  }
});
//---------------------------------------------------------------------------------
var render = function () {
  //camera.updateProjectionMatrix();
  requestAnimationFrame( render );
  canvastexture.needsUpdate = true;
  stats.update();
  renderer.render(scene, camera);
};

render();
