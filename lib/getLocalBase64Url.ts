// import fs from "node:fs/promises";
import { getPlaiceholder } from "plaiceholder";
// const { getPlaiceholder } = require('plaiceholder');

export default async function getBase64Url(imageUrl: string) {
  //   try {
  //     const res = await fetch(imageUrl);

  //     if (!res.ok) {
  //       throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
  //     }

  //     const buffer = await res.arrayBuffer();

  //     const { base64 } = await getPlaiceholder(Buffer.from(buffer));

  //     // Log the base64 string
  //     console.log("🚀 ~ getBase64Url ~ base64:", base64);

  //     return base64;
  //   } catch (error) {
  //     if (error instanceof Error) console.log(error.stack);
  //     error;
  //   }

  try {
    const src = "https://images.unsplash.com/photo-1621961458348-f013d219b50c";

    const buffer = await fetch(src).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );

    const { color } = await getPlaiceholder(buffer);

    console.log(color);
  } catch (err) {
    err;
  }
}
