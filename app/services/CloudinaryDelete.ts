import { SetStateAction } from "react";
import cloudinary from "cloudinary";

export function deleteImageFromCloudinary(
  imageId: string,
  setIsDeletingingImage: (value: SetStateAction<boolean>) => void
) {
  const cloudName = "dvxqk1487";

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/destroy`;
  // const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDNAME}/upload`

  if (imageId) {
    const formData = new FormData();
    formData.append("resource_type", imageId); // image id is your public ID

    // Start loader
    setIsDeletingingImage(true);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {})
      .finally(() => {
        // Stop loader
        setIsDeletingingImage(false);
      });
  }
}

export async function deleteImageFromCloudinaryv2(
  imagePublicId: string,
  setIsDeletingingImage: (value: SetStateAction<boolean>) => void
) {
  // Show loader
  setIsDeletingingImage(true);

  // Delete image from cloudinary
  await cloudinary.v2.uploader.destroy(imagePublicId);
}
