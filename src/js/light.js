import { AmbientLight, SpotLight, DirectionalLight,DirectionalLightHelper,PointLight } from 'three'

const Style = {
    default:{
        //envMap: TEXTURE.envMap,
        backgroundIntensity: 1.3,
        ambientLightIntensity: 1, // 光照强度
        directionalLightIntensity: 4,
        fogColor: 0xadd5ff,
    },
  }
  function createLight(scene) {
      // 点光源
      const pointLight = new PointLight(0xffffff, 0.5, 17, 0.8);
      pointLight.position.set(0, 4, 0)
      pointLight.castShadow = true
      pointLight.shadow.autoUpdate = false
      pointLight.shadow.bias = 100

      // 环境光
      const ambientLight = new AmbientLight(0xffffff, 0.5)
      ambientLight.intensity = Style.default.ambientLightIntensity
      ambientLight.name = 'ambientLight'

      const directionalLight1 = new DirectionalLight(0xffffff, 2);
      // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
       directionalLight1.position.set(8, 10, 0);
     // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
      directionalLight1.target.position.set(0, 0, 0);
   

     const directionalLight2 = new DirectionalLight(0xffffff, 2);
     // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
      directionalLight2.position.set(-8, 10, 0);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
     directionalLight2.target.position.set(0, 0, 0);
        scene.add(ambientLight)
        scene.add(pointLight)
         scene.add(directionalLight1);
         scene.add(directionalLight2);
    }
    export { createLight };