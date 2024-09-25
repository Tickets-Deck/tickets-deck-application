import QRCode from "qrcode";
import { createCanvas } from "canvas";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// const QR_CODES_DIR = path.join(process.cwd(), "public", "qrcodes");

// export const generateQRCodeImage = async (text: string): Promise<string> => {
//   const id = uuidv4();
//   const filePath = path.join(QR_CODES_DIR, `${id}.png`);

//   try {
//     const canvas = createCanvas(200, 200);
//     await qr.toCanvas(canvas, text);

//     // Convert canvas to PNG buffer
//     const buffer = canvas.toBuffer("image/png");

//     // Save the PNG buffer as a file
//     fs.writeFileSync(filePath, buffer);

//     return `/qrcodes/${id}.png`; // Return the relative URL of the generated QR code image
//   } catch (error) {
//     console.error("Error generating QR code:", error);
//     throw new Error("Failed to generate QR code");
//   }
// };

// export const generateQRCodeImage = async (
//   text: string,
//   baseUrl: string
// ): Promise<string> => {
//   const id = uuidv4();
//   const filePath = path.join(QR_CODES_DIR, `${id}.png`);

//   try {
//     const canvas = createCanvas(200, 200);
//     await qr.toCanvas(canvas, text);

//     // Convert canvas to PNG buffer
//     const buffer = canvas.toBuffer("image/png");

//     // Save the PNG buffer as a file
//     fs.writeFileSync(filePath, buffer);

//     // Return the absolute URL of the generated QR code image
//     return new URL(`/qrcodes/${id}.png`, baseUrl).toString();
//   } catch (error) {
//     console.error("Error generating QR code:", error);
//     throw new Error("Failed to generate QR code");
//   }
// };

export async function generateQRCode(text: string): Promise<Buffer> {
  try {
    // const qrDataURL = await QRCode.toDataURL(text);
    const qrDataURL = await QRCode.toBuffer(text, { type: 'png' });
    // console.log("🚀 ~ generateQRCode ~ qrDataURL:", qrDataURL)
    return qrDataURL;
  } catch (error) {
    // console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}
