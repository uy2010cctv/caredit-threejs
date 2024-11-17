import * as THREE from 'three'   

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

import { RGBELoader } from 'three/addons/loaders/RGBELoader';

// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'

import { OrbitControls } from 'three/addons/controls/OrbitControls';

//import  Dat  from 'three/addons/libs/dat.gui.module.js';

import  Stats  from 'three/addons/libs/stats.module.js';


//模型加载器
THREE.GLTFLoader = GLTFLoader;

THREE.FBXLoader = FBXLoader;

// THREE.DRACOLoader = DRACOLoader

//HDR加载器
THREE.RGBELoader = RGBELoader;

//控制器
THREE.OrbitControls = OrbitControls;

//状态面板
THREE.Dat = Dat;
THREE.Stats = Stats;

// 让模型自动居中
THREE.ModelAutoCenter =function(group){
		/**
		 * 包围盒全自动计算：模型整体居中
		 */
		var box3 = new THREE.Box3()
		// 计算层级模型group的包围盒
		// 模型group是加载一个三维模型返回的对象，包含多个网格模型
		box3.expandByObject(group)
		// 计算一个层级模型对应包围盒的几何体中心在世界坐标中的位置
		var center = new THREE.Vector3()
		box3.getCenter(center)
		// console.log('查看几何体中心坐标', center);

		// 重新设置模型的位置，使之居中。
		group.position.x = group.position.x - center.x
		group.position.y = group.position.y - center.y
		group.position.z = group.position.z - center.z
}

export default THREE;

            /*<button class="button button-3d button-box button-jumbo" style="font-size: 14px;background-color:aqua;width: 30px;height: 30px;line-height: 30px;border-radius:6px;box-shadow:0 7px 0 #03cfc8, 0 8px 3px rgba(0, 0, 0, 0.2)"  id="rotateButtony">y1</button>
            <button class="button button-3d button-box button-jumbo" style="font-size: 14px;background-color:aqua;width: 30px;height: 30px;line-height: 30px;border-radius:6px;box-shadow:0 7px 0 #03cfc8, 0 8px 3px rgba(0, 0, 0, 0.2)" id="rotateButtony2">y2</button>
            <button class="button button-3d button-box button-jumbo" style="font-size: 14px;background-color:aqua;width: 30px;height: 30px;line-height: 30px;border-radius:6px;box-shadow:0 7px 0 #03cfc8, 0 8px 3px rgba(0, 0, 0, 0.2)" id="rotateButtonx">x1</button>
            <button class="button button-3d button-box button-jumbo" style="font-size: 14px;background-color:aqua;width: 30px;height: 30px;line-height: 30px;border-radius:6px;box-shadow:0 7px 0 #03cfc8, 0 8px 3px rgba(0, 0, 0, 0.2)" id="rotateButtonx2">x2</button>

			
let t1 = gsap.timeline();
//const clock = new THREE.Clock();
function setcameray() {    
  //camera.rotation.set(0, 1.5, 0);
  t1.to(camera.position,{x:11, y:0, z:0.6,  duration:2})

}
function setcameray2() {    
  camera.rotation.set(-3.14, -1.5, -3.14);
  camera.position.set(-11, 0, -0.6);
}

function setcamerax() {    
  camera.rotation.set(-0.27, 0.007, 0.002);
  camera.position.set(0.09, 3.2, 11.5);
}

function setcamerax2() {    
  camera.rotation.set(-2.92, -0.01, -3.13);
  camera.position.set(-0.13, 2.6, -11.35);
}
let button = document.getElementById('rotateButtony');
let button2 = document.getElementById('rotateButtony2');
let button3 = document.getElementById('rotateButtonx');
let button4 = document.getElementById('rotateButtonx2');
// 添加点击事件监听器
button.addEventListener('click', setcameray);
button2.addEventListener('click', setcameray2);
button3.addEventListener('click', setcamerax);
button4.addEventListener('click', setcamerax2);