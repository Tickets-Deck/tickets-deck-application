"use client";
import React, {
  FunctionComponent,
  ReactElement,
  useState,
  FormEvent,
  useEffect,
} from "react";
import CreateEventProgressBar from "../../../../components/shared/CreateEventProgressBar";
import { Icons } from "@/app/components/ui/icons";
import { EventRequest, EventResponse } from "@/app/models/IEvents";
import { EventVisibility } from "@/app/enums/IEventVisibility";
import BasicInformationForm from "@/app/components/Event/Create/BasicInformationForm";
import { ValidationStatus } from "@/app/enums/BasicInfoFormValidationStatus";
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import ImageUploadSection from "@/app/components/Event/Create/ImageUploadSection";
import TicketDetailsSection from "@/app/components/Event/Create/TicketDetailsSection";
import ConfirmationSection from "../../../../components/Event/Create/ConfirmationSection";
import { useCreateEvent } from "@/app/api/apiClient";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DefaultFormResponseStatus,
  FormFieldResponse,
} from "@/app/models/IFormField";
import { StorageKeys } from "@/app/constants/storageKeys";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { compressImage } from "@/utils/imageCompress";
import { formatFileSize } from "@/utils/formatFileSize";
import { useApplicationContext } from "@/app/context/ApplicationContext";
import { useToast } from "@/app/context/ToastCardContext";

