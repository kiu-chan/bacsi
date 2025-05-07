import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { useParams } from 'react-router-dom';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaHome,
  FaUndo,
  FaRedo,
  FaEye,
  FaEyeSlash,
  FaDownload
} from 'react-icons/fa';

const SampleDetail = () => {
  const { sampleId } = useParams();
  const viewerContainer = useRef(null);
  const viewerInstance = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [geoJSONData, setGeoJSONData] = useState(null);
  const overlayRef = useRef(null);
  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tải thông tin bệnh nhân
  useEffect(() => {
    const fetchPatientInfo = async () => {
      setLoading(true);
      // Giả lập dữ liệu - trong thực tế sẽ gọi API
      const mockSamples = [
        { 
          id: 101, 
          patientName: 'Nguyễn Văn A', 
          patientId: 'BN-0001',
          sampleType: 'Mô phổi', 
          dateCollected: '25/04/2025', 
          status: 'Chờ phân tích',
          image: '/api/placeholder/80/80',
          fileName: 'CMU-3.svs',
          dziPath: '/CMU-3_dzi.dzi'
        },
        { 
          id: 102, 
          patientName: 'Trần Thị B', 
          patientId: 'BN-0002',
          sampleType: 'Mô gan', 
          dateCollected: '24/04/2025', 
          status: 'Đã phân tích',
          image: '/api/placeholder/80/80',
          fileName: 'SMU-2.svs',
          dziPath: '/SMU-2_dzi.dzi'  // Đường dẫn mới tới file DZI
        },
      ];
      
      // Tìm thông tin bệnh nhân dựa vào sampleId
      const foundSample = mockSamples.find(s => s.id === parseInt(sampleId));
      
      if (foundSample) {
        setPatientInfo(foundSample);
      }
      
      setLoading(false);
    };

    fetchPatientInfo();
  }, [sampleId]);

  // Tải GeoJSON
  useEffect(() => {
    if (!patientInfo) return;
    
    const fetchGeoJSON = async () => {
      try {
        // Lấy file GeoJSON theo tên file của bệnh nhân
        const geoJSONFileName = patientInfo.fileName.replace('.svs', '.geojson');
        const response = await fetch(`/${geoJSONFileName}`);
        const data = await response.json();
        setGeoJSONData(data);
      } catch (error) {
        console.error('Lỗi khi tải file GeoJSON:', error);
      }
    };

    fetchGeoJSON();
  }, [patientInfo]);

  // Khởi tạo OpenSeadragon viewer
  useEffect(() => {
    if (!patientInfo || !viewerContainer.current) return;

    // Hủy viewer cũ nếu có
    if (viewerInstance.current) {
      viewerInstance.current.destroy();
      viewerInstance.current = null;
    }

    const dziPath = patientInfo.dziPath;
    
    viewerInstance.current = OpenSeadragon({
      element: viewerContainer.current,
      tileSources: dziPath,
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      showRotationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      defaultZoomLevel: 1,
      visibilityRatio: 0.5,
      constrainDuringPan: true,
      immediateRender: true,
      minZoomImageRatio: 0.8,
      maxZoomPixelRatio: 2,
      animationTime: 0.5,
      blendTime: 0,
      wrapHorizontal: false,
      wrapVertical: false,
      homeFillsViewer: true,
      preserveViewport: true
    });

    viewerInstance.current.addHandler('open', () => {
      setViewerReady(true);
      
      setTimeout(() => {
        if (viewerInstance.current && viewerInstance.current.viewport) {
          viewerInstance.current.viewport.goHome(true);
        }
      }, 200);
    });

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, [patientInfo]);

  // Tạo và quản lý Overlay một lần khi viewer đã sẵn sàng
  useEffect(() => {
    if (!viewerReady || !viewerInstance.current) return;
    
    const viewer = viewerInstance.current;
    
    // Tạo overlay để vẽ GeoJSON
    const overlay = document.createElement('div');
    overlay.id = 'geojson-overlay';
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    
    // Thêm overlay vào viewer với vị trí chính xác phù hợp với tọa độ DZI
    viewer.addOverlay({
      element: overlay,
      location: new OpenSeadragon.Rect(0, 0, 1, 1),
      placement: OpenSeadragon.Placement.TOP_LEFT,
      checkResize: true
    });
    
    overlayRef.current = overlay;
    
    return () => {
      if (overlayRef.current) {
        viewer.removeOverlay(overlay);
        overlayRef.current = null;
      }
    };
  }, [viewerReady]);

  // Hiển thị dữ liệu GeoJSON
  useEffect(() => {
    if (!viewerReady || !geoJSONData || !viewerInstance.current || !overlayRef.current || !showGeoJSON) {
      // Nếu không hiển thị GeoJSON, xóa nội dung overlay
      if (overlayRef.current && !showGeoJSON) {
        overlayRef.current.innerHTML = '';
      }
      return;
    }

    const viewer = viewerInstance.current;
    const overlay = overlayRef.current;
    
    // Hàm vẽ GeoJSON
    const drawGeoJSON = () => {
      // Xóa canvas cũ nếu có
      overlay.innerHTML = '';
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Kích thước canvas phải bằng kích thước thật của container
      const containerSize = viewer.container.getBoundingClientRect();
      canvas.width = containerSize.width;
      canvas.height = containerSize.height;
      
      // Đính kèm canvas mới vào overlay
      overlay.appendChild(canvas);
      
      // Lấy thông tin hình ảnh đang hiển thị
      const tiledImage = viewer.world.getItemAt(0);
      if (!tiledImage) return;
      
      // Lấy thông tin về viewport hiện tại
      const viewport = viewer.viewport;
      
      // Vẽ từng feature trong GeoJSON
      geoJSONData.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0];
          const properties = feature.properties;
          
          // Xác định màu dựa vào phân loại
          let fillColor = 'rgba(255, 0, 0, 0.2)'; // Màu mặc định cho tumor
          
          if (properties && properties.measurements) {
            const probTumor = properties.measurements.prob_Tumor || 0;
            
            if (probTumor > 0.5) {
              fillColor = 'rgba(255, 0, 0, 0.3)';
            } else if (probTumor > 0.3) {
              fillColor = 'rgba(255, 165, 0, 0.3)';
            } else {
              fillColor = 'rgba(0, 255, 0, 0.1)';
            }
          }
          
          ctx.fillStyle = fillColor;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.lineWidth = 1.5;
          
          ctx.beginPath();
          
          // Trích xuất thông tin kích thước thực của ảnh để tỉ lệ chính xác
          const imageWidth = tiledImage.source.dimensions.x;
          const imageHeight = tiledImage.source.dimensions.y;
          
          // Chuyển đổi tọa độ từ hệ tọa độ gốc sang hệ tọa độ của viewport
          coordinates.forEach((point, index) => {
            // Chuẩn hóa tọa độ từ pixel sang tỉ lệ 0-1 của ảnh
            const normalizedX = point[0] / imageWidth;
            const normalizedY = point[1] / imageHeight;
            
            // Chuyển từ tọa độ chuẩn hóa sang tọa độ viewport
            const viewportPoint = viewport.imageToViewerElementCoordinates(
              new OpenSeadragon.Point(normalizedX, normalizedY)
            );
            
            if (index === 0) {
              ctx.moveTo(viewportPoint.x, viewportPoint.y);
            } else {
              ctx.lineTo(viewportPoint.x, viewportPoint.y);
            }
          });
          
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      });
    };

    // Vẽ lại GeoJSON khi viewport thay đổi
    const updateHandler = () => {
      if (showGeoJSON) {
        drawGeoJSON();
      }
    };
    
    // Đăng ký các event handler
    viewer.addHandler('update-viewport', updateHandler);
    viewer.addHandler('animation', updateHandler);
    viewer.addHandler('resize', updateHandler);
    
    // Vẽ GeoJSON lần đầu
    drawGeoJSON();

    return () => {
      // Hủy đăng ký các event handler khi component unmount
      viewer.removeHandler('update-viewport', updateHandler);
      viewer.removeHandler('animation', updateHandler);
      viewer.removeHandler('resize', updateHandler);
    };
  }, [viewerReady, geoJSONData, showGeoJSON]);

  // Các hàm điều khiển viewer
  const zoomIn = () => viewerInstance.current?.viewport?.zoomBy(1.2);
  const zoomOut = () => viewerInstance.current?.viewport?.zoomBy(0.8);
  const goHome = () => viewerInstance.current?.viewport?.goHome(true);
  const rotateLeft = () => viewerInstance.current?.viewport?.setRotation(viewerInstance.current.viewport.getRotation() - 90);
  const rotateRight = () => viewerInstance.current?.viewport?.setRotation(viewerInstance.current.viewport.getRotation() + 90);
  
  // Hàm bật/tắt hiển thị GeoJSON
  const toggleGeoJSON = () => {
    setShowGeoJSON(!showGeoJSON);
  };

  // Hàm tải ảnh
  const downloadImage = () => {
    if (!viewerInstance.current) return;
    
    alert('Tính năng tải ảnh sẽ được cung cấp trong phiên bản tiếp theo!');
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

  if (!patientInfo) {
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy thông tin</h2>
          <p className="text-gray-600">Không thể tải thông tin mẫu mô học với ID: {sampleId}</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Chi tiết mẫu mô học</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Thông tin mẫu */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">Thông tin mẫu</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              patientInfo.status === 'Chờ phân tích' 
                ? 'bg-yellow-100 text-yellow-800' 
                : patientInfo.status === 'Đang xử lý' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
            }`}>
              {patientInfo.status}
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mã mẫu</h3>
                <p className="mt-1 text-base font-medium text-gray-800">MS-{patientInfo.id.toString().padStart(4, '0')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bệnh nhân</h3>
                <p className="mt-1 text-base font-medium text-gray-800">{patientInfo.patientName}</p>
                <p className="text-sm text-gray-500">{patientInfo.patientId}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Loại mẫu</h3>
                <p className="mt-1 text-base font-medium text-gray-800">{patientInfo.sampleType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ngày lấy mẫu</h3>
                <p className="mt-1 text-base font-medium text-gray-800">{patientInfo.dateCollected}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tên file</h3>
                <p className="mt-1 text-base font-medium text-gray-800">{patientInfo.fileName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Công cụ điều khiển */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={zoomIn} 
              className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors" 
              title="Phóng to"
            >
              <FaSearchPlus className="mr-1" /> <span className="hidden sm:inline">Phóng to</span>
            </button>
            
            <button 
              onClick={zoomOut} 
              className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors" 
              title="Thu nhỏ"
            >
              <FaSearchMinus className="mr-1" /> <span className="hidden sm:inline">Thu nhỏ</span>
            </button>
            
            <button 
              onClick={goHome} 
              className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors" 
              title="Về gốc"
            >
              <FaHome className="mr-1" /> <span className="hidden sm:inline">Về gốc</span>
            </button>
            
            <button 
              onClick={rotateLeft} 
              className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors" 
              title="Xoay trái"
            >
              <FaUndo className="mr-1" /> <span className="hidden sm:inline">Xoay trái</span>
            </button>
            
            <button 
              onClick={rotateRight} 
              className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors" 
              title="Xoay phải"
            >
              <FaRedo className="mr-1" /> <span className="hidden sm:inline">Xoay phải</span>
            </button>
            
            <div className="ml-auto flex gap-2">
              <button 
                onClick={downloadImage} 
                className="p-2 bg-green-100 text-green-700 rounded-md flex items-center hover:bg-green-200 transition-colors" 
                title="Tải ảnh"
              >
                <FaDownload className="mr-1" /> <span className="hidden sm:inline">Tải ảnh</span>
              </button>
              
              <button 
                onClick={toggleGeoJSON} 
                className={`p-2 rounded-md flex items-center transition-colors ${
                  showGeoJSON 
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={showGeoJSON ? "Ẩn lớp phân tích" : "Hiện lớp phân tích"}
              >
                {showGeoJSON ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
                <span className="hidden sm:inline">{showGeoJSON ? "Ẩn lớp phân tích" : "Hiện lớp phân tích"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Viewer */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Hình ảnh mẫu</h2>
          </div>
          <div className="p-2">
            <div
              ref={viewerContainer}
              id="openseadragon-viewer"
              className="w-full h-[70vh] border border-gray-200 rounded"
            />
          </div>
        </div>

        {/* Chú thích */}
        <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">Chú thích kết quả phân tích</h2>
          <div className="flex flex-col sm:flex-row justify-start gap-6">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-300 opacity-50 border border-red-600 rounded mr-2"></div>
              <span>Vùng nghi ngờ ác tính ( trên 50%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-300 opacity-50 border border-orange-600 rounded mr-2"></div>
              <span>Vùng cần theo dõi (30-50%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-300 opacity-50 border border-green-600 rounded mr-2"></div>
              <span>Vùng bình thường (dưới 30%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDetail;