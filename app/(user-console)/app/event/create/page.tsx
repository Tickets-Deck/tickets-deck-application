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

interface CreateEventProps { }

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {
    const createEvent = useCreateEvent();
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

    async function handleEventCreation() {
        console.log("🚀 ~ handleEventCreation ~ eventRequest:", eventRequest);

        // Start loader
        setIsCreatingEvent(true);

        // Set the event request data
        const data: EventRequest = {
            ...(eventRequest as EventRequest),
            currency: "NGN",
            organizerPaysFee: eventRequest?.organizerPaysFee || false,
            allowedGuestType: eventRequest?.allowedGuestType || "Everyone",
        }

        // Create the event
        await createEvent(user?.token as string, data)
            .then((response) => {
                // Update created event state
                setIsEventCreated(true);

                // log response
                // console.log(response);

                // Persist the newly created event
                persistNewlyCreatedEvent(response.data);

                // Clear the event request
                // setEventRequest(undefined);

                // Redirect to the event page
                push(`${ApplicationRoutes.Event}/${response.data.id}`);
            })
            .catch((error) => {
                // log error
                // console.log(error);
                // Stop loader
                setIsCreatingEvent(false);
            });
        // .finally(() => {
        // });
    }

    useEffect(() => {
        setEventRequest({
            ...(eventRequest as EventRequest),
            publisherId: session?.user.id as string,
        });
    }, [session]);

    return (
        <div className='p-[1.25rem]'>
            <div className='p-4 md:p-0 max-[768px]:p-4 flex items-center justify-between'>
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
                onSubmit={moveToNextStage}>
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

                <div className='flelx justify-between w-full ml-auto gap-2'>
                    {eventCreationStage === EventCreationStage.BasicInfo && (
                        <div className='flex items-center gap-2'>
                            {eventRequest?.tags?.map((tag, index) => {
                                return (
                                    <span
                                        className='flex items-center gap-1 p-2 rounded-lg bg-white/10 text-sm text-white h-fit'
                                        key={index}
                                    >
                                        {tag}
                                        <span
                                            className='inline-flex size-4 rounded-full cursor-pointer hover:bg-white/15 [&:hover_svg_path]:stroke-white'
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
                        className='primaryButton !py-[10px] !px-[20px] !ml-auto'
                        type='submit'
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
                                customBackground='#fff'
                                customLoaderColor='#111111'
                            />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