interface CreateEventProps {}

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {
  const toasthandler = useToast();
  const createEvent = useCreateEvent();
  const { eventCategories, handleFetchEventCategories } =
    useApplicationContext();
  const { data: session } = useSession();
  const user = session?.user;

  const { push } = useRouter();

  const [eventCreationStage, setEventCreationStage] =
    useState<EventCreationStage>(EventCreationStage.BasicInfo);
  const [eventRequest, setEventRequest] = useState<EventRequest>();
  const [isEventCreated, setIsEventCreated] = useState(false);
  const [validationStage, setValidationStage] = useState<{
    status: ValidationStatus;
  }>();

  const [mainImageFile, setMainImageFile] = useState<File>();
  const [mainImageUrl, setMainImageUrl] = useState<string>();
  const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);
  const [imageValidationMessage, setImageValidationMessage] =
    useState<FormFieldResponse>();
  const [ticketValidationMessage, setTicketValidationMessage] =
    useState<FormFieldResponse>();
  const [disableAllTabs, setDisableAllTabs] = useState(false);

  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  function proceedToImageUpload() {
    // Set the validation stage to running
    setValidationStage({ status: ValidationStatus.Running });

    // Set visibility to public if it is undefined
    if (!eventRequest?.visibility) {
      setEventRequest({
        ...(eventRequest as EventRequest),
        visibility: EventVisibility.PUBLIC,
      });
    }

    // Update the event creation stage
    // setEventCreationStage(EventCreationStage.ImageUpload);

    // console.log(eventRequest);
  }

  function moveToNextStage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    switch (eventCreationStage) {
      case EventCreationStage.BasicInfo:
        proceedToImageUpload();
        break;
      case EventCreationStage.ImageUpload:
        if (eventRequest?.mainImageBase64Url) {
          setEventRequest({ ...(eventRequest as EventRequest), tickets: [] });
          setEventCreationStage(EventCreationStage.TicketDetails);
          break;
        }
        setImageValidationMessage({
          message: "Please upload an image",
          status: DefaultFormResponseStatus.Failed,
        });
        break;
      case EventCreationStage.TicketDetails:
        if (eventRequest?.tickets?.length === 0) {
          setTicketValidationMessage({
            message: "Please add at least one ticket",
            status: DefaultFormResponseStatus.Failed,
          });
          break;
        }
        setEventCreationStage(EventCreationStage.Confirmation);
        break;
      case EventCreationStage.Confirmation:
        setDisableAllTabs(true);
        handleEventCreation();
        break;
    }
  }

  function removeTagFromFormRequest(selectedTag: string) {
    // Write code to remove tag from form request
    const tags = eventRequest?.tags?.filter((tag) => tag !== selectedTag);
    if (!tags) {
      setEventRequest({ ...(eventRequest as EventRequest), tags: [] });
      return;
    }
    setEventRequest({ ...(eventRequest as EventRequest), tags: tags });
  }

  function persistNewlyCreatedEvent(event: EventResponse) {
    // persist the newly created event to session storage
    const newlyCreatedEvent = JSON.stringify(event);

    // Save the event to session storage
    sessionStorage.setItem(StorageKeys.NewlyCreatedEvent, newlyCreatedEvent);
  }

  //   async function handleEventCreation() {
  //     if (!eventRequest) {
  //       return;
  //     }

  //     // Start loader
  //     setIsCreatingEvent(true);

  //     const formData = new FormData();

  //     // Append the file
  //     // formData.append("mainImage", mainImageFile || "");
  //     // Compress image if it's too large (e.g., > 2MB)
  //     if (mainImageFile && mainImageFile.size > 2 * 1024 * 1024) {
  //       console.log(`Original image size: ${formatFileSize(mainImageFile.size)}`);

  //       //   const compressedImage = await compressImage(mainImageFile);
  //       const {
  //         compressedFile,
  //         originalSize,
  //         compressedSize,
  //         reductionPercentage,
  //       } = await compressImage(mainImageFile);

  //       console.log(`Original image size: ${formatFileSize(originalSize)}`);
  //       console.log(`Compressed image size: ${formatFileSize(compressedSize)}`);
  //       console.log(`Reduction: ${reductionPercentage.toFixed(2)}%`);

  //       formData.append("mainImage", compressedFile);
  //     } else {
  //       formData.append("mainImage", mainImageFile || "");
  //     }

  //     // Append all other fields as strings
  //     for (const [key, value] of Object.entries(eventRequest)) {
  //       if (key == "mainImageBase64Url") continue;

  //       if (
  //         [
  //           "startDate",
  //           "endDate",
  //           "purchaseStartDate",
  //           "purchaseEndDate",
  //         ].includes(key)
  //       ) {
  //         const date = new Date(value as string);
  //         if (!isNaN(date.getTime())) {
  //           formData.append(key, date.toISOString());
  //         } else {
  //           console.warn(`Invalid date value for ${key}:`, value);
  //         }
  //         continue;
  //       }

  //       if (typeof value === "object") {
  //         formData.append(key, JSON.stringify(value)); // For arrays/objects like tags, tickets
  //       } else {
  //         formData.append(key, String(value));
  //       }
  //     }

  //     formData.append("currency", "NGN");
  //     formData.append(
  //       "organizerPaysFee",
  //       `${eventRequest?.organizerPaysFee || false}`
  //     );
  //     formData.append(
  //       "allowedGuestType",
  //       eventRequest?.allowedGuestType || "Everyone"
  //     );

  //     // Set the event request data
  //     // const data: EventRequest = {
  //     //   ...(eventRequest as EventRequest),
  //     //   currency: "NGN",
  //     //   organizerPaysFee: eventRequest?.organizerPaysFee || false,
  //     //   allowedGuestType: eventRequest?.allowedGuestType || "Everyone",
  //     //   mainImageBase64Url: "" // no longer needed.
  //     // };

  //     // Create the event
  //     await createEvent(user?.token as string, formData)
  //       .then((response) => {
  //         // Update created event state
  //         setIsEventCreated(true);

  //         // log response
  //         // console.log(response);

  //         // Persist the newly created event
  //         persistNewlyCreatedEvent(response.data);

  //         // Clear the event request
  //         // setEventRequest(undefined);

  //         // Redirect to the event page
  //         push(`${ApplicationRoutes.Event}/${response.data.id}`);
  //       })
  //       .catch((error) => {
  //         // log error
  //         // console.log(error);
  //         // Stop loader
  //         setIsCreatingEvent(false);
  //       });
  //     // .finally(() => {
  //     // });
  //   }

  async function handleEventCreation() {
    // 1. Guard Clause: Ensure essential data exists before proceeding.
    if (!eventRequest || !user?.token) {
      console.error("Event creation failed: Missing event data or user token.");
      // Optionally, show an error message to the user here.
      // e.g., showToast("Cannot create event. Please log in and try again.", { type: "error" });
      return;
    }

    // 2. Start Loader: Update UI to show a loading state.
    setIsCreatingEvent(true);

    try {
      const formData = new FormData();

      // 3. Image Processing: Compress if necessary and append to FormData.
      if (mainImageFile) {
        const isLargeFile = mainImageFile.size > 2 * 1024 * 1024; // 2MB threshold
        let fileToUpload = mainImageFile;

        console.log(
          `Original image size: ${formatFileSize(mainImageFile.size)}`
        );
        const { compressedFile, compressedSize, reductionPercentage } =
          await compressImage(mainImageFile);
        console.log(
          `Compressed to: ${formatFileSize(
            compressedSize
          )} (${reductionPercentage.toFixed(2)}% reduction)`
        );
        fileToUpload = compressedFile;

        formData.append("mainImage", fileToUpload);

        // if (isLargeFile) {
        //   console.log(
        //     `Original image size: ${formatFileSize(mainImageFile.size)}`
        //   );
        //   const { compressedFile, compressedSize, reductionPercentage } =
        //     await compressImage(mainImageFile);
        //   console.log(
        //     `Compressed to: ${formatFileSize(
        //       compressedSize
        //     )} (${reductionPercentage.toFixed(2)}% reduction)`
        //   );
        //   fileToUpload = compressedFile;
        // }

        // // IMPORTANT: Use 'file' to match the backend Multer middleware parameter.
        // formData.append("mainImage", fileToUpload);
      }

      // 4. Prepare Data Object: Consolidate all event data and set defaults.
      const eventData = {
        ...eventRequest,
        currency: "NGN",
        organizerPaysFee: eventRequest.organizerPaysFee || false,
        allowedGuestType: eventRequest.allowedGuestType || "Everyone",
        // Set default purchaseStartDate to today if not provided.
        purchaseStartDate:
          eventRequest.purchaseStartDate || new Date().toISOString(),
      };

      // 5. Populate FormData: Append all fields from the prepared data object.
      for (const [key, value] of Object.entries(eventData)) {
        // Skip the legacy Base64 field and the file object itself.
        if (key === "mainImageBase64Url" || key === "mainImageFile") {
          continue;
        }

        // Handle date fields explicitly to ensure they are in ISO 8601 format.
        if (
          [
            "startDate",
            "endDate",
            "purchaseStartDate",
            "purchaseEndDate",
          ].includes(key) &&
          value
        ) {
          const date = new Date(value as string);
          // Ensure the date is valid before appending
          if (!isNaN(date.getTime())) {
            formData.append(key, date.toISOString());
          } else {
            console.warn(`Skipping invalid date for ${key}:`, value);
          }
          // Continue to the next item in the loop
          continue;
        }

        // Stringify objects/arrays (like tags and tickets).
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        }
        // Append all other defined, non-null values.
        else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      // 6. API Call: Execute the event creation request.
      const response = await createEvent(user.token, formData);

      // --- Success Path ---
      console.log("Event created successfully:", response.data);
      setIsEventCreated(true);
      persistNewlyCreatedEvent(response.data);

      // Redirect to the new event's page.
      push(`${ApplicationRoutes.Event}/${response.data.id}`);
    } catch (error) {
      // --- Error Path ---
      // 7. Log the actual error for debugging and provide user feedback.
      console.error("💥 Failed to create event:", error);
      // e.g., showToast("Event creation failed. Please check your details and try again.", { type: "error" });

      // 8. Stop Loader: This runs when there is a failure.
      setIsCreatingEvent(false);
    }
  }

  useEffect(() => {
    setEventRequest({
      ...(eventRequest as EventRequest),
      publisherId: session?.user.id as string,
    });
  }, [session]);

  useEffect(() => {
    if (!eventCategories) {
      handleFetchEventCategories();
    }
  }, [eventCategories]);

  return (
    <div className="p-[1.25rem]">
      <div className="p-4 md:p-0 max-[768px]:p-4 flex items-center justify-between">
        <h3 className="text-3xl font-normal text-white">Create Event</h3>
      </div>

      <CreateEventProgressBar
        eventCreationStage={eventCreationStage}
        setEventCreationStage={setEventCreationStage}
        eventRequest={eventRequest}
        disableAllTabs={disableAllTabs}
      />

      <form
        className="max-[768px]:border-none max-[768px]:mb-16 p-4 border-[1px] border-primary-color-sub/50 rounded-lg"
        onSubmit={moveToNextStage}
      >
        {eventCreationStage === EventCreationStage.BasicInfo && (
          <BasicInformationForm
            eventRequest={eventRequest}
            setEventRequest={setEventRequest}
            validationStage={validationStage}
            setValidationStage={setValidationStage}
            setEventCreationStage={setEventCreationStage}
          />
        )}

        {eventCreationStage === EventCreationStage.ImageUpload && (
          <ImageUploadSection
            eventRequest={eventRequest}
            setEventRequest={setEventRequest}
            mainImageFile={mainImageFile}
            setMainImageFile={setMainImageFile}
            mainImageUrl={mainImageUrl}
            setMainImageUrl={setMainImageUrl}
            imageValidationMessage={imageValidationMessage}
            setImageValidationMessage={setImageValidationMessage}
          />
        )}

        {eventCreationStage === EventCreationStage.TicketDetails && (
          <TicketDetailsSection
            eventRequest={eventRequest}
            setEventRequest={setEventRequest}
            ticketValidationMessage={ticketValidationMessage}
            setTicketValidationMessage={setTicketValidationMessage}
          />
        )}

        {eventCreationStage === EventCreationStage.Confirmation && (
          <ConfirmationSection
            eventRequest={eventRequest}
            setEventRequest={setEventRequest}
            isEventCreated={isEventCreated}
            mainImageUrl={mainImageUrl}
            setEventCreationStage={setEventCreationStage}
          />
        )}

        <div className="flelx justify-between w-full ml-auto gap-2">
          {eventCreationStage === EventCreationStage.BasicInfo && (
            <div className="flex items-center gap-2">
              {eventRequest?.tags?.map((tag, index) => {
                return (
                  <span
                    className="flex items-center gap-1 p-2 rounded-lg bg-white/10 text-sm text-white h-fit"
                    key={index}
                  >
                    {tag}
                    <span
                      className="inline-flex size-4 rounded-full cursor-pointer hover:bg-white/15 [&:hover_svg_path]:stroke-white"
                      onClick={() => removeTagFromFormRequest(tag)}
                    >
                      <Icons.Close />
                    </span>
                  </span>
                );
              })}
            </div>
          )}
          <button
            className="primaryButton !py-[10px] !px-[20px] !ml-auto"
            type="submit"
            disabled={isCreatingEvent || isUploadingMainImage}
          >
            {/* { 'Next'} */}
            {eventCreationStage === EventCreationStage.Confirmation
              ? isUploadingMainImage
                ? "Uploading images"
                : isCreatingEvent
                ? "Creating event"
                : "Create Event"
              : "Next"}
            {isCreatingEvent && (
              <ComponentLoader
                isSmallLoader
                customBackground="#fff"
                customLoaderColor="#111111"
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
