const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require("os");

// 创建 express 实例
const app = express();
const port = 3000;

// 获取本地内网 IP 地址
const networkInterfaces = os.networkInterfaces();
// 默认 localhost
let localIP = '127.0.0.1';
// 遍历网络接口，查找内网 IP 地址
for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIP = iface.address; // 获取内网 IP 地址
      break;
    }
  }
}


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
    // 使用 Buffer 来确保文件名以 UTF-8 编码保存
    const filename = Buffer.from(file.originalname, 'latin1').toString('utf8');  // 强制转换为 UTF-8 编码
    cb(null, filename);  // 保留原始文件名和后缀
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

// 删除单个文件
app.delete('/delete/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);  // 解码文件名
  const filePath = path.join(uploadDir, filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send({ message: `Failed to delete file: ${filename}` });
    }
    res.send({ message: 'File deleted successfully' });
  });
});

// 删除所有文件
app.delete('/delete-all', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send({ message: 'Error reading directory' });
    }

    if (files.length === 0) {
      return res.send({ message: 'No files to delete.' });
    }

    // 删除所有文件
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Failed to delete ${file}`);
        }
      });
    });

    res.send({ message: 'All files deleted successfully' });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器启动成功！`);
  console.log(`本地访问链接：http://localhost:${port}`);
  console.log(`内网访问链接：http://${localIP}:${port}`);
});
