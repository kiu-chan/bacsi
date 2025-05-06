import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AnalysisResults({ analysisResult, sample, selectedModel, sampleId, modelName }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Tạo URL cho hình ảnh heatmap
    const fileName = sample.fileName.replace('.svs', '.jpg');
    const heatmapPath = `wsinfer/results/${sampleId}/${selectedModel}/masks/${fileName}`;
    const fullImageUrl = `http://localhost:5001/api/files?path=${encodeURIComponent(heatmapPath)}`;
    
    setImageUrl(fullImageUrl);
    
    // Kiểm tra xem hình ảnh đã tồn tại chưa
    const img = new Image();
    img.onload = () => {
      setImageLoading(false);
      setImageError(false);
    };
    img.onerror = () => {
      setImageLoading(false);
      setImageError(true);
    };
    img.src = fullImageUrl;
  }, [sample, sampleId, selectedModel]);

  // Hàm tải file GeoJSON
  const downloadGeoJSON = () => {
    const fileName = sample.fileName.replace('.svs', '.geojson');
    // Đường dẫn cập nhật theo cấu trúc thư mục mới
    const filePath = `wsinfer/results/${sampleId}/${selectedModel}/model-outputs-geojson/${fileName}`;
    downloadFile(filePath, fileName);
  };

  // Hàm tải file heatmap
  const downloadHeatmap = () => {
    const fileName = sample.fileName.replace('.svs', '.jpg');
    // Đường dẫn cập nhật theo cấu trúc thư mục mới
    const filePath = `wsinfer/results/${sampleId}/${selectedModel}/masks/${fileName}`;
    downloadFile(filePath, fileName);
  };

  // Hàm xử lý việc tải file
  const downloadFile = (filePath, fileName) => {
    try {
      // Tạo link tải file
      const link = document.createElement('a');
      link.href = `http://localhost:5001/api/download?path=${encodeURIComponent(filePath)}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Lỗi khi tải file:', error);
      alert('Không thể tải file. Vui lòng thử lại sau.');
    }
  };

  return (
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
              <p className="mt-1 text-base font-medium text-gray-800">{modelName}</p>
              <p className="text-xs font-mono text-gray-500">{selectedModel}</p>
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

        {/* Heatmap Preview (hiển thị hình ảnh thực) */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Heatmap kết quả phân tích</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-black">
            {imageLoading && (
              <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="ml-2">Đang tải hình ảnh...</p>
              </div>
            )}
            
            {imageError && (
              <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="ml-2">Không thể tải hình ảnh</p>
              </div>
            )}
            
            {!imageLoading && !imageError && imageUrl && (
              <img 
                src={imageUrl} 
                alt="Heatmap kết quả phân tích" 
                className="object-contain w-full h-full"
              />
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Kết quả chi tiết được lưu tại: {analysisResult.resultPath}
          </p>
        </div>

        {/* Nút tải file kết quả */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tải file kết quả</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={downloadGeoJSON}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải file GeoJSON
            </button>
            
            <button
              onClick={downloadHeatmap}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải heatmap (JPG)
            </button>
          </div>
        </div>

        <div className="flex justify-center">
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
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;