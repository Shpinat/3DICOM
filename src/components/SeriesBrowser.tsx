import React from 'react';

interface SeriesBrowserProps {
  imageIds: string[];
  onSelectImage: (index: number) => void;
  activeIndex: number;
}

const SeriesBrowser: React.FC<SeriesBrowserProps> = ({ imageIds, onSelectImage, activeIndex }) => {
  if (imageIds.length === 0) {
    return (
      <div className="p-4 text-gray-400">
        Нет загруженных серий
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 border-r border-gray-700">
      <div className="p-3 bg-gray-900 border-b border-gray-700 font-bold">
        Браузер серий ({imageIds.length} срезов)
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {imageIds.map((_, index) => (
            <li key={index}>
              <button
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  index === activeIndex
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => onSelectImage(index)}
              >
                Срез {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeriesBrowser;
