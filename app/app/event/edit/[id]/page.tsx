"use client"
import { FunctionComponent, ReactElement, useEffect, useState, useContext, ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import styles from "@/app/styles/EditEvent.module.scss";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AddIcon, CalenderIcon, CheckIcon, CloseIcon, PhotoIcon } from '@/app/components/SVGs/SVGicons';
import { ToastContext } from '@/app/extensions/toast';
import { RetrievedTicketResponse, TicketResponse } from '@/app/models/ITicket';
import { EventRequest, EventResponse } from '@/app/models/IEvents';
import { useDeleteTicketById, useFetchEventById, useUpdateEventById } from '@/app/api/apiClient';
import { catchError } from '@/app/constants/catchError';
import useResponsiveness from '@/app/hooks/useResponsiveness';
import { DatePicker } from '@fluentui/react';
import useOuterClick from '@/app/hooks/useOuterClick';
import { categories } from '@/app/constants/eventCategories';
import { EventVisibility } from '@/app/enums/IEventVisibility';
import { FormFieldResponse } from '@/app/models/IFormField';
import TicketUpdateModal from '@/app/components/Event/Edit/TicketsUpdate/TicketUpdateModal';
import ComponentLoader from '@/app/components/Loader/ComponentLoader';
import TicketCreationModal from '@/app/components/Event/Create/TicketsCreation/TicketCreationModal';
import DeletionConfirmationModal from '@/app/components/Modal/DeletionConfirmation';
import { toast } from "sonner";
import EventDescriptionEditor from '@/app/components/Editor/EventDescription';

interface EventDetailsProps {
    params: { id: string }
}


