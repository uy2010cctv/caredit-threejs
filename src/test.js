document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file && file.type === 'image/png') {
      const formData = new FormData();
      // 将文件添加到 FormData 实例中
      formData.append('file', file);
      // 使用 fetch API 上传文件
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Upload successful:', data);
      })
      .catch(error => {
        console.error('Upload failed:', error);
      });
    }
  
    });

    <button id="flip-h" disableds>水平翻转图层</button>
    <button id="flip-v" disabled>垂直翻转图层</button>

    <button id="toJson" disabled>导出画布json信息</button>