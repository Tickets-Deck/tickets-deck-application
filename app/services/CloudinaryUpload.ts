import { SetStateAction } from "react";

export async function uploadImageToCloudinary(
  imageFile: File | null,
  setIsUploadingImage: (value: SetStateAction<boolean>) => void,
  cloudinaryImageUrl: string | undefined,
  setCloudinaryImageUrl: (value: SetStateAction<string | undefined>) => void
) {
  const cloudName = "dvxqk1487";

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  // const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDNAME}/upload`

  if (imageFile && !cloudinaryImageUrl) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "event_images");
    // formData.append("return_delete_token", "true"); // Not applicable for unsigned uploads

    // Start loader
    setIsUploadingImage(true);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCloudinaryImageUrl(data.secure_url);

        // Stop loader
        setIsUploadingImage(false);
      })
      .catch((error) => {
        // Stop loader
        setIsUploadingImage(false);
      });
  }

  return cloudinaryImageUrl;
}
