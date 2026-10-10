import React from 'react';
import Viewer3D from '../components/Viewer3D';

const ThreeDPage: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-gray-800 p-2 text-sm text-gray-300 border-b border-gray-700">
        3D Визуализация (Volume Rendering / Marching Cubes)
      </div>
      <Viewer3D volumeData={null} />
    </div>
  );
};

export default ThreeDPage;
