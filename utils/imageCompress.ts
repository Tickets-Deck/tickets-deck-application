import pako from "pako";

// export async function compressData<T>(data: T): Promise<Blob> {
//   const jsonString = JSON.stringify(data);
//   const uint8Array = new TextEncoder().encode(jsonString);
//   const compressed = pako.gzip(uint8Array);
//   return new Blob([compressed], { type: "application/json" });
// }

// export async function decompressData<T>(blob: Blob): Promise<T> {
//   const arrayBuffer = await blob.arrayBuffer();
//   const uint8Array = new Uint8Array(arrayBuffer);
//   const decompressed = pako.ungzip(uint8Array);
//   const jsonString = new TextDecoder().decode(decompressed);
//   return JSON.parse(jsonString) as T;
// }

// export async function compressImage(
//   file: File,
//   maxWidth = 1920,
//   quality = 0.8
// ): Promise<File> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const scale = Math.min(maxWidth / img.width, 1);
//         canvas.width = img.width * scale;
//         canvas.height = img.height * scale;

//         const ctx = canvas.getContext("2d");
//         ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

//         canvas.toBlob(
//           (blob) => {
//             if (!blob) {
//               reject(new Error("Canvas to Blob conversion failed"));
//               return;
//             }
//             resolve(
//               new File([blob], file.name, {
//                 type: "image/jpeg",
//                 lastModified: Date.now(),
//               })
//             );
//           },
//           "image/jpeg",
//           quality
//         );
//       };
//       img.onerror = reject;
//       img.src = event.target?.result as string;
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }

export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<{
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const compressedSize = compressedFile.size;
            const reductionPercentage =
              ((originalSize - compressedSize) / originalSize) * 100;

            resolve({
              compressedFile,
              originalSize,
              compressedSize,
              reductionPercentage,
            });
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function compressImageSizeOnly(
  file: File,
  options?: {
    maxWidth?: number; // Optional width scaling
    maxHeight?: number; // Optional height scaling
    quality?: number; // Compression quality (0–1 for JPEG/PNG)
  }
): Promise<{
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}> {
  const { maxWidth, maxHeight, quality = 0.8 } = options || {};

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Default: keep original dimensions
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (maxWidth || maxHeight) {
          const widthRatio = maxWidth ? maxWidth / img.width : 1;
          const heightRatio = maxHeight ? maxHeight / img.height : 1;
          const scale = Math.min(widthRatio, heightRatio, 1); // prevent upscale
          targetWidth = img.width * scale;
          targetHeight = img.height * scale;
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Keep original format
        const fileType = file.type; // e.g., "image/png" or "image/jpeg"

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: fileType,
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const compressedSize = compressedFile.size;
            const reductionPercentage =
              ((originalSize - compressedSize) / originalSize) * 100;

            resolve({
              compressedFile,
              originalSize,
              compressedSize,
              reductionPercentage,
            });
          },
          fileType,
          quality
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
