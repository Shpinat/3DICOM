import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { initCornerstone } from '../services/dicomService';

interface Viewer2DProps {
  imageId: string;
}

const Viewer2D: React.FC<Viewer2DProps> = ({ imageId }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initCornerstone();
    const element = elementRef.current;
    if (!element) return;

    cornerstone.enable(element);

    return () => {
      cornerstone.disable(element);
    };
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageId) return;

    const loadAndDisplayImage = async () => {
      try {
        const image = await cornerstone.loadAndCacheImage(imageId);
        cornerstone.displayImage(element, image);

        // Add tools
        const WwwcTool = cornerstoneTools.WwwcTool;
        const PanTool = cornerstoneTools.PanTool;
        const ZoomTool = cornerstoneTools.ZoomTool;
        const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.addTool(ZoomTool);
        cornerstoneTools.addTool(StackScrollMouseWheelTool);

        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 }); // Left click
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 }); // Middle click
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 }); // Right click
        cornerstoneTools.setToolActive('StackScrollMouseWheel', { }); // Mouse wheel
      } catch (e) {
        console.error('Ошибка загрузки изображения:', e);
      }
    };

    loadAndDisplayImage();
  }, [imageId]);

  return (
    <div className="flex-1 h-full w-full bg-black relative">
      <div
        ref={elementRef}
        className="w-full h-full"
        onContextMenu={(e) => e.preventDefault()}
      />
      {!imageId && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          Выберите исследование для просмотра
        </div>
      )}
    </div>
  );
};

export default Viewer2D;
