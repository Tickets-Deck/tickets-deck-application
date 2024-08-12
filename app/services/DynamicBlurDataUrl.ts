import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

// const baseUrl = process.env.NEXT_PUBLIC_URL;
// console.log("🚀 ~ baseUrl:", baseUrl);

// export async function dynamicBlurDataUrl(url: string) {
//   /**
//    * Fetches an image from a given URL, applies dynamic blur with width 25 and quality 50, and converts it to a base64 string.
//    */
//   const base64string = await fetch(
//     `${baseUrl}/_next/image?url=${url}&w=25&q=50`
//   ).then(async (response) =>
//     Buffer.from(await response.arrayBuffer()).toString("base64")
//   );
//   console.log("🚀 ~ dynamicBlurDataUrl ~ base64string:", base64string);

//   // Get SVG with blur filter
//   const blurSvg = `
//   <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
//     <filter id='b' color-interpolation-filters='sRGB'>
//         <feGaussianBlur stdDeviation='1' />
//     </filter>

//     <image
//         preserveAspectRatio='none'
//         filter='url(#b)'
//         x='0' y='0'
//         height='100%' width='100%'
//         href='data:image/avif;base64,${base64string}' />
//   </svg>
//   `;
//   console.log("🚀 ~ dynamicBlurDataUrl ~ blurSvg:", blurSvg);

//   // Convert SVG to base64
//   const toBase64 = (imgString: string) =>
//     typeof window === "undefined"
//       ? Buffer.from(imgString).toString("base64")
//       : window.btoa(imgString);

//   // Return data URL
//   return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
// };


function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function getFileBufferLocal(filepath: string) {
  // filepath is file addess exactly how is used in Image component (/ = public/)
  const realFilepath = path.join(process.cwd(), "public", filepath);
  return fs.readFile(realFilepath);
}

async function getFileBufferRemote(url: string) {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

function getFileBuffer(src: string) {
  const isRemote = src.startsWith("http");
  return isRemote ? getFileBufferRemote(src) : getFileBufferLocal(src);
}

export async function getPlaceholderImage(filepath: string) {
  try {
    const originalBuffer = await getFileBuffer(filepath);
    const resizedBuffer = await sharp(originalBuffer).resize(20).toBuffer();
    return {
      src: filepath,
      placeholder: bufferToBase64(resizedBuffer),
    };
  } catch {
    return {
      src: filepath,
      placeholder:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==",
    };
  }
}
