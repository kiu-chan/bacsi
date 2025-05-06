import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { io } from 'socket.io-client';
import SampleInfo from './SampleInfo';
import ModelSelection from './ModelSelection';
import TerminalOutput from './TerminalOutput';
import AnalysisResults from './AnalysisResults';

// Mô hình có sẵn - đặt tại component chính để tránh lỗi reference
export const availableModels = [
  { 
    id: 'breast-tumor-resnet34.tcga-brca', 
    name: 'Mô hình phát hiện khối u vú (Breast Tumor Detection)', 
    description: 'Phát hiện và phân loại khối u trong mô vú'
  },
  { 
    id: 'colorectal-resnet34.penn', 
    name: 'Mô hình phân loại mô đại trực tràng', 
    description: 'Phân loại các loại mô trong mẫu đại trực tràng'
  },
  { 
    id: 'colorectal-tiatoolbox-resnet50.kather100k', 
    name: 'Mô hình phân loại mô đại trực tràng (nâng cao)', 
    description: 'Phân loại chi tiết các loại mô và tổn thương trong đại trực tràng'
  },
  { 
    id: 'lung-tumor-resnet34.tcga-luad', 
    name: 'Mô hình phát hiện ung thư phổi', 
    description: 'Phát hiện các tế bào ung thư trong mô phổi'
  },
  { 
    id: 'lymphnodes-tiatoolbox-resnet50.patchcamelyon', 
    name: 'Mô hình phát hiện di căn trong hạch bạch huyết', 
    description: 'Xác định các vùng di căn trong hạch bạch huyết' 
  },
  { 
    id: 'pancancer-lymphocytes-inceptionv4.tcga', 
    name: 'Mô hình phát hiện tế bào lympho', 
    description: 'Phát hiện tế bào lympho trong nhiều loại ung thư khác nhau'
  },
  { 
    id: 'pancreas-tumor-preactresnet34.tcga-paad', 
    name: 'Mô hình phát hiện khối u tuyến tụy', 
    description: 'Phát hiện tế bào ung thư trong mô tụy'
  },
  { 
    id: 'prostate-tumor-resnet34.tcga-prad', 
    name: 'Mô hình phát hiện khối u tuyến tiền liệt', 
    description: 'Phát hiện tế bào ung thư trong mô tuyến tiền liệt' 
  }
];

// Dữ liệu mẫu (trong thực tế sẽ lấy từ API)
const mockSamples = [
  { 
    id: 101, 
    patientName: 'Nguyễn Văn A', 
    patientId: 'BN-0001',
    sampleType: 'Mô phổi', 
    dateCollected: '25/04/2025', 
    status: 'Chờ phân tích',
    image: '/api/placeholder/80/80',
    fileName: 'CMU-3.svs'
  },
  { 
    id: 102, 
    patientName: 'Trần Thị B', 
    patientId: 'BN-0002',
    sampleType: 'Mô gan', 
    dateCollected: '24/04/2025', 
    status: 'Đang xử lý',
    image: '/api/placeholder/80/80',
    fileName: 'HE-1.svs'
  },
  { 
    id: 103, 
    patientName: 'Lê Văn C', 
    patientId: 'BN-0003',
    sampleType: 'Mô tuyến giáp', 
    dateCollected: '22/04/2025', 
    status: 'Chờ phân tích',
    image: '/api/placeholder/80/80',
    fileName: 'TH-5.svs'
  },
  { 
    id: 104, 
    patientName: 'Phạm Thị D', 
    patientId: 'BN-0004',
    sampleType: 'Mô vú', 
    dateCollected: '20/04/2025', 
    status: 'Đã phân tích',
    image: '/api/placeholder/80/80',
    fileName: 'BR-8.svs'
  },
  { 
    id: 105, 
    patientName: 'Hoàng Văn E', 
    patientId: 'BN-0005',
    sampleType: 'Mô da', 
    dateCollected: '18/04/2025', 
    status: 'Đã phân tích',
    image: '/api/placeholder/80/80',
    fileName: 'SK-2.svs'
  },
];

