import React, { useState } from 'react';
import DicomLoader from '../components/DicomLoader';
import SeriesBrowser from '../components/SeriesBrowser';
import Viewer2D from '../components/Viewer2D';
import { useDicomVolume } from '../hooks/useDicomVolume';

const HomePage: React.FC = () => {
  const { imageIds, loading, error, loadFiles } = useDicomVolume();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectImage = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex h-full w-full">
      {/* Левая панель */}
      <div className="w-64 flex flex-col bg-gray-800 border-r border-gray-700 h-full">
        <div className="p-4 border-b border-gray-700">
          <DicomLoader onLoad={loadFiles} loading={loading} />
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
        <div className="flex-1 overflow-hidden">
          <SeriesBrowser
            imageIds={imageIds}
            onSelectImage={handleSelectImage}
            activeIndex={activeIndex}
          />
        </div>
      </div>

      {/* Центральная часть */}
      <div className="flex-1 h-full flex flex-col bg-black">
        <Viewer2D imageId={imageIds[activeIndex] || ''} />
      </div>

      {/* Правая панель */}
      <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 flex flex-col h-full">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Управление</h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Пресеты Window/Level</h3>
          <div className="space-y-2">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-sm py-1 px-2 rounded">
              Мягкие ткани (400 / 40)
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-sm py-1 px-2 rounded">
              Легкие (1500 / -600)
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-sm py-1 px-2 rounded">
              Кости (2000 / 300)
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Информация об исследовании</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><span className="text-gray-500">Пациент:</span> Аноним</p>
            <p><span className="text-gray-500">ID:</span> Неизвестно</p>
            <p><span className="text-gray-500">Модальность:</span> CT / MR</p>
            <p><span className="text-gray-500">Всего срезов:</span> {imageIds.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
