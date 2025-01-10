const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 创建 express 实例
const app = express();
const port = 3000;

// 设置文件保存路径和文件名格式
const uploadDir = path.join(__dirname, 'uploads');

// 如果上传目录不存在，则创建
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 配置 multer 存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保文件保存在 uploads 文件夹下
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 使用原始文件名（包括后缀）
    cb(null, file.originalname);  // 保留原始文件名和后缀
  }
});

// 设置 multer 中间件，支持多个文件上传
const upload = multer({ storage: storage });

// 提供静态文件访问（可以通过浏览器查看上传的文件）
app.use('/uploads', express.static(uploadDir));

// 提供 index.html 文件访问
app.use(express.static(path.join(__dirname)));

// 处理多个文件上传的 POST 请求
app.post('/upload', upload.array('files'), (req, res) => {
  if (req.files) {
    res.send({
      message: 'Files uploaded successfully!',
      files: req.files.map(file => file.originalname)
    });
  } else {
    res.status(400).send({ message: 'No files uploaded!' });
  }
});

// 获取已上传文件的列表
app.get('/files', (req, res) => {
  // 读取上传目录下的文件列表
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }
    // 返回文件列表
    res.send({ files });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
