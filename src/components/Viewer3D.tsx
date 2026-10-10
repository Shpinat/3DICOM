import React, { useEffect, useRef } from 'react';
import type { DicomVolumeData } from '../services/dicomService';
import { initThreeScene, renderVolumeData } from '../services/threeService';

interface Viewer3DProps {
  volumeData: DicomVolumeData | null;
}

const Viewer3D: React.FC<Viewer3DProps> = ({ volumeData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const { scene, cleanup } = initThreeScene(canvasRef.current);
    sceneRef.current = scene;

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && volumeData) {
      renderVolumeData(sceneRef.current, volumeData);
    }
  }, [volumeData]);

  if (!volumeData) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-black">
        Нет данных для 3D рендера. Загрузите файлы на главной странице.
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative bg-black">
      <canvas ref={canvasRef} className="w-full h-full block outline-none" />
      <div className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded text-sm">
        Управление: ЛКМ - вращение, Колесико - зум
      </div>
    </div>
  );
};

export default Viewer3D;
