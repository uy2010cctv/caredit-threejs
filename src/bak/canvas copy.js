import * as THREE from 'three';
import * as fabric from 'fabric';



function setupCanvasDrawing(child) {

    const card = new fabric.Canvas(canvas133, {
      backgroundColor: 'white'
    });
      card.setWidth(400);
      card.setHeight(400);
      card.selection = false;
      card.preserveObjectStacking = true; // 禁止选中图层时自定置于顶部
      
      let canvasState = null;
      let undoList = [];
      let redoList = [];
      let needsUpdate = () => {    
        child.material.map.needsUpdate = true;  
        console.log('needsUpdate',child.material.map.needsUpdate);
      }
      const drawingCanvas = document.getElementById( 'canvas133' );
      child.material.map = new THREE.CanvasTexture( drawingCanvas );
      console.log('tset',child.material.map);
      // 保存画布状态
      const saveState = () => {
        // 当有新操作时，清空恢复栈
        redoList = [];
        if (canvasState) {
          undoList.push(canvasState);
          document.getElementById('undo').removeAttribute('disabled');
        }
      
        // 保存当前画布信息
        canvasState = card.toJSON([
          'hasControls',
          'borderColor',
          'scaleX',
          'scaleY',
          'angle',
          'top',
          'left',
          'crossOrigin'
        ]);
      }
      saveState();
      
      /** 画布事件监听 **/
      card.on('object:modified', (e) => {
        console.log('当前操作的图层', e.target); // e.target为当前编辑的Object
        if (e.target.type !== 'sprite') {
          saveState();
          needsUpdate();
        }
      });
      
      card.on('object:removed', (e) => {
        console.log('被移除的图层：', e.target);
        saveState();
        needsUpdate();
      });
      
      
      // 获取当前选中的图层对象
      const getActiveObject = () => {
        return card.getActiveObject();
      }
      
      // 添加装饰
      document.getElementById('addImg').addEventListener('click', () => {
        const i = parseInt(Math.random() * 9) + 1;
        fabric.Image.fromURL(`https://sugars.oss-cn-shenzhen.aliyuncs.com/diy/decorate/decorate${i}.png`, (img) => {
          img.set({
            scaleX: 0.7,
            scaleY: 0.7,
            angle: 0,
            left: i * 10,
            top: i * 10,
            borderColor: '#ff8d23',
          });
          card.add(img);
          saveState();
        }, { crossOrigin: 'anonymous' });
      });
      
      // 添加文字
      document.getElementById('addText').addEventListener('click', () => {
        const textbox = new fabric.Textbox('这是一段文字', {
          left: 200,
          top: 50,
          width: 150,
          fontSize: 20, // 字体大小
          fontWeight: 800, // 字体粗细
          fill: '#000', // 字体颜色
          fontStyle: 'italic',  // 斜体
          hasControls: false,
          borderColor: 'orange',
          editingBorderColor: 'blue' // 点击文字进入编辑状态时的边框颜色
        });
        card.add(textbox);
        saveState();
      });
      
      
      // 旋转图层
      document.getElementById('rotate').addEventListener('click', () => {
        const selectObj = getActiveObject();
        if (selectObj) {
          // 顺时针90°旋转
          const currAngle = selectObj.angle; // 当前图层的角度
          const angle = currAngle === 360 ? 90 : currAngle + 90;
          selectObj.rotate(angle);
          card.renderAll();
          saveState();
        }
      });
      
      const _rotate = (selectObj, type) => {
        const scale = type === 'h' ? 'scaleX' : 'scaleY';
        selectObj.set({
          [scale]: -selectObj[scale]
        });
      
        card.renderAll();
        saveState();
      }
      
      // 水平翻转图层
      document.getElementById('flip-h').addEventListener('click', () => {
        const selectObj = getActiveObject();
        if (selectObj) {
          _rotate(selectObj, 'h')
        }
      });
      
      // 垂直翻转图层
      document.getElementById('flip-v').addEventListener('click', () => {
        const selectObj = getActiveObject();
        if (selectObj) {
          _rotate(selectObj, 'v')
        }
      });
      
      // 上移选中图层
      document.getElementById('bringForward').addEventListener('click', () => {
        const selectObj = getActiveObject();
        if (selectObj) {
          selectObj.bringForward();
          saveState();
        }
      });
      
      // 下移选中图层
      document.getElementById('sendBackwards').addEventListener('click', () => {
        const selectObj = getActiveObject();
        if (selectObj) {
          selectObj.sendBackwards();
          saveState();
        }
      });
      
      // 移除图层
      document.getElementById('remove').addEventListener('click', () => {
        const selectObj = getActiveObject();
        if (selectObj) {
          card.remove(selectObj); // 传入需要移除的object
          card.renderAll();
          saveState();
        }
      });
      
      // 导出画布json信息
      document.getElementById('toJson').addEventListener('click', () => {
        document.getElementById('output').innerHTML = JSON.stringify(card.toJSON());
      });
      
      // 导出画布为图片
      document.getElementById('toImg').addEventListener('click', () => {
        const dataURL = card.toDataURL({
          format: 'jpeg', // jpeg或png
          quality: 0.8 // 图片质量，仅jpeg时可用
        });
        document.getElementById('output').innerHTML = `<img src="${dataURL}" style="width:400px;height:400px;"/>`;
      });
      
      // 撤销
      document.getElementById('undo').addEventListener('click', () => {
        // 将最新的操作放至恢复栈
        redoList.push(canvasState);
        const lastState = { ...undoList[undoList.length - 1] };
        canvasState = lastState;
        undoList.pop();
        card.loadFromJSON(lastState, () => {
          card.renderAll();
          if (undoList.length === 0) {
            document.getElementById('undo').setAttribute('disabled', true);
          }
          document.getElementById('redo').removeAttribute('disabled');
        });
      })
      
      // 恢复
      document.getElementById('redo').addEventListener('click', () => {
        undoList.push(canvasState);
        const lastState = { ...redoList[redoList.length - 1] };
        canvasState = lastState;
        redoList.pop();
        card.loadFromJSON(lastState, () => {
          card.renderAll();
          if (redoList.length === 0) {
            document.getElementById('redo').setAttribute('disabled', true);
          }
          document.getElementById('undo').removeAttribute('disabled');
        });
      })
      
 
}

// child.material.map = new THREE.CanvasTexture( drawingCanvas );
//child.material.map.needsUpdate = true;
export { setupCanvasDrawing };