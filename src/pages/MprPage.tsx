import React from 'react';
import MprViewer from '../components/MprViewer';

const MprPage: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-gray-800 p-2 text-sm text-gray-300 border-b border-gray-700">
        Мультипланарная реконструкция (MPR)
      </div>
      <MprViewer volumeData={null} />
    </div>
  );
};

export default MprPage;
