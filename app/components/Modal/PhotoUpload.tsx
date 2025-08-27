import {
  ReactElement,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import Image from "next/image";
import { useUploadUserProfilePhoto } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import ComponentLoader from "../Loader/ComponentLoader";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { useToast } from "@/app/context/ToastCardContext";
import { compressImage } from "@/utils/imageCompress";

interface PhotoUploadProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  handleFetchUserInformation: () => Promise<void>;
  userImageUrl: string | undefined;
}

const PhotoUpload: FunctionComponent<PhotoUploadProps> = ({
  visibility,
  setVisibility,
  handleFetchUserInformation,
  userImageUrl,
}): ReactElement => {
  const uploadUserProfilePhoto = useUploadUserProfilePhoto();
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageBase64Url, setImageBase64Url] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { data: session, update } = useSession();
  const toast = useToast();

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  /**
   * Function to handle image file upload and update form values
   * @param e is the event handler
   * @returns void
   */
  const handleFileUpload = (e: any) => {
    // Get the selected file
    const selectedFile: File = e.target.files[0];

    // If a valid file was selected...
    if (
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/webp"
    ) {
      const file = e.target.files[0]; // Get the selected file

      if (file) {
        setImageFile(file);

        // Instantiate a FileReader object
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

          if (base64URL) {
            // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
            const base64String = base64URL.split(",")[1];

            setImageBase64Url(base64String);
          }
        };

        // Read the file as a data URL (base64-encoded)
        reader.readAsDataURL(file);
      }
    }
    // Otherwise...
    else {
      // Exit this method
      return;
    }

    // Set the image url
    const imgURL = URL.createObjectURL(selectedFile);

    // Update the image url state
    setImageUrl(imgURL);
  };

  async function handleUploadUserProfilePhoto() {
    // Spin the spinner
    setUploadingPhoto(true);

    if (!imageFile) {
      toast.logError("Error", "Please select an image to upload.");
      setUploadingPhoto(false);
      return;
    }

    try {
      const formData = new FormData();
      const { compressedFile } = await compressImage(imageFile);

      // The key 'profilePhoto' must match the one in the FileInterceptor on the backend.
      formData.append("profilePhoto", compressedFile);

      const response = await uploadUserProfilePhoto(
        session?.user.token as string,
        session?.user.id as string,
        formData
      );

      handleFetchUserInformation();

      // Update the user's profile photo in the session
      await update({
        ...session,
        user: {
          ...session?.user,
          image: response.data.profilePhoto,
        },
      });

      toast.logSuccess("Success", "Profile photo uploaded successfully.");
      setVisibility(false);
    } catch (error) {
      toast.logError("Error", "Failed to upload profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  useEffect(() => {
    if (userImageUrl) {
      setImageUrl(userImageUrl);
    }
  }, [userImageUrl]);

  return (
    <ModalWrapper
      disallowOverlayFunction
      visibility={visibility}
      setVisibility={setVisibility}
      styles={{
        backgroundColor: "transparent",
        width: onDesktop ? "fit-content" : onMobile ? "100%" : "",
      }}
    >
      <div className="rounded-[20px] bg-container-grey p-4 flex flex-col items-center gap-6 w-full md:min-w-[21.875rem] md:w-auto">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-medium text-white">Upload Photo</h2>
          <span
            className="ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-[#fff] [&_svg_path]:fill-[#fff]"
            onClick={() => setVisibility(false)}
          >
            <Icons.Close />
          </span>
        </div>
        <div className="size-40 rounded-[1rem] relative overflow-hidden after:absolute after:top-0 after:left-0 after:size-full after:bg-black/50 after:opacity-0 after:scale-0 hover:after:opacity-100 hover:after:scale-100 group">
          <div className="size-full relative">
            {imageUrl ? (
              <Image
                className="object-cover"
                src={imageUrl}
                alt="User image"
                fill
              />
            ) : (
              <Image
                className="object-cover"
                src="https://placehold.co/300x300/8133F1/FFFFFF/png?text=Profile+Photo"
                alt="user image placeholder"
                fill
              />
            )}
          </div>
          <span className="absolute size-full grid place-items-center top-0 left-0 text-white text-center z-[2] opacity-0 scale-[0.6] group-hover:opacity-100 group-hover:scale-100">
            Click to select an image
          </span>
          <input
            className="absolute top-0 left-0 size-full opacity-0 z-[2] cursor-pointer"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileUpload(e)}
          />
        </div>
        <button
          className="w-fit rounded-[3.125rem] cursor-pointer text-sm py-[0.8rem] px-[1.6rem] border-none bg-white text-dark-grey flex items-center gap-2"
          disabled={uploadingPhoto || !imageBase64Url}
          onClick={() => handleUploadUserProfilePhoto()}
        >
          Upload Image
          {uploadingPhoto && (
            <ComponentLoader
              isSmallLoader
              customBackground="#fff"
              customLoaderColor="#111111"
            />
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default PhotoUpload;
