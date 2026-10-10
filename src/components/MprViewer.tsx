import React from 'react';
import type { DicomVolumeData } from '../services/dicomService';

interface MprViewerProps {
  volumeData: DicomVolumeData | null;
}

const MprViewer: React.FC<MprViewerProps> = ({ volumeData }) => {
  if (!volumeData) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Нет данных для MPR. Загрузите объем DICOM на главной странице.
      </div>
    );
  }

  return (
    <div className="flex-1 h-full p-4 grid grid-cols-2 grid-rows-2 gap-4 bg-black">
      <div className="border border-gray-600 relative flex items-center justify-center">
        <span className="absolute top-2 left-2 text-red-500 text-sm font-bold z-10">Аксиальный</span>
        <div className="text-gray-500 text-center px-4">
           (Функционал отрисовки аксиального среза из массива данных)
        </div>
      </div>
      <div className="border border-gray-600 relative flex items-center justify-center">
        <span className="absolute top-2 left-2 text-green-500 text-sm font-bold z-10">Сагиттальный</span>
        <div className="text-gray-500 text-center px-4">
           (Функционал отрисовки сагиттального среза)
        </div>
      </div>
      <div className="border border-gray-600 relative flex items-center justify-center">
        <span className="absolute top-2 left-2 text-blue-500 text-sm font-bold z-10">Корональный</span>
        <div className="text-gray-500 text-center px-4">
           (Функционал отрисовки коронального среза)
        </div>
      </div>
      <div className="border border-gray-600 relative flex items-center justify-center bg-gray-900">
        <span className="text-gray-400">3D Ориентация</span>
      </div>
    </div>
  );
};

export default MprViewer;
