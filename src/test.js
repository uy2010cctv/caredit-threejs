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