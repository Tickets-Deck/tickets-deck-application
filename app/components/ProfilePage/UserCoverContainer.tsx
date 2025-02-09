import { ReactElement, FunctionComponent, useState } from "react";
import { CheckIcon, EditIcon } from "../SVGs/SVGicons";
import Image from "next/image";
// import styles from "../../styles/ProfilePage.module.scss";
import { useSession } from "next-auth/react";
import { useUpdateUserCoverPhoto } from "@/app/api/apiClient";
import { UserCredentialsResponse } from "@/app/models/IUser";
import getBase64Url from "@/lib/getLocalBase64Url";
import { getBlurData } from "@/lib/getBlurData";

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
  const [isUpdatingCoverPhoto, setIsUpdatingCoverPhoto] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [coverImageBase64Url, setCoverImageBase64Url] = useState<string>();
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
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/webp"
    ) {
      // Unset validation message
      // setPhotoErrorMsg(false);

      const file = e.target.files[0]; // Get the selected file

      if (file) {
        setCoverImageFile(file);

        // Instantiate a FileReader object
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

          if (base64URL) {
            // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
            const base64String = base64URL.split(",")[1];

            // console.log('base64URL: ', base64String);
            setCoverImageBase64Url(base64String);
          }
        };

        // Read the file as a data URL (base64-encoded)
        reader.readAsDataURL(file);
      }
    }
    // Otherwise...
    else {
      // Set appropriate validation message
      // setPhotoErrorMsg('Please select a valid photo');

      // Exit this method
      return;
    }

    // Set the image url
    const imgURL = URL.createObjectURL(selectedFile);

    // Update the image url state
    setCoverImageUrl(imgURL);
  };

  async function handleUploadUserCoverPhoto() {
    // Spin the spinner
    setIsUpdatingCoverPhoto(true);

    await updateUserCoverPhoto(session?.user.id as string, {
      coverPhoto: coverImageBase64Url as string,
    })
      .then(async (response) => {
        setCoverImageUrl(undefined);
        setCoverImageFile(undefined);
        setCoverImageBase64Url(undefined);

        handleFetchUserInformation();
        // Update the user's profile photo in the session
        await update({
          ...session,
          user: {
            ...session?.user,
            image: response.data.profilePhoto,
          },
        });
        // Stop the spinner
        setIsUpdatingCoverPhoto(false);
      })
      .catch((error) => {
        console.log(error);
        // Stop the spinner
        setIsUpdatingCoverPhoto(false);
      });
  }

  // async function handleGetBase64Url(url: string) {
  //     const base64Url = await getBase64Url(url);
  //     return base64Url;
  // }
  // handleGetBase64Url("https://placehold.co/1200x300/8133F1/FFFFFF/png?text=Cover");

  // const myDynamicUrl = await getBase64Url(coverImageUrl ?? userInformation.coverPhoto ?? "https://placehold.co/1200x300/8133F1/FFFFFF/png?text=Cover");

  return (
    <div className='h-[220px] relative overflow-hidden'>
      <div className='absolute top-0 left-0 size-full z-[1] overflow-hidden [&_img]:object-cover'>
        <Image
          src={`${
            coverImageUrl ??
            userInformation.coverPhoto ??
            "https://placehold.co/1200x300/8133F1/FFFFFF/png?text=Cover"
          }`}
          // blurDataURL="data:image/jpeg;base64,MGGZ]c#n9a9]s-00jY$%S2xb?woJR*xani"
          alt='Cover image'
          fill
          placeholder='data:image/jpeg;base64,MGGZ]c#n9a9]s-00jY$%S2xb?woJR*xani'
          priority
          // blurDataURL="https://placehold.co/1200x300/8133F1/FFFFFF/png?text=Loading..."
        />
        {/* {<input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e)} />} */}
      </div>
      {!forUser && (
        <div className='flex gap-2 absolute top-6 right-8'>
          {!coverImageUrl ? (
            <button className='z-[2] tertiaryButton !py-[0.4rem] !ml-auto [&_svg_path]:!fill-dark-grey !gap-1 !px-[0.8rem]'>
              <EditIcon />
              Edit Cover Photo
              <input
                type='file'
                className='absolute size-full top-0 left-0 opacity-0 cursor-pointer'
                accept='image/png, image/jpeg'
                onChange={(e) => handleFileUpload(e)}
              />
            </button>
          ) : (
            <>
              <button
                disabled={isUpdatingCoverPhoto}
                className='z-[2] tertiaryButton !py-[0.4rem] !ml-auto [&_svg_path]:!fill-dark-grey !gap-1 !px-[0.8rem]'
              >
                <EditIcon />
                Change Photo
                <input
                  type='file'
                  className='absolute size-full top-0 left-0 opacity-0 cursor-pointer'
                  accept='image/png, image/jpeg'
                  onChange={(e) => handleFileUpload(e)}
                />
              </button>
              <button
                disabled={isUpdatingCoverPhoto}
                className='z-[2] tertiaryButton !py-[0.4rem] !ml-auto [&_svg_path]:!fill-dark-grey !gap-1 !px-[0.8rem]'
                onClick={handleUploadUserCoverPhoto}
              >
                <CheckIcon />
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
