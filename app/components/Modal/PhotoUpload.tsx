import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import styles from "../../styles/PhotoUpload.module.scss";
import { CloseIcon } from '../SVGs/SVGicons';
import Image from 'next/image';
import { useUploadUserProfilePhoto } from '@/app/api/apiClient';
import { useSession } from 'next-auth/react';
import ComponentLoader from '../Loader/ComponentLoader';
import useResponsiveness from '@/app/hooks/useResponsiveness';

interface PhotoUploadProps {
    visibility: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
    handleFetchUserInformation: () => Promise<void>
}

const PhotoUpload: FunctionComponent<PhotoUploadProps> = ({ visibility, setVisibility, handleFetchUserInformation }): ReactElement => {

    const uploadUserProfilePhoto = useUploadUserProfilePhoto();
    const [imageUrl, setImageUrl] = useState<string>();
    const [imageBase64Url, setImageBase64Url] = useState<string>();
    const [imageFile, setImageFile] = useState<File>();
    const [photoErrorMsg, setPhotoErrorMsg] = useState<string | boolean>(false); // [false, 'Please select a valid photo'
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const { data: session, update } = useSession();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    /**
     * Function to handle image file upload and update form values
     * @param e is the event handler
     * @returns void
     */
    const handleFileUpload = (e: any) => {

        // Get the selected file
        const selectedFile: File = e.target.files[0];

        // If a valid file was selected...
        if (selectedFile.type === "image/jpg" || selectedFile.type === "image/png" || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/webp') {

            // Unset validation message
            // setPhotoErrorMsg(false);

            const file = e.target.files[0]; // Get the selected file

            if (file) {
                setImageFile(file);

                // Instantiate a FileReader object
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

                    if (base64URL) {
                        // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
                        const base64String = base64URL.split(',')[1];

                        // console.log('base64URL: ', base64String);
                        setImageBase64Url(base64String);
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
        setImageUrl(imgURL);
    };

    async function handleUploadUserProfilePhoto() {

        // Spin the spinner
        setUploadingPhoto(true);

        // console.log(session?.user.id as string, { profilePhoto: imageBase64Url as string })

        await uploadUserProfilePhoto(session?.user.id as string, { profilePhoto: imageBase64Url as string })
            .then(async (response) => {
                handleFetchUserInformation();

                // Update the user's profile photo in the session
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        image: response.data.profilePhoto,
                    },
                })
                
                // Close the modal
                setVisibility(false);
                // Stop the spinner
                setUploadingPhoto(false);
            })
            .catch((error) => {
                console.log(error);
                // Stop the spinner
                setUploadingPhoto(false);
            })
        // .finally(() => {
        // })
    };

    return (
        <ModalWrapper
            disallowOverlayFunction
            visibility={visibility}
            setVisibility={setVisibility}
            styles={{ backgroundColor: 'transparent', width: onDesktop ? "fit-content" : onMobile ? "100%" : "" }}>
            <div className={styles.photoUploadContainer}>
                <div className={styles.topArea}>
                    <h2>Upload Photo</h2>
                    <span className={styles.closeIcon} onClick={() => setVisibility(false)}><CloseIcon /></span>
                </div>
                <div className={styles.photoContainer}>
                    <div className={styles.photo}>
                        {imageUrl ?
                            <Image src={imageUrl} alt='User image' fill /> :
                            <Image src="https://placehold.co/300x300/8133F1/FFFFFF/png?text=Profile+Photo" alt="user image placeholder" fill />}
                    </div>
                    <span>Click to select an image</span>
                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e)} />
                </div>
                <button disabled={uploadingPhoto || !imageBase64Url} onClick={() => handleUploadUserProfilePhoto()}>
                    Upload Image
                    {uploadingPhoto && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                </button>
            </div>
        </ModalWrapper>
    );
}

export default PhotoUpload;