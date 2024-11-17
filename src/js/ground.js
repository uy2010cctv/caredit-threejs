import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
//import * as kokomi from "kokomi.js";

function ground(scene) { 
   /* const textureLoader = new THREE.TextureLoader();
    var aspTex = textureLoader.load( 'https://s2.loli.net/2023/02/15/GcWBptwDKn8b2dU.jpg')
    var aoTex = textureLoader.load( 'https://s2.loli.net/2023/02/15/E5dajTYIucWL1vy.jpg')
    var roughnessTex = textureLoader.load( 'https://s2.loli.net/2023/02/15/aWeN6ED4mbpZGLs.jpg');
    //const mipmap = THREE.mi
    const floorMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color("#ffffff"),
        normalMap: aspTex,
        normalScale: new THREE.Vector2(1,1), //深度
        //aoMap: aoTex,
        //bumpMap: roughnessTex,
        //bumpScale:0.5,
        //map: baseTex,
        //roughnessMap: roughnessTex,
        shininess: 200,
      });
      aspTex.rotation = THREE.MathUtils.degToRad(90);
      aspTex.wrapS = aspTex.wrapT = THREE.MirroredRepeatWrapping;
      aspTex.repeat.set(5, 8);
      aoTex.wrapS = aoTex.wrapT = THREE.MirroredRepeatWrapping;
      roughnessTex.wrapS = roughnessTex.wrapT = THREE.MirroredRepeatWrapping;

      const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), floorMat);
      console.log('floor ',floor);
      floor.rotation.y = Math.PI / 2;
      scene.add(floor);
      floor.rotateX(-Math.PI / 2);
     */ 

    const geometry2 = new THREE.BoxGeometry(2.5, 5, 0.1);
    const lightm = new THREE.MeshBasicMaterial({           
        color: 0xffffff,
       // emissive: 0xffffff,
        //wireframe: true,
          //  transparent: true,
           // opacity: 0.5,
    });
    const uplight = new THREE.Mesh(geometry2, lightm);
        uplight.rotateX(-Math.PI / 2);
        uplight.position.y = 4.5;
;
        scene.add(uplight);
    
    const geometry = new THREE.PlaneGeometry(30, 60);
    const groundMirror = new Reflector(geometry, {
    clipBias: 0.003,
    //textureWidth: window.innerWidth * window.devicePixelRatio,
    //textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777

    });
    //const uj = new kokomi.UniformInjector();
    //groundMirror.position.z = -25;
    groundMirror.rotateX(-Math.PI / 2);
    scene.add(groundMirror);
}

export { ground };