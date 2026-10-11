import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { volumeLoader, cache } from '@cornerstonejs/core';
import { loadDicomFile } from './services/dicomService';

interface DicomContextType {
  imageIds: string[];
  volumeId: string | null;
  loading: boolean;
  error: string | null;
  loadFiles: (files: FileList | File[]) => Promise<void>;
}

const DicomContext = createContext<DicomContextType | undefined>(undefined);

export const DicomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [volumeId, setVolumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async (files: FileList | File[]) => {
    setLoading(true);
    setError(null);
    try {
      const ids: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const id = await loadDicomFile(files[i]);
        ids.push(id);
      }
      setImageIds(ids);

      if (ids.length > 0) {
        // Clear previous volume if it exists
        setVolumeId((prevVolId) => {
          if (prevVolId) {
            cache.removeVolumeLoadObject(prevVolId);
          }
          return null;
        });

        const volId = 'cornerstoneStreamingImageVolume:myVolume_' + Date.now();

        await volumeLoader.createAndCacheVolume(volId, {
            imageIds: ids,
        });

        setVolumeId(volId);
      }
    } catch (err: any) {
      console.error(err);
      setError('Ошибка при загрузке файлов: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (volumeId) {
        cache.removeVolumeLoadObject(volumeId);
      }
    };
  }, [volumeId]);

  return (
    <DicomContext.Provider value={{ imageIds, volumeId, loading, error, loadFiles }}>
      {children}
    </DicomContext.Provider>
  );
};

export const useDicomContext = () => {
  const context = useContext(DicomContext);
  if (context === undefined) {
    throw new Error('useDicomContext must be used within a DicomProvider');
  }
  return context;
};
