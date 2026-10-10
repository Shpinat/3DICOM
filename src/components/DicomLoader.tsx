import React, { useRef, useState } from 'react';

interface DicomLoaderProps {
  onLoad: (files: File[]) => void;
  loading: boolean;
}

const DicomLoader: React.FC<DicomLoaderProps> = ({ onLoad, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onLoad(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onLoad(Array.from(e.target.files));
    }
  };

  return (
    <div
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-500 hover:border-gray-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        accept=".dcm"
      />

      {loading ? (
        <p className="text-gray-300">Загрузка и обработка файлов...</p>
      ) : (
        <div>
          <p className="text-lg mb-2">Перетащите DICOM файлы сюда</p>
          <p className="text-sm text-gray-400">или кликните для выбора</p>
        </div>
      )}
    </div>
  );
};

export default DicomLoader;
