import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

// Mô hình có sẵn
const availableModels = [
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
    // Tạo kết nối socket
    const newSocket = io('http://localhost:5001', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    // Xử lý kết nối
    newSocket.on('connect', () => {
      console.log('Đã kết nối đến server WebSocket');
      setIsConnected(true);
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

  // Lấy model hiện tại
  const getCurrentModel = () => {
    return availableModels.find(model => model.id === selectedModel) || availableModels[0];
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

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        {/* Sample Information */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Thông tin mẫu mô học</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mã mẫu</h3>
                  <p className="mt-1 text-base font-medium text-gray-800">MS-{sample.id.toString().padStart(4, '0')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bệnh nhân</h3>
                  <p className="mt-1 text-base font-medium text-gray-800">{sample.patientName}</p>
                  <p className="text-sm text-gray-500">{sample.patientId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Loại mẫu</h3>
                  <p className="mt-1 text-base font-medium text-gray-800">{sample.sampleType}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ngày lấy mẫu</h3>
                  <p className="mt-1 text-base font-medium text-gray-800">{sample.dateCollected}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    sample.status === 'Chờ phân tích' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : sample.status === 'Đang xử lý' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {sample.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tên file</h3>
                  <p className="mt-1 text-base font-medium text-gray-800">{sample.fileName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Configuration */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Cấu hình phân tích</h2>
          </div>
          
          <div className="p-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Chọn mô hình phân tích</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {availableModels.map((model) => (
                <div 
                  key={model.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedModel === model.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      selectedModel === model.id 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-400'
                      } flex-shrink-0 mr-3`}
                    >
                      {selectedModel === model.id && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{model.name}</h3>
                      <p className="text-sm text-gray-600">{model.description}</p>
                      <p className="text-xs font-mono text-gray-500 mt-1">{model.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Lệnh phân tích sẽ được thực hiện:</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
{`(base) hoangkhanh@192 bacsi % cd wsinfer
(pytorch-env) (base) hoangkhanh@192 wsinfer % wsinfer run \\
   --wsi-dir ./slides/ \\
   --results-dir ./results/${sampleId}/${selectedModel}/ \\
   --model ${selectedModel}`}
              </pre>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !isConnected}
                className={`flex items-center px-6 py-3 rounded-md font-medium text-base ${
                  isAnalyzing || !isConnected
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isAnalyzing && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {!isAnalyzing && (
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )}
                {isAnalyzing ? 'Đang phân tích...' : 'Bắt đầu phân tích'}
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Output - Luôn hiển thị khi có log */}
        {logOutput.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">Terminal Output</h2>
              {isAnalyzing && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Đang xử lý
                </span>
              )}
            </div>
            
            <div className="bg-black text-green-400 p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto terminal-output">
              {logOutput.map((line, index) => (
                <div key={index} className="py-0.5">
                  {index === logOutput.length - 1 && !isAnalyzing ? (
                    <span className="text-green-500 font-bold">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
              {isAnalyzing && <span className="animate-pulse">_</span>}
            </div>

            {/* Nút cuộn xuống cuối */}
            <div className="p-2 border-t border-gray-800 bg-gray-900">
              <button
                onClick={() => {
                  const terminalEl = document.querySelector('.terminal-output');
                  if (terminalEl) {
                    terminalEl.scrollTop = terminalEl.scrollHeight;
                  }
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Cuộn xuống cuối
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">Kết quả phân tích</h2>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Hoàn thành
              </span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Thời gian phân tích</h3>
                    <p className="mt-1 text-base font-medium text-gray-800">{analysisResult.time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mô hình sử dụng</h3>
                    <p className="mt-1 text-base font-medium text-gray-800">{getCurrentModel().name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Đường dẫn kết quả</h3>
                    <p className="mt-1 text-base font-medium text-gray-800">{analysisResult.resultPath}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Số vùng phát hiện</h3>
                    <p className="mt-1 text-base font-medium text-gray-800">
                      {analysisResult.summary.detectedRegions} vùng
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Độ tin cậy</h3>
                    <p className="mt-1 text-base font-medium text-gray-800">
                      {(analysisResult.summary.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Lệnh đã thực hiện</h3>
                    <p className="mt-1 text-xs font-mono bg-gray-100 p-2 rounded">
                      {analysisResult.command}
                    </p>
                  </div>
                </div>
              </div>

              {/* Heatmap Preview (mô phỏng) */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Heatmap kết quả phân tích</h3>
                <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    <p>Hình ảnh heatmap sẽ hiển thị ở đây</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Kết quả chi tiết được lưu tại: {analysisResult.resultPath}
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Link
                  to={`/doctor/samples/${sample.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem chi tiết mẫu
                </Link>
                
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center"
                  onClick={() => {
                    // Trong thực tế, đây sẽ tạo báo cáo và tải xuống
                    alert('Tính năng tải báo cáo sẽ được cung cấp trong phiên bản tiếp theo!');
                  }}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải báo cáo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SampleAnalyze;