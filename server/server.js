// server.js - Backend API với WebSocket và hỗ trợ tải file
import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Lấy __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // URL của frontend Vite
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// WebSocket kết nối
io.on('connection', (socket) => {
  console.log('Client kết nối:', socket.id);
  
  socket.on('start-analysis', (data) => {
    console.log('Nhận yêu cầu phân tích từ client:', data);
    startAnalysis(socket, data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client ngắt kết nối:', socket.id);
  });
});

// Hàm thực hiện phân tích với WebSocket
function startAnalysis(socket, data) {
  try {
    const { sampleId, modelId, fileName } = data;
    const wsiDir = './slides/';
    const resultsDir = `./results/${sampleId}/${modelId}/`;
    
    // Gửi thông báo bắt đầu
    socket.emit('analysis-log', `Bắt đầu phân tích mẫu ${fileName} với mô hình ${modelId}`);
    
    // Tạo thư mục kết quả nếu chưa tồn tại
    try {
      fs.mkdirSync(path.resolve(resultsDir), { recursive: true });
      socket.emit('analysis-log', `Đã tạo thư mục kết quả: ${resultsDir}`);
    } catch (err) {
      socket.emit('analysis-log', `Lỗi khi tạo thư mục: ${err.message}`);
    }
    
    // Log chuyển thư mục
    socket.emit('analysis-log', `(base) hoangkhanh@192 bacsi % cd wsinfer`);
    
    // Sử dụng spawn để chạy lệnh wsinfer
    socket.emit('analysis-log', `(pytorch-env) (base) hoangkhanh@192 wsinfer % wsinfer run \\
   --wsi-dir ${wsiDir} \\
   --results-dir ${resultsDir} \\
   --model ${modelId}`);
    
    // Thực hiện lệnh wsinfer
    const wsinferProcess = spawn('wsinfer', [
      'run',
      '--wsi-dir', wsiDir,
      '--results-dir', resultsDir,
      '--model', modelId
    ], {
      cwd: path.resolve('../wsinfer'), // Chỉ định đường dẫn tới thư mục wsinfer
      shell: true,
    });
    
    // Theo dõi stdout và gửi về client
    wsinferProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('wsinfer output:', output);
      
      // Gửi log về client
      socket.emit('analysis-log', output);
    });
    
    // Theo dõi stderr và gửi về client
    wsinferProcess.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      console.error('wsinfer error:', errorOutput);
      socket.emit('analysis-log', `Lỗi: ${errorOutput}`);
    });
    
    // Xử lý khi lệnh hoàn thành
    wsinferProcess.on('close', (code) => {
      console.log(`wsinfer process exited with code ${code}`);
      
      if (code === 0) {
        socket.emit('analysis-log', `Phân tích hoàn thành thành công.`);
        socket.emit('analysis-log', `Finished.`);
        
        // Tạo kết quả giả lập
        const result = {
          status: 'success',
          time: new Date().toLocaleString(),
          resultPath: resultsDir,
          command: `wsinfer run --wsi-dir ${wsiDir} --results-dir ${resultsDir} --model ${modelId}`,
          summary: {
            totalSlides: 1,
            detectedRegions: Math.floor(Math.random() * 20) + 1,
            confidence: (Math.random() * (0.99 - 0.80) + 0.80).toFixed(2)
          }
        };
        
        // Gửi kết quả về client
        socket.emit('analysis-complete', result);
      } else {
        socket.emit('analysis-log', `Phân tích thất bại với exit code: ${code}`);
        socket.emit('analysis-error', `Phân tích thất bại với exit code: ${code}`);
      }
    });
    
  } catch (error) {
    console.error('Lỗi xử lý yêu cầu:', error);
    socket.emit('analysis-log', `Lỗi máy chủ: ${error.message}`);
    socket.emit('analysis-error', error.message || 'Lỗi máy chủ nội bộ');
  }
}

// API endpoint để tải file
app.get('/api/download', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ error: 'Thiếu đường dẫn file' });
    }
    
    // Đường dẫn tuyệt đối đến file
    const absolutePath = path.resolve('../', filePath);
    console.log('Tải file từ đường dẫn:', absolutePath);
    
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File không tồn tại' });
    }
    
    // Lấy tên file
    const fileName = path.basename(absolutePath);
    
    // Thiết lập header cho tải file
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Đọc và gửi file
    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Lỗi khi tải file:', error);
    res.status(500).json({ error: error.message || 'Lỗi máy chủ nội bộ' });
  }
});

// API endpoint để hiển thị file
app.get('/api/files', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ error: 'Thiếu đường dẫn file' });
    }
    
    // Đường dẫn tuyệt đối đến file
    const absolutePath = path.resolve('../', filePath);
    console.log('Hiển thị file từ đường dẫn:', absolutePath);
    
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File không tồn tại' });
    }
    
    // Thiết lập Content-Type dựa trên phần mở rộng file
    const ext = path.extname(absolutePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.json' || ext === '.geojson') contentType = 'application/json';
    
    res.setHeader('Content-Type', contentType);
    
    // Gửi file
    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Lỗi khi hiển thị file:', error);
    res.status(500).json({ error: error.message || 'Lỗi máy chủ nội bộ' });
  }
});

// API endpoint để kiểm tra trạng thái server
app.get('/api/status', (req, res) => {
  res.json({ status: 'Đang hoạt động', timestamp: new Date().toISOString() });
});

// Tương thích với API cũ
app.post('/api/analyze', async (req, res) => {
  res.json({
    success: true,
    message: 'Vui lòng sử dụng WebSocket để nhận log theo thời gian thực. API này chỉ để tương thích với phiên bản cũ.'
  });
});

// Khởi động server
httpServer.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});