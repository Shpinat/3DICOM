import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

let initialized = false;

export const initCornerstone = () => {
  if (initialized) return;

  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  // Set up web workers for WADO loader
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    webWorkerTaskPaths: [],
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  });

  cornerstoneTools.init();
  initialized = true;
};

export const loadDicomFile = async (file: File): Promise<string> => {
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  return imageId;
};

export const clearCornerstoneCache = () => {
  cornerstone.imageCache.purgeCache();
};

export interface DicomVolumeData {
  pixelData: Float32Array | Int16Array | Uint16Array;
  dimensions: [number, number, number]; // x, y, z
  spacing: [number, number, number]; // x, y, z
}

export const buildVolumeFromImages = async (imageIds: string[]): Promise<DicomVolumeData | null> => {
    if (imageIds.length === 0) return null;

    try {
        const images = await Promise.all(imageIds.map(id => cornerstone.loadAndCacheImage(id)));

        images.sort((a: any, b: any) => {
            const zA = a.data?.floatString('x00201041') || a.imageId;
            const zB = b.data?.floatString('x00201041') || b.imageId;
            return parseFloat(zA) - parseFloat(zB);
        });

        const width = images[0].width;
        const height = images[0].height;
        const depth = images.length;

        const rowPixelSpacing = images[0].rowPixelSpacing || 1;
        const columnPixelSpacing = images[0].columnPixelSpacing || 1;
        const sliceThickness = images[0].data?.floatString('x00180050') ? parseFloat(images[0].data.floatString('x00180050')!) : 1;

        const volumeSize = width * height * depth;
        const firstPixelData = images[0].getPixelData();

        let volumeData;
        if (firstPixelData instanceof Int16Array) {
             volumeData = new Int16Array(volumeSize);
        } else if (firstPixelData instanceof Uint16Array) {
             volumeData = new Uint16Array(volumeSize);
        } else {
             volumeData = new Float32Array(volumeSize);
        }

        images.forEach((image: any, index: number) => {
            const pixels = image.getPixelData();
            const offset = index * width * height;
            volumeData.set(pixels, offset);
        });

        return {
            pixelData: volumeData,
            dimensions: [width, height, depth],
            spacing: [columnPixelSpacing, rowPixelSpacing, sliceThickness]
        };

    } catch(e) {
        console.error("Ошибка при сборке 3D объема:", e);
        return null;
    }
};
