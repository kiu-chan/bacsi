import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaHome,
  FaUndo,
  FaRedo,
} from 'react-icons/fa';

const SampleDetail = () => {
  const viewerContainer = useRef(null);
  const viewerInstance = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    viewerInstance.current = OpenSeadragon({
      element: viewerContainer.current,
      tileSources: '/CMU-3_dzi.dzi',
      showNavigator: true,
      showRotationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
    });

    viewerInstance.current.addHandler('open', () => {
      setViewerReady(true);
    });

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []);

  const zoomIn = () => viewerInstance.current?.viewport?.zoomBy(1.2) && viewerInstance.current?.viewport?.applyConstraints();
  const zoomOut = () => viewerInstance.current?.viewport?.zoomBy(0.8) && viewerInstance.current?.viewport?.applyConstraints();
  const goHome = () => viewerInstance.current?.viewport?.goHome();
  const rotateLeft = () => viewerInstance.current?.viewport?.setRotation(viewerInstance.current.viewport.getRotation() - 90);
  const rotateRight = () => viewerInstance.current?.viewport?.setRotation(viewerInstance.current.viewport.getRotation() + 90);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Chi tiết mẫu mô</h2>

      {viewerReady && (
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={zoomIn} title="Zoom in"><FaSearchPlus /></button>
          <button onClick={zoomOut} title="Zoom out"><FaSearchMinus /></button>
          <button onClick={goHome} title="Reset view"><FaHome /></button>
          <button onClick={rotateLeft} title="Rotate left"><FaUndo /></button>
          <button onClick={rotateRight} title="Rotate right"><FaRedo /></button>
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
