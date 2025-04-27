import {
  ReactElement,
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Icons } from "../../ui/icons";
import Image from "next/image";
import { EventRequest } from "@/app/models/IEvents";
import { FormFieldResponse } from "@/app/models/IFormField";

interface ImageUploadSectionProps {
  eventRequest: EventRequest | undefined;
  setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>;
  mainImageFile: File | undefined;
  setMainImageFile: Dispatch<SetStateAction<File | undefined>>;
  mainImageUrl: string | undefined;
  setMainImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  imageValidationMessage: FormFieldResponse | undefined;
  setImageValidationMessage: React.Dispatch<
    React.SetStateAction<FormFieldResponse | undefined>
  >;
}

const ImageUploadSection: FunctionComponent<ImageUploadSectionProps> = ({
  eventRequest,
  setEventRequest,
  mainImageFile,
  setMainImageFile,
  imageValidationMessage,
  setImageValidationMessage,
  mainImageUrl,
  setMainImageUrl,
}): ReactElement => {
  const [mainImageBase64Url, setMainImageBase64Url] = useState<string>();
  const [subImageFiles, setSubImageFiles] = useState<File[]>();
  const [subImageUrls, setSubImageUrls] = useState<string[]>();

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
        setMainImageFile(file);

        // Instantiate a FileReader object
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

          if (base64URL) {
            // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
            const base64String = base64URL.split(",")[1];

            // console.log('base64URL: ', base64String);
            setMainImageBase64Url(base64String);
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
    setMainImageUrl(imgURL);

    // Clear the error message
    setImageValidationMessage(undefined);
  };

  /**
   * Function to handle image file upload and update form values
   * @param e is the event handler
   * @returns void
   */
  const handleFileUploadIntoArray = (e: any, index?: number) => {
    console.log("running");

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
        console.log("index: ", index);
        console.log("subImageFiles: ", subImageFiles);
        // If index is defined, update the file at the specified index
        if (index && subImageFiles && subImageFiles[index]) {
          console.log("Update index");
          setSubImageFiles({ ...(subImageFiles as File[]), [index]: file });
        }
        // Otherwise, add the file to the array
        if (!subImageFiles) {
          setSubImageFiles([file]);
        } else {
          setSubImageFiles([...(subImageFiles as File[]), file]);
        }

        // Instantiate a FileReader object
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

          if (base64URL) {
            // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
            const base64String = base64URL.split(",")[1];

            // console.log('base64URL: ', base64String);
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

    console.log("subImageUrls: ", subImageUrls);
    // If index is defined, update the url at the specified index
    if (index && subImageUrls && subImageUrls[index]) {
      console.log("Update index");
      setSubImageUrls({ ...(subImageUrls as string[]), [index]: imgURL });
    }
    // Update the image url state
    if (!subImageUrls) {
      setSubImageUrls([imgURL]);
    } else {
      setSubImageUrls([...subImageUrls, imgURL]);
    }
  };

  useEffect(() => {
    if (mainImageBase64Url) {
      setEventRequest({
        ...(eventRequest as EventRequest),
        mainImageBase64Url: mainImageBase64Url,
      });
    }
  }, [mainImageBase64Url]);

  // useEffect(() => {
  //     if (eventRequest) {
  //         setMainImageUrl(eventRequest.mainImageUrl);
  //     }
  // }, [eventRequest])

  return (
    <div className='flex flex-col gap-8 mb-8'>
      <div className='flex flex-col gap-4'>
        <h3 className='font-normal text-white'>Main Image</h3>
        <div className='flex gap-6 items-center flex-col md:gap-4'>
          <div className='w-[250px] md:w-[50%] h-[250px] rounded-lg bg-[rgba($white,0.1)] overflow-hidden relative grid place-items-center cursor-pointer [&_img]:size-full [&_img]:object-cover [&_svg]:w-[40px] [&_svg]:h-[40px] [&_svg_path]:fill-white'>
            <input
              className='imageInput'
              type='file'
              accept='image/png, image/jpeg'
              onChange={(e) => handleFileUpload(e)}
            />
            {mainImageUrl && (
              <Image src={mainImageUrl} alt='Event flyer' fill />
            )}
            <Icons.Photo />
          </div>
          <button type='button' className='tertiaryButton'>
            <input
              className='imageInput'
              type='file'
              accept='image/png, image/jpeg'
              onChange={(e) => handleFileUpload(e)}
            />
            <span>{mainImageUrl ? "Change image" : "Choose image"}</span>
          </button>
        </div>
        {imageValidationMessage && (
          <span className='errorMsg'>{imageValidationMessage.message}</span>
        )}
      </div>

      {/* <div className={styles.subImagesContainer}>
                            <div className={styles.note}>
                                <h3>Add other images for this event</h3>
                                <p>Help people know more about your event by adding other images for this event.</p>
                            </div>

                            <div className={styles.subImages}>
                                <div className={styles.image}>
                                    {subImageUrls && <Image src={subImageUrls[0]} alt="Event flyer" fill />}
                                    <PhotoIcon />
                                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUploadIntoArray(e)} />
                                    {subImageUrls &&
                                        <button>
                                            Change Image
                                            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUploadIntoArray(e, 0)} />
                                        </button>}
                                </div>
                                <div className={styles.image}>
                                    <Image src={images.event_flyer} alt="Event flyer" />
                                </div>
                                <div className={styles.image}>
                                    <Image src={images.event_flyer} alt="Event flyer" />
                                </div>
                                <div className={styles.image}>
                                    <Image src={images.event_flyer} alt="Event flyer" />
                                </div>
                                <div className={styles.image}>
                                    <Image src={images.event_flyer} alt="Event flyer" />
                                </div>
                                <div className={styles.addImage}>
                                    <AddIcon />
                                </div>
                            </div>
                        </div> */}
    </div>
  );
};

export default ImageUploadSection;
