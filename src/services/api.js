// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const ApiService = {
  // Phân tích mẫu mô học
  analyzeSample: async (sampleId, modelId, fileName) => {
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        command: 'wsinfer run',
        parameters: {
          wsiDir: './slides/',
          resultsDir: `./results/${sampleId}/${modelId}/`,
          model: modelId,
          fileName: fileName
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gọi API phân tích:', error);
      throw error;
    }
  },

  // Lấy danh sách mẫu mô học
  getSamples: async () => {
    try {
      const response = await axios.get(`${API_URL}/samples`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách mẫu mô học:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của mẫu mô học
  getSampleById: async (sampleId) => {
    try {
      const response = await axios.get(`${API_URL}/samples/${sampleId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin mẫu mô học:', error);
      throw error;
    }
  },

  // Lấy kết quả phân tích
  getAnalysisResults: async (sampleId, modelId) => {
    try {
      const response = await axios.get(`${API_URL}/results/${sampleId}/${modelId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy kết quả phân tích:', error);
      throw error;
    }
  }
};

export default ApiService;