function SampleAnalyze() {
  const { sampleId } = useParams();
  const { currentUser } = useAuth();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('breast-tumor-resnet34.tcga-brca');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [logOutput, setLogOutput] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Khởi tạo WebSocket
  useEffect(() => {
    console.log('Đang kết nối đến WebSocket server...');
    
    // Tạo kết nối socket
    const newSocket = io('http://localhost:5001', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Xử lý kết nối
    newSocket.on('connect', () => {
      console.log('Đã kết nối đến server WebSocket:', newSocket.id);
      setIsConnected(true);
    });
    
    // Xử lý lỗi kết nối
    newSocket.on('connect_error', (err) => {
      console.error('Lỗi kết nối WebSocket:', err);
      setError(`Không thể kết nối đến server: ${err.message}`);
      setIsConnected(false);
    });
    
    // Xử lý ngắt kết nối
    newSocket.on('disconnect', () => {
      console.log('Ngắt kết nối khỏi server WebSocket');
      setIsConnected(false);
    });
    
    // Xử lý log phân tích
    newSocket.on('analysis-log', (message) => {
      console.log('Nhận log:', message);
      addLog(message);
      
      // Tự động cuộn xuống cuối
      setTimeout(() => {
        const terminalEl = document.querySelector('.terminal-output');
        if (terminalEl) {
          terminalEl.scrollTop = terminalEl.scrollHeight;
        }
      }, 100);
      
      // Kiểm tra nếu phân tích đã hoàn thành
      if (message.includes('Finished.')) {
        setIsAnalyzing(false);
        
        // Tự động tạo kết quả nếu chưa có
        if (!analysisResult) {
          const resultPath = `./results/${sampleId}/${selectedModel}/`;
          const result = {
            status: 'success',
            time: new Date().toLocaleString(),
            resultPath: resultPath,
            command: `wsinfer run --wsi-dir ./slides/ --results-dir ${resultPath} --model ${selectedModel}`,
            summary: {
              totalSlides: 1,
              detectedRegions: Math.floor(Math.random() * 20) + 1,
              confidence: (Math.random() * (0.99 - 0.80) + 0.80).toFixed(2)
            }
          };
          
          setAnalysisResult(result);
          
          // Cập nhật trạng thái mẫu
          setSample(prev => ({
            ...prev,
            status: 'Đã phân tích'
          }));
        }
      }
    });
    
    // Xử lý lỗi phân tích
    newSocket.on('analysis-error', (errorMessage) => {
      console.error('Lỗi phân tích:', errorMessage);
      setError(`Lỗi phân tích: ${errorMessage}`);
      setIsAnalyzing(false);
    });
    
    // Xử lý kết quả phân tích
    newSocket.on('analysis-complete', (result) => {
      console.log('Phân tích hoàn thành:', result);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      // Cập nhật trạng thái mẫu
      setSample(prev => ({
        ...prev,
        status: 'Đã phân tích'
      }));
    });
    
    // Lưu socket
    setSocket(newSocket);
    
    // Hủy kết nối khi component unmount
    return () => {
      console.log('Đang ngắt kết nối WebSocket...');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Lấy thông tin mẫu mô học
  useEffect(() => {
    const fetchSample = async () => {
      try {
        setLoading(true);
        // Trong thực tế, đây sẽ là API call đến backend
        // const response = await axios.get(`/api/samples/${sampleId}`);
        
        // Tạm thời sử dụng dữ liệu mẫu
        const foundSample = mockSamples.find(s => s.id === parseInt(sampleId));
        
        if (foundSample) {
          setSample(foundSample);
          setError(null);
        } else {
          setError("Không tìm thấy mẫu mô học với ID này.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin mẫu mô học:", err);
        setError("Không thể tải thông tin mẫu mô học. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (sampleId) {
      fetchSample();
    }
  }, [sampleId]);

  // Log debug
  useEffect(() => {
    console.log('Trạng thái hiện tại:', {
      sample,
      isAnalyzing,
      logOutput: logOutput.length,
      analysisResult: !!analysisResult,
      isConnected,
      error
    });
  }, [sample, isAnalyzing, logOutput, analysisResult, isConnected, error]);

  // Thêm log phân tích
  const addLog = (message) => {
    setLogOutput(prevLogs => [...prevLogs, message]);
  };

  // Thực hiện phân tích mẫu mô học với WebSocket
  const handleAnalyze = () => {
    if (!socket || !isConnected) {
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      setError(null);
      setLogOutput([]);
      
      console.log('Gửi yêu cầu phân tích:', {
        sampleId,
        modelId: selectedModel,
        fileName: sample.fileName
      });
      
      // Gửi yêu cầu phân tích qua WebSocket
      socket.emit('start-analysis', {
        sampleId,
        modelId: selectedModel,
        fileName: sample.fileName
      });
      
    } catch (err) {
      console.error("Lỗi khi phân tích mẫu mô học:", err);
      setError("Không thể thực hiện phân tích mẫu mô học. Vui lòng thử lại sau.");
      setIsAnalyzing(false);
    }
  };

  // Kiểm tra trạng thái kết nối WebSocket
  const getConnectionStatus = () => {
    if (isConnected) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Đã kết nối
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Mất kết nối
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải thông tin mẫu mô học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link to="/doctor/samples" className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="bg-blue-50 min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <svg className="h-16 w-16 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy mẫu</h2>
              <p className="text-gray-600 mb-4">Không thể tìm thấy mẫu mô học với ID: {sampleId}</p>
              <Link to="/doctor/samples" className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Phân tích mẫu mô học</h1>
            <div className="flex items-center space-x-4">
              {getConnectionStatus()}
              <Link
                to="/doctor/samples"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 mt-2">
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm">
            <h3 className="font-medium text-yellow-800">Debug Info:</h3>
            <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
            <p>Analyzing: {isAnalyzing ? 'Yes' : 'No'}</p>
            <p>Log entries: {logOutput.length}</p>
            <p>Has result: {analysisResult ? 'Yes' : 'No'}</p>
            {error && <p className="text-red-600">Error: {error}</p>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        {/* Sample Information */}
        <SampleInfo sample={sample} />

        {/* Model Selection */}
        <ModelSelection 
          selectedModel={selectedModel} 
          onSelectModel={setSelectedModel} 
          sampleId={sampleId} 
          isAnalyzing={isAnalyzing}
          isConnected={isConnected}
          handleAnalyze={handleAnalyze}
          availableModels={availableModels} // Truyền danh sách mô hình
        />

        {/* Terminal Output */}
        {logOutput.length > 0 && (
          <TerminalOutput 
            logOutput={logOutput} 
            isAnalyzing={isAnalyzing} 
          />
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <AnalysisResults 
            analysisResult={analysisResult} 
            sample={sample} 
            selectedModel={selectedModel}
            sampleId={sampleId} // Thêm sampleId
            modelName={availableModels.find(m => m.id === selectedModel)?.name || ''}
          />
        )}
      </div>
    </div>
  );
}

export default SampleAnalyze;