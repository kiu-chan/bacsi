import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaHome,
  FaUndo,
  FaRedo,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const SampleDetail = () => {
  const viewerContainer = useRef(null);
  const viewerInstance = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [geoJSONData, setGeoJSONData] = useState(null);
  const overlayRef = useRef(null);
  const [showGeoJSON, setShowGeoJSON] = useState(true);

  // Tải GeoJSON
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/CMU-3.geojson');
        const data = await response.json();
        setGeoJSONData(data);
      } catch (error) {
        console.error('Lỗi khi tải file GeoJSON:', error);
      }
    };

    fetchGeoJSON();
  }, []);

  // Khởi tạo OpenSeadragon viewer
  useEffect(() => {
    if (viewerContainer.current) {
      viewerInstance.current = OpenSeadragon({
        element: viewerContainer.current,
        tileSources: '/CMU-3_dzi.dzi',
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
        // Fix để đảm bảo tọa độ chính xác
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
    }
  }, []);

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

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Chi tiết mẫu mô</h2>

      {viewerReady && (
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={zoomIn} title="Phóng to"><FaSearchPlus /></button>
          <button onClick={zoomOut} title="Thu nhỏ"><FaSearchMinus /></button>
          <button onClick={goHome} title="Về gốc"><FaHome /></button>
          <button onClick={rotateLeft} title="Xoay trái"><FaUndo /></button>
          <button onClick={rotateRight} title="Xoay phải"><FaRedo /></button>
          <button 
            onClick={toggleGeoJSON} 
            title={showGeoJSON ? "Ẩn lớp GeoJSON" : "Hiện lớp GeoJSON"}
            style={{ marginLeft: 'auto' }}
          >
            {showGeoJSON ? <FaEyeSlash /> : <FaEye />}
            <span style={{ marginLeft: '5px' }}>
              {showGeoJSON ? "Ẩn GeoJSON" : "Hiện GeoJSON"}
            </span>
          </button>
        </div>
      )}

      <div
        ref={viewerContainer}
        id="openseadragon"
        style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default SampleDetail;