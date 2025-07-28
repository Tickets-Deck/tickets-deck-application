import { ReactElement, FunctionComponent, useState } from "react";
import { Icons } from "../ui/icons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUpdateUserCoverPhoto } from "@/app/api/apiClient";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useToast } from "@/app/context/ToastCardContext";
import { compressImage } from "@/utils/imageCompress";

interface UserCoverContainerProps {
  userInformation: UserCredentialsResponse;
  handleFetchUserInformation: () => Promise<void>;
  forUser?: boolean;
}

const UserCoverContainer: FunctionComponent<UserCoverContainerProps> = ({
  userInformation,
  handleFetchUserInformation,
  forUser,
}): ReactElement => {
  const updateUserCoverPhoto = useUpdateUserCoverPhoto();
  const toast = useToast();
  const [isUpdatingCoverPhoto, setIsUpdatingCoverPhoto] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const { data: session, update } = useSession();

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
      selectedFile &&
      (selectedFile.type === "image/jpg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/webp")
    ) {
      setCoverImageFile(selectedFile);
      setCoverImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  async function handleUploadUserCoverPhoto() {
    // Spin the spinner
    setIsUpdatingCoverPhoto(true);

    if (!coverImageFile) {
      toast.logError("Error", "Please select a cover photo to upload.");
      setIsUpdatingCoverPhoto(false);
      return;
    }

    try {
      const formData = new FormData();
      const { compressedFile } = await compressImage(coverImageFile);
      formData.append("coverPhoto", compressedFile);

      await updateUserCoverPhoto(
        session?.user.token as string,
        session?.user.id as string,
        formData
      );

      setCoverImageUrl(undefined);
      setCoverImageFile(undefined);
      handleFetchUserInformation();
      toast.logSuccess("Success", "Cover photo updated successfully.");
    } catch (error) {
      toast.logError("Error", "Failed to update cover photo.");
      console.log(error);
    } finally {
      setIsUpdatingCoverPhoto(false);
    }
  }

  return (
    <div className="h-[220px] md:h-80 relative overflow-hidden">
      <div className="absolute top-0 left-0 size-full z-[1] overflow-hidden [&_img]:object-cover">
        <Image
          src={`${
            coverImageUrl ||
            userInformation.coverPhoto ||
            "https://placehold.co/1600x400/8133F1/FFFFFF/png?text=Cover+Photo"
          }`}
          alt="Cover image"
          width={1600}
          height={400}
          // fill
          priority
          // blurDataURL="data:image/jpeg;base64,MGGZ]c#n9a9]s-00jY$%S2xb?woJR*xani"
          //   placeholder='data:image/jpeg;base64,MGGZ]c#n9a9]s-00jY$%S2xb?woJR*xani'
          // blurDataURL="https://placehold.co/1200x300/8133F1/FFFFFF/png?text=Loading..."
        />
        {/* {<input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e)} />} */}
      </div>
      {!forUser && (
        <div className="flex gap-2 absolute top-6 right-8">
          {!coverImageUrl ? (
            <button className="z-[2] tertiaryButton !py-[0.4rem] !ml-auto [&_svg_path]:!fill-dark-grey !gap-1 !px-[0.8rem]">
              <Icons.Edit />
              Edit Cover Photo
              <input
                type="file"
                className="absolute size-full top-0 left-0 opacity-0 cursor-pointer"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileUpload(e)}
              />
            </button>
          ) : (
            <>
              <button
                disabled={isUpdatingCoverPhoto}
                className="z-[2] tertiaryButton !py-[0.4rem] !ml-auto [&_svg_path]:!fill-dark-grey !gap-1 !px-[0.8rem]"
              >
                <Icons.Edit />
                Change Photo
                <input
                  type="file"
                  className="absolute size-full top-0 left-0 opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg"
                  onChange={(e) => handleFileUpload(e)}
                />
              </button>
              <button
                disabled={isUpdatingCoverPhoto}
                className="z-[2] tertiaryButton !py-[0.4rem] !ml-auto [&_svg_path]:!fill-dark-grey !gap-1 !px-[0.8rem]"
                onClick={handleUploadUserCoverPhoto}
              >
                <Icons.Check />
                {isUpdatingCoverPhoto ? "Updating..." : "Upload"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCoverContainer;
