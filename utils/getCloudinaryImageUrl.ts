export const buildCloudinaryImageUrl = (mainImageUrl: string) => {
  return mainImageUrl.replace("/upload", "/upload/q_auto,f_auto");
  //   return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/${mainImageUrl}`;
};
