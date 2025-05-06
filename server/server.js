// server.js - Backend API với WebSocket để gửi log theo thời gian thực
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
      
      // Phân tích output để cập nhật tiến trình nếu có
      if (output.includes('progress') || output.includes('%')) {
        const progressMatch = output.match(/(\d+)%/);
        if (progressMatch && progressMatch[1]) {
          const progress = parseInt(progressMatch[1], 10);
          socket.emit('analysis-progress', progress);
        }
      }
      
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