const EventDetails: FunctionComponent<EventDetailsProps> = ({ params }): ReactElement => {

    const router = useRouter();
    const toasthandler = useContext(ToastContext);
    const fetchEventInfo = useFetchEventById();
    const deleteTicketById = useDeleteTicketById();
    const updateEventById = useUpdateEventById();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const id = params.id;

    const [eventRequest, setEventRequest] = useState<EventRequest>();
    const [eventInfo, setEventInfo] = useState<EventResponse>();
    const [eventTicketTypes, setEventTicketTypes] = useState<RetrievedTicketResponse[]>();

    const [mainImageFile, setMainImageFile] = useState<File>();
    const [mainImageBase64Url, setMainImageBase64Url] = useState<string>();
    const [mainImageUrl, setMainImageUrl] = useState<string>();
    const [imageValidationMessage, setImageValidationMessage] = useState<FormFieldResponse>();

    const [categoryDropdownIsVisible, setCategoryDropdownIsVisible] = useState(false);
    const [tag, setTag] = useState<string>();

    const [titleErrorMsg, setTitleErrorMsg] = useState<boolean>();
    const [venueErrorMsg, setVenueErrorMsg] = useState<boolean>();
    const [dateErrorMsg, setDateErrorMsg] = useState<boolean>();
    const [timeErrorMsg, setTimeErrorMsg] = useState<boolean>();
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState<boolean>();
    const [tagErrorMsg, setTagErrorMsg] = useState<boolean>();

    const [loader, setLoader] = useState(false);
    const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);

    const [isTicketCreationModalVisible, setIsTicketCreationModalVisible] = useState(false);
    const [isTicketUpdateModalVisible, setIsTicketUpdateModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketResponse>();
    const [isDeleteTicketConfirmationModalVisible, setIsDeleteTicketConfirmationModalVisible] = useState(false);
    const [isDeletingTicket, setIsDeletingTicket] = useState(false);

    function onFormValueChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setState?: Dispatch<SetStateAction<boolean | undefined>>) {

        // Destructure name and value from the event target
        const { name, value } = e.target;

        // Set the state
        setEventRequest({ ...eventRequest as EventRequest, [name]: value });

        // If setState is not undefined...
        if (setState) {
            // Set the state
            setState(false);
        }
    };

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
                setMainImageFile(file);

                // Instantiate a FileReader object
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

                    if (base64URL) {
                        // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
                        const base64String = base64URL.split(',')[1];

                        // console.log('base64URL: ', base64String);
                        setMainImageBase64Url(base64String);

                        // Update the request
                        setEventRequest({ ...eventRequest as EventRequest, mainImageUrl: base64String });
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

    async function handleDeleteTicket() {
        // Show loader
        setIsDeletingTicket(true);

        await deleteTicketById(selectedTicket?.id as string)
            .then(async (response) => {
                // Close the modal
                setIsDeleteTicketConfirmationModalVisible(false);
                // Fetch event info
                await handleFetchEventInfo();
            })
            .catch((error) => {
                // Display error
                toast.error("An error occurred while deleting this ticket.");

                // Catch error
                catchError(error);
            })
            .finally(() => {
                setIsDeletingTicket(false);
            })
    };

    async function handleFetchEventInfo() {

        // Set running flag
        setLoader(true);

        await fetchEventInfo(id)
            .then((response) => {

                // Log the result
                // console.log('Result:', response.data);

                // Set the event results
                let _eventInfo = response.data;

                if (!_eventInfo) {
                    // Route to event not-found page
                    router.push(`/event/not-found`);
                }

                // Update the event results
                setEventInfo(_eventInfo);
            })
            .catch((error) => {

                // Display the error
                toasthandler?.logError(
                    'Error fetching event',
                    'We encountered an error while fetchng event information. Please try again.'
                );

                catchError(error);
            })
            .finally(() => {
                // Unset running flag
                setLoader(false);
            })
    };

    async function handleUpdateEventById() {
        // console.log({ eventRequest });

        // Set running flag
        setIsUpdatingEvent(true);

        await updateEventById(eventInfo?.id as string, { ...eventRequest as EventRequest, eventId: eventInfo?.eventId as string, publisherId: eventInfo?.publisherId as string })
            .then(async (response) => {

                // Log the result
                // console.log('Result:', response.data);

                // Fetch updated event info
                // await handleFetchEventInfo();

                // Route to user events page
                router.push(`/app/events`);
            })
            .catch((error) => {
                // Unset running flag
                setIsUpdatingEvent(false);

                // Display the error
                toasthandler?.logError(
                    'Error updating event',
                    'We encountered an error while updating event information. Please try again.'
                );

                catchError(error);
            })
    };

    const eventDateRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    useEffect(() => {
        // Clear previous info
        setEventInfo(undefined);
        setEventTicketTypes(undefined);

        if (params && params.id) {
            // console.log('Fetching info based on Event ID:', id);
            handleFetchEventInfo();
        } else {
            // Route to flight not-found page
            router.push(`/event/not-found`);
        }
    }, [params]);

    useEffect(() => {
        if (eventInfo && (eventInfo.tickets !== null)) {
            const updatedTicketTypes = eventInfo.tickets.map(ticket => ({
                ...ticket,
                isSelected: false,
                selectedTickets: 0
            }));
            setEventTicketTypes(updatedTicketTypes);
        }
    }, [eventInfo]);

    // useEffect(() => {
    //     if (eventInfo) {
    //         setEventRequest({ ...eventRequest as EventRequest, description: eventInfo.description });
    //     }
    // }, [eventInfo]);

    useOuterClick(categoryDropdownRef, () => setCategoryDropdownIsVisible(false));

    return (
        <div className={styles.editEventDetailsPage}>

            <DeletionConfirmationModal
                visibility={isDeleteTicketConfirmationModalVisible}
                setVisibility={setIsDeleteTicketConfirmationModalVisible}
                deleteFunction={handleDeleteTicket}
                isLoading={isDeletingTicket}
                actionText='Delete Ticket'
            />

            <TicketUpdateModal
                modalVisibility={isTicketUpdateModalVisible}
                setModalVisibility={setIsTicketUpdateModalVisible}
                selectedTicket={selectedTicket}
                handleFetchEventInfo={handleFetchEventInfo}
            />

            <TicketCreationModal
                modalVisibility={isTicketCreationModalVisible}
                setModalVisibility={setIsTicketCreationModalVisible}
                eventRequest={eventRequest}
                setEventRequest={setEventRequest}
                forExistingEvent
                eventId={eventInfo?.id}
                handleFetchEventInfo={handleFetchEventInfo}
            />

            <section className={styles.heroSection}>
                <div className={styles.textContents}>
                    <h2>Edit Event Information</h2>
                    {
                        eventInfo &&
                        <button
                            type="button"
                            disabled={isUpdatingEvent}
                            onClick={() => handleUpdateEventById()}>
                            {!isUpdatingEvent && <CheckIcon />}
                            {isUpdatingEvent ? "Updating event" : "Save"}
                        </button>
                    }
                </div>
            </section>

            {
                eventInfo &&
                <div className={styles.formContainer}>
                    <form>
                        <div className={styles.lhs}>
                            <div className={styles.formField}>
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={eventRequest?.title ?? eventInfo?.title}
                                    placeholder="Event Title"
                                    onChange={(e) => onFormValueChange(e, setTitleErrorMsg)}
                                />
                                {titleErrorMsg && <span className={styles.errorMsg}>Please enter event title</span>}
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="venue">Location</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={eventRequest?.venue ?? eventInfo?.venue}
                                    id="venue"
                                    placeholder="Event Venue"
                                    onChange={(e) => onFormValueChange(e, setVenueErrorMsg)}
                                />
                                {venueErrorMsg && <span className={styles.errorMsg}>Please enter event location</span>}
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label htmlFor="date">Date</label>
                                    <div className={styles.inputFieldContainer} ref={eventDateRef}>
                                        <CalenderIcon />
                                        <DatePicker
                                            style={{
                                                backgroundColor: '#ed100'
                                            }}
                                            textField={{
                                                style: {
                                                    background: '#ed100'
                                                },
                                                borderless: true,
                                            }}
                                            calloutProps={{
                                                gapSpace: 8,
                                                target: eventDateRef
                                            }}
                                            placeholder="Event date"
                                            ariaLabel="Select a date"
                                            minDate={new Date()}
                                            value={eventRequest?.date ?? new Date(eventInfo?.date as string)}
                                            onSelectDate={(date) => {
                                                // Set the form value
                                                setEventRequest({ ...eventRequest as EventRequest, date: date as Date });
                                                // Close error message
                                                setDateErrorMsg(false);
                                            }}
                                            onKeyDown={(e) => {
                                                // console.log('Key down...');

                                                // If backward tab was pressed...
                                                if (e.shiftKey && e.key === 'Tab') {
                                                    // console.log("Backward tab pressed...");
                                                }

                                                // If forward was tab was pressed...
                                                if (e.key === 'Tab') {
                                                    // console.log("Forward tab pressed...");
                                                    // If shit key was enabled...
                                                    if (e.shiftKey)
                                                        // Exit to aviod backward tab
                                                        return;
                                                    // console.log('Got here...');
                                                }
                                            }}
                                            underlined={false}
                                            showGoToToday={false}
                                            isMonthPickerVisible={true}
                                        />
                                    </div>
                                    {dateErrorMsg && <span className={styles.errorMsg}>Please enter event date</span>}
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="time">Time</label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={eventRequest?.time ?? eventInfo?.time}
                                        placeholder="Event Time e.g 8pm"
                                        onChange={(e) => onFormValueChange(e, setTimeErrorMsg)}
                                    />
                                    {timeErrorMsg && <span className={styles.errorMsg}>Please enter event time</span>}
                                </div>
                            </div>

                            <div className={styles.formField}>
                                <label htmlFor="description">Description</label> 
                                <EventDescriptionEditor
                                    description={eventRequest?.description ?? eventInfo?.description} 
                                    setEventRequest={setEventRequest}
                                />
                                {/* <textarea
                                    // dangerouslySetInnerHTML={{ __html: eventRequest?.description ?? eventInfo.description }}
                                    name="description"
                                    value={eventRequest?.description ?? eventInfo?.description}
                                    placeholder="Event Description"
                                    onChange={(e) => onFormValueChange(e, setDescriptionErrorMsg)}
                                /> */}
                                {descriptionErrorMsg && <span className={styles.errorMsg}>Please enter event description</span>}
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label htmlFor="category">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Select category"
                                        value={eventRequest?.category ?? eventInfo?.category}
                                        onFocus={() => setCategoryDropdownIsVisible(true)}
                                        onClick={() => setCategoryDropdownIsVisible(true)}
                                        onChange={(e) => onFormValueChange(e)}
                                    />
                                    {categoryDropdownIsVisible &&
                                        <div className={styles.categoryDropdownContainer} style={{ width: "100%" }} ref={categoryDropdownRef}>
                                            {categories.map((category, index) => (
                                                <span
                                                    key={index}
                                                    onClick={() => {
                                                        // Set the form value
                                                        setEventRequest({ ...eventRequest as EventRequest, category: category });
                                                        // Hide the dropdown
                                                        setCategoryDropdownIsVisible(false);
                                                    }}>
                                                    {category}
                                                </span>
                                            ))}
                                        </div>}
                                </div>
                                {/* <div className={styles.formField}>
                                    <label htmlFor="tags">Tags</label>
                                    <div className={styles.inputFieldContainer} style={{ paddingRight: '0px' }}>
                                        <input
                                            type="text"
                                            name="tags"
                                            placeholder="Add event Tags"
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                            onKeyDown={(e) => {
                                                // If enter key was pressed...
                                                if (e.key === 'Enter') {
                                                    // Add tag to form request
                                                    addTagToFormRequest();
                                                }
                                            }}
                                        />
                                        <span
                                            className={styles.addTag}
                                            onClick={() => addTagToFormRequest()}>
                                            <AddIcon />
                                        </span>
                                    </div>
                                    {tagErrorMsg && <span className={styles.errorMsg}>Please add at least one tag</span>}
                                </div> */}
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="time">Visibility</label>
                                <select name="visibility" onChange={(e) => onFormValueChange(e)} value={eventRequest?.visibility ?? eventInfo?.visibility}>
                                    <option value={EventVisibility.PUBLIC}>Public - Visible to everyone</option>
                                    <option value={EventVisibility.PRIVATE}>Private - Visible to only people that have the link</option>
                                </select>
                            </div>

                            {/* <div className={styles.tagsSection}>
                                <h4>Tags</h4>

                                <div className={styles.tags}>
                                    {
                                        eventRequest?.tags ? eventRequest.tags.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                {tag}
                                                <span onClick={() => removeTagFromFormRequest(tag)}><CloseIcon /></span>
                                            </span>
                                        )) : eventInfo?.tags.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                {tag}
                                                <span onClick={() => removeTagFromFormRequest(tag)}><CloseIcon /></span>
                                            </span>
                                        ))
                                    }
                                </div>
                            </div> */}
                        </div>

                        <span></span>

                        <div className={styles.rhs}>
                            <div className={styles.imageUploadContainer}>
                                <div className={styles.image}>
                                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e)} />
                                    {(mainImageUrl || eventInfo?.mainImageUrl) && <Image src={mainImageUrl ?? eventInfo?.mainImageUrl as string} alt="Event flyer" fill />}
                                    <PhotoIcon />
                                </div>
                                <button type="button">
                                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e)} />
                                    <span>{mainImageUrl ? "Change image" : "Choose image"}</span>
                                </button>
                            </div>
                            {imageValidationMessage && <span className={styles.errorMsg}>{imageValidationMessage.message}</span>}

                            <div className={styles.ticketsSection}>
                                <div className={styles.topArea}>
                                    <h4>Tickets</h4>
                                    <button type='button' onClick={() => setIsTicketCreationModalVisible(true)}>Add new</button>
                                </div>
                                <div className={styles.ticketCards}>
                                    {
                                        eventInfo?.tickets.map((ticket, index) => (
                                            <div className={styles.ticketCardBody} key={index}>
                                                <div className={styles.baseInfo}>
                                                    <h5>{ticket.name}</h5>
                                                    <span>{<>&#8358;{`${ticket.price}`}</>}</span>
                                                    {/* <span>{index % 2 == 0 ? "Free" : <>&#8358;{`${ticket.price}`}</>}</span> */}
                                                </div>
                                                <div className={styles.metrics}>
                                                    <div className={styles.metrics__single}>
                                                        <p>Available tickets: </p>
                                                        <span>{ticket.remainingTickets}</span>
                                                    </div>
                                                    <div className={styles.metrics__single}>
                                                        <p>Tickets can admit: </p>
                                                        <span>{ticket.numberOfUsers} {ticket.numberOfUsers > 1 ? "persons" : "person"}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.actions}>
                                                    <button type="button" onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setIsTicketUpdateModalVisible(true);
                                                    }}>Edit</button>
                                                    <button type="button" onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setIsDeleteTicketConfirmationModalVisible(true);
                                                    }}>Delete</button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }

            {
                !eventInfo && loader &&
                <div className={styles.loaderArea}>
                    <br />
                    <ComponentLoader customLoaderColor="#fff" />
                </div>
            }

            {/* <EventsGroup title='Similar Events' subText='Dear superstar, below is a list of all events available at the moment.' eventsData={events} /> */}
        </div>
    );
}

export default EventDetails;