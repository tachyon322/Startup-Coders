export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.85,
    maxSizeKB = 900,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      // Calculate scale factor to fit within max dimensions
      const scaleX = maxWidth / width;
      const scaleY = maxHeight / height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
      
      const newWidth = Math.floor(width * scale);
      const newHeight = Math.floor(height * scale);

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw image with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Start with initial quality and reduce until we meet size requirement
      let currentQuality = quality;
      let attempts = 0;
      const maxAttempts = 15;
      const qualityStep = 0.05;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const sizeKB = blob.size / 1024;
            attempts++;

            console.log(`Attempt ${attempts}: Quality ${currentQuality.toFixed(2)}, Size: ${sizeKB.toFixed(2)}KB`);

            // If size is acceptable, use this result
            if (sizeKB <= maxSizeKB) {
              const compressedFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: Date.now(),
              });
              console.log(`Final result: ${sizeKB.toFixed(2)}KB with quality ${currentQuality.toFixed(2)}`);
              resolve(compressedFile);
              return;
            }

            // If still too large and we haven't reached max attempts
            if (attempts < maxAttempts && currentQuality > 0.1) {
              currentQuality = Math.max(0.1, currentQuality - qualityStep);
              tryCompress();
            } else {
              // If we've tried everything, reduce dimensions further
              if (newWidth > 800 || newHeight > 600) {
                const smallerScale = Math.min(800 / width, 600 / height, scale * 0.8);
                const smallerWidth = Math.floor(width * smallerScale);
                const smallerHeight = Math.floor(height * smallerScale);
                
                canvas.width = smallerWidth;
                canvas.height = smallerHeight;
                ctx.drawImage(img, 0, 0, smallerWidth, smallerHeight);
                
                currentQuality = 0.7; // Reset quality for smaller image
                attempts = 0; // Reset attempts
                tryCompress();
              } else {
                // Last resort - use current result even if over size
                const compressedFile = new File([blob], file.name, {
                  type: blob.type,
                  lastModified: Date.now(),
                });
                console.log(`Final fallback result: ${sizeKB.toFixed(2)}KB`);
                resolve(compressedFile);
              }
            }
          },
          'image/jpeg', // Force JPEG for better compression
          currentQuality
        );
      };

      // Start compression
      tryCompress();
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    
    // Clean up object URL after image loads
    const originalOnload = img.onload;
    img.onload = (event) => {
      URL.revokeObjectURL(objectUrl);
      if (originalOnload) {
        originalOnload.call(img, event);
      }
    };
  });
}

export async function compressImages(
  files: File[],
  options?: CompressionOptions
): Promise<File[]> {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
}