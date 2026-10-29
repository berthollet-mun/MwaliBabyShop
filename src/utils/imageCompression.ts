/**
 * Client-side Image Compression Utility for ORTANCE
 * Optimizes uploaded photos on the fly to guarantee lightweight, high-speed
 * catalog loading on mobile networks (3G/4G).
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg';
}

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  reductionPercentage: number;
  format: string;
}

export const COMPRESSION_PRESETS = {
  balanced: {
    label: 'Équilibré Mobile (Recommandé)',
    description: '~120-200 Ko • Net et rapide sur 3G/4G',
    maxWidth: 1400,
    maxHeight: 1400,
    quality: 0.82,
  },
  high: {
    label: 'Haute Définition',
    description: '~250-400 Ko • Idéal pour zoom et grands écrans',
    maxWidth: 1800,
    maxHeight: 1800,
    quality: 0.88,
  },
  eco: {
    label: 'Éco Réseau (Ultra-léger)',
    description: '~60-100 Ko • Économie maximale de forfait mobile',
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.75,
  },
} as const;

export type PresetKey = keyof typeof COMPRESSION_PRESETS;

/**
 * Formats byte values to readable human strings (e.g., 2.4 Mo, 180 Ko)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Ko';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculates byte size of a base64 Data URL
 */
export function getBase64SizeInBytes(base64String: string): number {
  const padding = (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0);
  const base64Index = base64String.indexOf(',');
  const cleanBase64 = base64Index >= 0 ? base64String.substring(base64Index + 1) : base64String;
  return Math.max(0, Math.round((cleanBase64.length * 3) / 4) - padding);
}

/**
 * Check if the browser canvas supports WebP export
 */
function isWebPSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Compresses an image File object using client-side HTML5 Canvas.
 */
export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
    format = isWebPSupported() ? 'image/webp' : 'image/jpeg',
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    // 1. Create a safe object URL to read dimensions
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      // 2. Calculate proportional bounding dimensions
      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const widthRatio = maxWidth / targetWidth;
        const heightRatio = maxHeight / targetHeight;
        const scaleFactor = Math.min(widthRatio, heightRatio);

        targetWidth = Math.round(targetWidth * scaleFactor);
        targetHeight = Math.round(targetHeight * scaleFactor);
      }

      // 3. Render into canvas with high-quality smoothing
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Impossible d'initialiser le moteur de rendu Canvas."));
        return;
      }

      // Fill white background for transparent PNGs converted to JPEG
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 4. Export compressed Data URL
      let dataUrl: string;
      try {
        dataUrl = canvas.toDataURL(format, quality);
      } catch (err) {
        // Fallback to JPEG if WebP throws in edge cases
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      const compressedSize = getBase64SizeInBytes(dataUrl);
      const reductionPercentage = originalSize > 0
        ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
        : 0;

      resolve({
        dataUrl,
        originalSize,
        compressedSize,
        width: targetWidth,
        height: targetHeight,
        originalWidth,
        originalHeight,
        reductionPercentage,
        format: dataUrl.startsWith('data:image/webp') ? 'WebP' : 'JPEG',
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Le fichier sélectionné n'a pas pu être décodé en tant qu'image valide."));
    };

    img.src = objectUrl;
  });
}
