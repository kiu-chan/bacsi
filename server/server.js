// server.js - Backend API đơn giản để xử lý yêu cầu phân tích từ frontend
import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Lấy __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint để phân tích mẫu mô học
app.post('/api/analyze', async (req, res) => {
  try {
    const { parameters } = req.body;
    const { wsiDir, resultsDir, model, fileName } = parameters;

    console.log('Nhận yêu cầu phân tích:', { wsiDir, resultsDir, model, fileName });

    // Tạo thư mục kết quả nếu chưa tồn tại
    fs.mkdirSync(path.resolve(resultsDir), { recursive: true });

    // Xây dựng lệnh WSInfer
    const command = `cd .. && cd wsinfer && wsinfer run --wsi-dir ${wsiDir} --results-dir ${resultsDir} --model ${model}`;

    console.log('Thực hiện lệnh:', command);

    // Thực hiện lệnh WSInfer
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Lỗi thực hiện lệnh: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }
      if (stderr) {
        console.error(`Lỗi từ lệnh: ${stderr}`);
      }
      console.log(`Kết quả: ${stdout}`);
      
      // Gửi kết quả về cho client
      res.json({
        success: true,
        resultsPath: resultsDir,
        output: stdout
      });
    });
    
    /* 
    // Mô phỏng kết quả thành công (sử dụng nếu muốn test mà không cần thực sự chạy lệnh)
    setTimeout(() => {
      res.json({
        success: true,
        resultsPath: resultsDir,
        output: `Phân tích mẫu ${fileName} với mô hình ${model} hoàn thành.`
      });
    }, 1000);
    */
    
  } catch (error) {
    console.error('Lỗi xử lý yêu cầu:', error);
    res.status(500).json({ error: error.message || 'Lỗi máy chủ nội bộ' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});