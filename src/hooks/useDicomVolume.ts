import { useState, useCallback } from 'react';
import { loadDicomFile, buildVolumeFromImages } from "../services/dicomService";
import type { DicomVolumeData } from "../services/dicomService";

export const useDicomVolume = () => {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [volumeData, setVolumeData] = useState<DicomVolumeData | null>(null);
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
        const vol = await buildVolumeFromImages(ids);
        if (vol) {
          setVolumeData(vol);
        } else {
          setError('Не удалось построить 3D объем из загруженных файлов.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Ошибка при загрузке файлов: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { imageIds, volumeData, loading, error, loadFiles };
};
