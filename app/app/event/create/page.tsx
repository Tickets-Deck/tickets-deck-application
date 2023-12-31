"use client"
import React, { FunctionComponent, ReactElement, useState, FormEvent, useEffect } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import CreateEventProgressBar from "../../../components/shared/CreateEventProgressBar";
import { CloseIcon } from "@/app/components/SVGs/SVGicons";
import { EventRequest } from "@/app/models/IEvents";
import { EventVisibility } from "@/app/enums/IEventVisibility";
import BasicInformationForm from "@/app/components/Event/Create/BasicInformationForm";
import { ValidationStatus } from "@/app/enums/BasicInfoFormValidationStatus";
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import ImageUploadSection from "@/app/components/Event/Create/ImageUploadSection";
import TicketDetailsSection from "@/app/components/Event/Create/TicketDetailsSection";
import ConfirmationSection from "../../../components/Event/Create/ConfirmationSection";
import { useCreateEvent } from "@/app/api/apiClient";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { uploadImageToCloudinary } from "@/app/services/CloudinaryUpload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CreateEventProps {

}

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {

    const createEvent = useCreateEvent();
    const { data: session } = useSession();
    const {push} = useRouter();

    const [eventCreationStage, setEventCreationStage] = useState<EventCreationStage>(EventCreationStage.BasicInfo);
    const [eventRequest, setEventRequest] = useState<EventRequest>();
    const [validationStage, setValidationStage] = useState<{ status: ValidationStatus }>();

    const [mainImageFile, setMainImageFile] = useState<File>();
    const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState<string>();
    const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);

    const [isCreatingEvent, setIsCreatingEvent] = useState(false);

    function proceedToImageUpload() {

        // Set the validation stage to running
        setValidationStage({ status: ValidationStatus.Running });

        // Set visibility to public if it is undefined
        if (!eventRequest?.visibility) {
            setEventRequest({ ...eventRequest as EventRequest, visibility: EventVisibility.PUBLIC });
        }

        // Update the event creation stage
        // setEventCreationStage(EventCreationStage.ImageUpload);

        console.log(eventRequest);
    };

    function moveToNextStage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        switch (eventCreationStage) {
            case EventCreationStage.BasicInfo:
                proceedToImageUpload();
                break;
            case EventCreationStage.ImageUpload:
                setEventRequest({ ...eventRequest as EventRequest, tickets: [] });
                setEventCreationStage(EventCreationStage.TicketDetails);
                break;
            case EventCreationStage.TicketDetails:
                setEventCreationStage(EventCreationStage.Confirmation);
                break;
            case EventCreationStage.Confirmation:
                handleEventCreation();
                break;
        }
    };

    console.log("User ID: ", session?.user.id);

    async function handleEventCreation() {

        // Upload image to cloudinary
        const imageUrlResponse = await uploadImageToCloudinary(mainImageFile as File, setIsUploadingMainImage, cloudinaryImageUrl, setCloudinaryImageUrl)

        console.log('imageUrlResponse gotten1: ', imageUrlResponse);
        if (!imageUrlResponse) {
            console.log("Error uploading image to cloudinary");
            return;
        }

        console.log('imageUrlResponse gotten2: ', imageUrlResponse);

        // Start loader
        setIsCreatingEvent(true);

        // Create the event
        await createEvent({ ...eventRequest as EventRequest, mainImageUrl: imageUrlResponse as string })
            .then((response) => {
                // log response
                console.log(response);
                // Clear the event request
                setEventRequest(undefined);
                // Redirect to the event page
                push(`/app/event/${response.data.id}`);
            })
            .catch((error) => {
                // log error
                console.log(error);
            })
            .finally(() => {
                // Stop loader
                setIsCreatingEvent(false);
            });
};

useEffect(() => {
    setEventRequest({ ...eventRequest as EventRequest, publisherId: session?.user.id as string });
}, [session]);


return (
    <div className={styles.main}>
        <div className={styles.topArea}>
            <h3>Create Event</h3>
            {/* <Link href="/app/event/create">
                    <button>New Event</button>
                </Link> */}
        </div>

        <CreateEventProgressBar
            eventCreationStage={eventCreationStage}
            setEventCreationStage={setEventCreationStage}
            eventRequest={eventRequest}
        />

        <form onSubmit={moveToNextStage}>
            {eventCreationStage === EventCreationStage.BasicInfo &&
                <BasicInformationForm
                    eventRequest={eventRequest}
                    setEventRequest={setEventRequest}
                    validationStage={validationStage}
                    setValidationStage={setValidationStage}
                    setEventCreationStage={setEventCreationStage}
                />}

            {eventCreationStage === EventCreationStage.ImageUpload &&
                <ImageUploadSection
                    eventRequest={eventRequest}
                    setEventRequest={setEventRequest}
                    mainImageFile={mainImageFile}
                    setMainImageFile={setMainImageFile}
                />}

            {eventCreationStage === EventCreationStage.TicketDetails &&
                <TicketDetailsSection
                    eventRequest={eventRequest}
                    setEventRequest={setEventRequest}
                />
            }

            {eventCreationStage === EventCreationStage.Confirmation &&
                <ConfirmationSection
                    eventRequest={eventRequest}
                    setEventRequest={setEventRequest}
                />
            }

            <div className={styles.actionButtons}>
                <div className={styles.tagSection}>
                    {
                        eventRequest?.tags?.map((tag, index) => {
                            return (
                                <span className={styles.tag} key={index}>
                                    {tag}
                                    <span><CloseIcon /></span>
                                </span>
                            )
                        })
                    }
                </div>
                <button type="submit" disabled={isCreatingEvent || isUploadingMainImage}>
                    {/* { 'Next'} */}
                    {eventCreationStage === EventCreationStage.Confirmation ? isUploadingMainImage ? 'Uploading images' : isCreatingEvent ? 'Creating event' : 'Create Event' : 'Next'}
                    {isCreatingEvent && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                </button>
            </div>
        </form>
    </div>
);
}

export default CreateEvent;