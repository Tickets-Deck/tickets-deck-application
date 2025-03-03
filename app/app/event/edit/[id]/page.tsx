"use client";
import {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
    useContext,
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useRef,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icons } from "@/app/components/ui/icons";
import { RetrievedTicketResponse, TicketResponse } from "@/app/models/ITicket";
import { EventRequest, EventResponse, UpdateEventRequest } from "@/app/models/IEvents";
import {
    useDeleteTicket,
    useFetchEventById,
    useUpdateEventById,
} from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { DatePicker, IComboBox, TimePicker } from "@fluentui/react";
import useOuterClick from "@/app/hooks/useOuterClick";
import { categories } from "@/app/constants/eventCategories";
import { EventVisibility } from "@/app/enums/IEventVisibility";
import { FormFieldResponse } from "@/app/models/IFormField";
import TicketUpdateModal from "@/app/components/Event/Edit/TicketsUpdate/TicketUpdateModal";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import TicketCreationModal from "@/app/components/Event/Create/TicketsCreation/TicketCreationModal";
import DeletionConfirmationModal from "@/app/components/Modal/DeletionConfirmation";
import { toast } from "sonner";
import EventDescriptionEditor from "@/app/components/Editor/EventDescription";
import { formattedDateForApi } from "@/utils/dateformatter";
import { timePickerStyles } from "@/app/styles/timePicker";
import moment from "moment";
import { ToastContext } from "@/app/context/ToastCardContext";
import { useSession } from "next-auth/react";

interface EventDetailsProps {
    params: { id: string };
}

const EventDetails: FunctionComponent<EventDetailsProps> = ({
    params,
}): ReactElement => {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const toasthandler = useContext(ToastContext);
    const fetchEventInfo = useFetchEventById();
    const deleteTicketById = useDeleteTicket();
    const updateEventById = useUpdateEventById();

    const id = params.id;

    const [eventRequest, setEventRequest] = useState<EventRequest>();
    const [eventInfo, setEventInfo] = useState<EventResponse>();
    const [eventTicketTypes, setEventTicketTypes] =
        useState<RetrievedTicketResponse[]>();

    const [mainImageFile, setMainImageFile] = useState<File>();
    const [mainImageBase64Url, setMainImageBase64Url] = useState<string>();
    const [mainImageUrl, setMainImageUrl] = useState<string>();
    const [imageValidationMessage, setImageValidationMessage] =
        useState<FormFieldResponse>();

    const [categoryDropdownIsVisible, setCategoryDropdownIsVisible] =
        useState(false);
    const [tag, setTag] = useState<string>();

    const [titleErrorMsg, setTitleErrorMsg] = useState<boolean>();
    const [venueErrorMsg, setVenueErrorMsg] = useState<boolean>();
    const [dateErrorMsg, setDateErrorMsg] = useState<boolean>();
    const [timeErrorMsg, setTimeErrorMsg] = useState<boolean>();
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState<boolean>();
    const [tagErrorMsg, setTagErrorMsg] = useState<boolean>();

    const [loader, setLoader] = useState(false);
    const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);

    const [isTicketCreationModalVisible, setIsTicketCreationModalVisible] =
        useState(false);
    const [isTicketUpdateModalVisible, setIsTicketUpdateModalVisible] =
        useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketResponse>();
    const [
        isDeleteTicketConfirmationModalVisible,
        setIsDeleteTicketConfirmationModalVisible,
    ] = useState(false);
    const [isDeletingTicket, setIsDeletingTicket] = useState(false);

    const basicDateAnchor = new Date("January 1, 2024 12:00:00");

    function onFormValueChange(
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        setState?: Dispatch<SetStateAction<boolean | undefined>>
    ) {
        // Destructure name and value from the event target
        const { name, value } = e.target;

        // Set the state
        setEventRequest({ ...(eventRequest as EventRequest), [name]: value });

        // If setState is not undefined...
        if (setState) {
            // Set the state
            setState(false);
        }
    }

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

                        // Update the request
                        setEventRequest({
                            ...(eventRequest as EventRequest),
                            mainImageBase64Url: base64String,
                        });
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
            });
    }

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
                    "Error fetching event",
                    "We encountered an error while fetchng event information. Please try again."
                );

                catchError(error);
            })
            .finally(() => {
                // Unset running flag
                setLoader(false);
            });
    }

    async function handleUpdateEventById() {
        console.log({ eventRequest });

        // Set running flag
        setIsUpdatingEvent(true);

        await updateEventById(user?.token as string, eventInfo?.id as string, {
            ...({ ...eventRequest as EventRequest, isArchived: eventInfo?.isArchived } as UpdateEventRequest),
            eventId: eventInfo?.eventId as string,
            publisherId: eventInfo?.publisherId as string,
        })
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
                    "Error updating event",
                    "We encountered an error while updating event information. Please try again."
                );

                catchError(error);
            });
    }

    const eventDateRef = useRef(null);
    const categoryDropdownRef = useRef(null);
    const purchaseStartDateRef = useRef(null);
    const purchaseEndDateRef = useRef(null);

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
        if (eventInfo && eventInfo.tickets !== null) {
            const updatedTicketTypes = eventInfo.tickets.map((ticket) => ({
                ...ticket,
                isSelected: false,
                selectedTickets: 0,
            }));
            setEventTicketTypes(updatedTicketTypes);
        }
    }, [eventInfo]);

    useOuterClick(categoryDropdownRef, () => setCategoryDropdownIsVisible(false));

    const imageInputClass = () =>
        "absolute size-full top-0 left-0 opacity-0 cursor-pointer";

    const formFieldClass = () =>
        "flex flex-col gap-1 relative [&_label]:text-sm [&_label]:text-white [&_textarea]:resize-none [&_textarea]:h-[5rem]";

    const formFieldInputClass = () =>
        "input !rounded-lg !w-full !bg-white/10 !text-xs !text-white placeholder:text-white/50";

    const formFieldSelectClass = () =>
        `${formFieldInputClass()} max-[768px]:!appearance-none  max-[768px]:p-4 [&_option]:p-2 [&_option]:text-dark-grey`;

    const inputFieldContainerClass = () =>
        "input !rounded-lg !w-full !bg-white/10 !text-xs !py-[0.15rem] !pl-[1.1rem] flex items-center [&_svg]:size-[18px] [&_svg_path]:fill-white";

    const inputFieldContainerClassInput = () =>
        "w-full bg-transparent border-none outline-none text-white text-xs py-2 placeholder:text-white/50";

    const inputFieldContainerClassAddTag = () =>
        "w-[40px] h-[100px] grid place-items-center hover:bg-white/10 cursor-pointer rounded-[4px]";

    const categoryDropdownContainerClass = () =>
        "absolute top-[64px] left-0 w-full bg-dark-grey !rounded-[0.65rem] overflow-x-hidden overflow-y-auto z-10";

    const categoryDropdownContainerClassSpan = () =>
        "text-white text-xs py-[0.6rem] px-4 block cursor-pointer hover:bg-white/10";

    const formFieldInfoClass = () => "text-xs text-grey-3";

    return (
        <div className={"text-white bg-dark-grey-2"}>
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

            <section className='sticky top-0 flex flex-col gap-3 pb-0 bg-dark-grey-2 z-[4]'>
                <div className='p-6 w-full z-[2] relative flex justify-between gap-3'>
                    <h2 className='font-medium min-[550px]:text-[35px] leading-none text-[30px]'>
                        Edit Event Information
                    </h2>
                    {eventInfo && (
                        <button
                            className='primaryButton [&_:hover_svg_path]:!fill-primary-color'
                            type='button'
                            disabled={isUpdatingEvent}
                            onClick={() => handleUpdateEventById()}
                        >
                            {!isUpdatingEvent && <Icons.Check />}
                            {isUpdatingEvent ? "Updating event" : "Save"}
                        </button>
                    )}
                </div>
            </section>

            {eventInfo && (
                <div className='p-6'>
                    <form className='p-4 md:border md:border-primary-color-sub/35 rounded-lg flex gap-6 border-none flex-col md:flex-row px-0 md:px-4'>
                        <div className='w-full flex flex-col gap-[1.2rem]'>
                            <div className={`${formFieldClass()}`}>
                                <label htmlFor='title'>Title</label>
                                <input
                                    type='text'
                                    name='title'
                                    className={`${formFieldInputClass()}`}
                                    value={eventRequest?.title ?? eventInfo?.title}
                                    placeholder='Event Title'
                                    onChange={(e) => onFormValueChange(e, setTitleErrorMsg)}
                                />
                                {titleErrorMsg && (
                                    <span className='text-xs text-failed-color'>
                                        Please enter event title
                                    </span>
                                )}
                            </div>
                            <div className={`${formFieldClass()}`}>
                                <label htmlFor='venue'>Location</label>
                                <input
                                    type='text'
                                    name='venue'
                                    className={`${formFieldInputClass()}`}
                                    value={eventRequest?.venue ?? eventInfo?.venue}
                                    id='venue'
                                    placeholder='Event Venue'
                                    onChange={(e) => onFormValueChange(e, setVenueErrorMsg)}
                                />
                                {venueErrorMsg && (
                                    <span className='text-xs text-failed-color'>
                                        Please enter event location
                                    </span>
                                )}
                            </div>
                            <div className='flex flex-col md:flex-row gap-6'>
                                <div className={`${formFieldClass()} !w-full`}>
                                    <label htmlFor='date'>Date</label>
                                    <div
                                        className={inputFieldContainerClass()}
                                        ref={eventDateRef}
                                    >
                                        <Icons.Calender />
                                        <DatePicker
                                            style={{
                                                backgroundColor: "#ed100",
                                            }}
                                            textField={{
                                                style: {
                                                    background: "#ed100",
                                                },
                                                borderless: true,
                                            }}
                                            calloutProps={{
                                                gapSpace: 8,
                                                target: eventDateRef,
                                            }}
                                            placeholder='Event date'
                                            ariaLabel='Select a date'
                                            minDate={new Date()}
                                            value={
                                                eventRequest?.startDate ??
                                                new Date(eventInfo?.startDate as string)
                                            }
                                            onSelectDate={(date) => {
                                                // Set the form value
                                                setEventRequest({
                                                    ...(eventRequest as EventRequest),
                                                    startDate: formattedDateForApi(date as Date),
                                                });
                                                // Close error message
                                                setDateErrorMsg(false);
                                            }}
                                            onKeyDown={(e) => {
                                                // console.log('Key down...');

                                                // If backward tab was pressed...
                                                if (e.shiftKey && e.key === "Tab") {
                                                    // console.log("Backward tab pressed...");
                                                }

                                                // If forward was tab was pressed...
                                                if (e.key === "Tab") {
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
                                    {dateErrorMsg && (
                                        <span className='text-xs text-failed-color'>
                                            Please enter event date
                                        </span>
                                    )}
                                </div>
                                {/* <div className={`${formFieldClass()}`}>
                  <label htmlFor='time'>
                    Time (Selected: {eventRequest?.time ?? eventInfo?.time})
                  </label>
                  <TimePicker
                    placeholder='Start Time'
                    useHour12
                    allowFreeform
                    autoComplete='on'
                    // value={new Date('02:30 PM')}
                    // value={new Date(eventRequest?.time as string) ?? new Date(eventInfo?.time as string)}
                    value={
                      eventRequest ? new Date(eventRequest.time) : undefined
                    }
                    onChange={(
                      e: React.FormEvent<IComboBox>,
                      time: Date | null | undefined
                    ) => {
                      if (time) {
                        // const convertedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace('PM', 'pm').replace('AM', 'am').replace(' ', '');
                        const convertedTime = moment(time).format("hh:mma");
                        setEventRequest({
                          ...(eventRequest as EventRequest),
                          time: convertedTime,
                        });
                        setTimeErrorMsg(false);
                      }
                    }}
                    dateAnchor={basicDateAnchor}
                    styles={timePickerStyles}
                    // errorMessage='Please enter a valid time'
                  />
                  {timeErrorMsg && (
                    <span className='text-xs text-failed-color'>
                      Please enter event time
                    </span>
                  )}
                </div> */}
                            </div>

                            <div className={`${formFieldClass()}`}>
                                <label htmlFor='description'>Description</label>
                                <EventDescriptionEditor
                                    description={
                                        eventRequest?.description ?? eventInfo?.description
                                    }
                                    setEventRequest={setEventRequest}
                                />
                                {/* <textarea
                                    // dangerouslySetInnerHTML={{ __html: eventRequest?.description ?? eventInfo.description }}
                                    name="description"
                                    value={eventRequest?.description ?? eventInfo?.description}
                                    placeholder="Event Description"
                                    onChange={(e) => onFormValueChange(e, setDescriptionErrorMsg)}
                                /> */}
                                {descriptionErrorMsg && (
                                    <span className='text-xs text-failed-color'>
                                        Please enter event description
                                    </span>
                                )}
                            </div>
                            <div className='flex flex-col gap-6 md:flex-row'>
                                <div className={`${formFieldClass()} !w-full`}>
                                    <label htmlFor='category'>Category</label>
                                    <input
                                        className={formFieldInputClass()}
                                        type='text'
                                        name='category'
                                        placeholder='Select category'
                                        value={eventRequest?.categoryId ?? eventInfo?.category}
                                        onFocus={() => setCategoryDropdownIsVisible(true)}
                                        onClick={() => setCategoryDropdownIsVisible(true)}
                                        onChange={(e) => onFormValueChange(e)}
                                    />
                                    {categoryDropdownIsVisible && (
                                        <div
                                            className={categoryDropdownContainerClass()}
                                            style={{ width: "100%" }}
                                            ref={categoryDropdownRef}
                                        >
                                            {categories.map((category, index) => (
                                                <span
                                                    className={categoryDropdownContainerClassSpan()}
                                                    key={index}
                                                    onClick={() => {
                                                        // Set the form value
                                                        setEventRequest({
                                                            ...(eventRequest as EventRequest),
                                                            categoryId: category,
                                                        });
                                                        // Hide the dropdown
                                                        setCategoryDropdownIsVisible(false);
                                                    }}
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    )}
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
                                            <Icons.Add />
                                        </span>
                                    </div>
                                    {tagErrorMsg && <span className={styles.errorMsg}>Please add at least one tag</span>}
                                </div> */}
                            </div>
                            <div className={`${formFieldClass()}`}>
                                <label htmlFor='time'>Visibility</label>
                                <select
                                    name='visibility'
                                    onChange={(e) => onFormValueChange(e)}
                                    value={eventRequest?.visibility ?? eventInfo?.visibility}
                                >
                                    <option value={EventVisibility.PUBLIC}>
                                        Public - Visible to everyone
                                    </option>
                                    <option value={EventVisibility.PRIVATE}>
                                        Private - Visible to only people that have the link
                                    </option>
                                </select>
                            </div>
                            <div className='flex flex-col gap-6 md:flex-row'>
                                <div className={`${formFieldClass()}`}>
                                    <label htmlFor='date'>Purchase start date</label>
                                    <div
                                        className={inputFieldContainerClass()}
                                        ref={purchaseStartDateRef}
                                    >
                                        <Icons.Calender />
                                        <DatePicker
                                            style={{
                                                backgroundColor: "#ed100",
                                            }}
                                            textField={{
                                                style: {
                                                    background: "#ed100",
                                                },
                                                borderless: true,
                                            }}
                                            calloutProps={{
                                                gapSpace: 8,
                                                target: purchaseStartDateRef,
                                            }}
                                            placeholder='Purchase start date'
                                            ariaLabel='Select a date'
                                            minDate={new Date()}
                                            maxDate={(eventRequest?.startDate as Date) ?? undefined}
                                            value={
                                                eventRequest?.purchaseStartDate ??
                                                new Date(eventInfo.purchaseStartDate as string)
                                            }
                                            onSelectDate={(date) => {
                                                // Set the form value
                                                setEventRequest({
                                                    ...(eventRequest as EventRequest),
                                                    purchaseStartDate: formattedDateForApi(date as Date),
                                                });
                                            }}
                                            onKeyDown={(e) => {
                                                // console.log('Key down...');

                                                // If backward tab was pressed...
                                                if (e.shiftKey && e.key === "Tab") {
                                                    // console.log("Backward tab pressed...");
                                                }

                                                // If forward was tab was pressed...
                                                if (e.key === "Tab") {
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
                                </div>
                                <div className={`${formFieldClass()}`}>
                                    <label htmlFor='date'>Purchase date deadline</label>
                                    <div
                                        className={inputFieldContainerClass()}
                                        ref={purchaseEndDateRef}
                                    >
                                        <Icons.Calender />
                                        <DatePicker
                                            style={{
                                                backgroundColor: "#ed100",
                                            }}
                                            textField={{
                                                style: {
                                                    background: "#ed100",
                                                },
                                                borderless: true,
                                            }}
                                            calloutProps={{
                                                gapSpace: 8,
                                                target: purchaseEndDateRef,
                                            }}
                                            placeholder='Purchase end date'
                                            ariaLabel='Select a date'
                                            minDate={
                                                (eventRequest?.purchaseStartDate as Date) ?? new Date()
                                            }
                                            maxDate={(eventRequest?.startDate as Date) ?? undefined}
                                            value={
                                                eventRequest?.purchaseEndDate ??
                                                new Date(eventInfo.purchaseEndDate as string)
                                            }
                                            onSelectDate={(date) => {
                                                // Set the form value
                                                setEventRequest({
                                                    ...(eventRequest as EventRequest),
                                                    purchaseEndDate: formattedDateForApi(date as Date),
                                                });
                                                // Close error message
                                                // setDateErrorMsg(false);
                                            }}
                                            onKeyDown={(e) => {
                                                // console.log('Key down...');

                                                // If backward tab was pressed...
                                                if (e.shiftKey && e.key === "Tab") {
                                                    // console.log("Backward tab pressed...");
                                                }

                                                // If forward was tab was pressed...
                                                if (e.key === "Tab") {
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
                                </div>
                            </div>

                            {/* <div className={styles.tagsSection}>
                                <h4>Tags</h4>

                                <div className={styles.tags}>
                                    {
                                        eventRequest?.tags ? eventRequest.tags.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                {tag}
                                                <span onClick={() => removeTagFromFormRequest(tag)}><Icons.Close /></span>
                                            </span>
                                        )) : eventInfo?.tags.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                {tag}
                                                <span onClick={() => removeTagFromFormRequest(tag)}><Icons.Close /></span>
                                            </span>
                                        ))
                                    }
                                </div>
                            </div> */}
                        </div>

                        <span></span>

                        <div className='w-full flex flex-col gap-[2rem]'>
                            <div className={"flex flex-col md:flex-row gap-4 items-center"}>
                                <div
                                    className={
                                        "w-full min-[550px]:w-[250px] md:w-full h-[250px] rounded-lg bg-white/10 overflow-hidden relative grid place-items-center cursor-pointer [&_svg]:size-[40px] [&_svg_path]:fill-white"
                                    }
                                >
                                    <input
                                        type='file'
                                        className={imageInputClass()}
                                        accept='image/png, image/jpeg'
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                    {(mainImageUrl || eventInfo?.mainImageUrl) && (
                                        <Image
                                            className='size-full object-cover'
                                            src={mainImageUrl ?? (eventInfo?.mainImageUrl as string)}
                                            alt='Event flyer'
                                            fill
                                        />
                                    )}
                                    <Icons.Photo />
                                </div>
                                <button type='button' className='tertiaryButton !mr-auto'>
                                    <input
                                        className={imageInputClass()}
                                        type='file'
                                        accept='image/png, image/jpeg'
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                    <span>{mainImageUrl ? "Change image" : "Choose image"}</span>
                                </button>
                            </div>
                            {imageValidationMessage && (
                                <span className='text-xs text-failed-color'>
                                    {imageValidationMessage.message}
                                </span>
                            )}

                            <div className='flex flex-col'>
                                <div className={"flex items-center justify-between mb-4"}>
                                    <h4 className='text-[20px] font-medium mb-0'>Tickets</h4>
                                    <button
                                        className='tertiaryButton !py-1 !px-[0.625rem]'
                                        type='button'
                                        onClick={() => setIsTicketCreationModalVisible(true)}
                                    >
                                        Add new
                                    </button>
                                </div>
                                <div className='gap-4 flex-wrap grid grid-cols-1 min-[550px]:[grid-template-columns:_repeat(2,_minmax(100px,_1fr))]'>
                                    {eventInfo?.tickets.map((ticket, index) => (
                                        <div
                                            className='p-4 rounded-[10px] bg-container-grey flex flex-col gap-5 w-full relative overflow-hidden after:absolute after:size-full after:top-0 after:left-0 after:bg-black/35 after:z-[1] after:opacity-0 after:transition-all hover:after:opacity-100 group'
                                            key={index}
                                        >
                                            <div className='flex flex-col gap-1'>
                                                <h5 className='font-medium'>{ticket.name}</h5>
                                                <span className='text-sm bg-white text-black py-1 px-2 rounded-lg w-fit'>
                                                    {<>&#8358;{`${ticket.price}`}</>}
                                                </span>
                                                {/* <span>{index % 2 == 0 ? "Free" : <>&#8358;{`${ticket.price}`}</>}</span> */}
                                            </div>
                                            <div className={"flex gap-4 flex-col"}>
                                                <div className=''>
                                                    <p className='text-xs'>Available tickets: </p>
                                                    <span className='text-sm'>
                                                        {ticket.remainingTickets}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className='text-xs'>Tickets can admit: </p>
                                                    <span className='text-sm'>
                                                        {ticket.numberOfUsers}{" "}
                                                        {ticket.numberOfUsers > 1 ? "persons" : "person"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "absolute w-full left-0 flex h-[44px] min-[400px]:h-8 transition-all z-[2] -bottom-full group-hover:bottom-0"
                                                }
                                            >
                                                <button
                                                    className='primaryButton !p-0 !size-full !grid !place-items-center !rounded-none'
                                                    type='button'
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setIsTicketUpdateModalVisible(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='primaryButton !p-0 !size-full !grid !place-items-center !rounded-none !bg-failed-color hover:!text-white hover:!bg-[darken(#dc143c,_5%)]'
                                                    type='button'
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setIsDeleteTicketConfirmationModalVisible(true);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className='mb-1 text-sm'>Who pays for fee?</span>
                                <div className='flex flex-row items-center justify-start gap-2 w-fit'>
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setEventRequest({
                                                ...(eventRequest as EventRequest),
                                                organizerPaysFee: true,
                                            });
                                            setEventInfo({
                                                ...(eventInfo as EventResponse),
                                                organizerPaysFee: true,
                                            });
                                        }}
                                        className={`!p-2 !px-4 rounded-full cursor-pointer ${eventInfo?.organizerPaysFee
                                            ? "bg-white text-dark-grey"
                                            : "!bg-white/10 !text-white"
                                            }`}
                                    >
                                        Organizer
                                    </span>
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setEventRequest({
                                                ...(eventRequest as EventRequest),
                                                organizerPaysFee: false,
                                            });
                                            setEventInfo({
                                                ...(eventInfo as EventResponse),
                                                organizerPaysFee: false,
                                            });
                                        }}
                                        className={`!p-2 !px-4 rounded-full cursor-pointer ${eventInfo?.organizerPaysFee
                                            ? "!bg-white/10 !text-white"
                                            : "bg-white text-dark-grey"
                                            }`}
                                    >
                                        Customer
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {!eventInfo && loader && (
                <div className='w-full md:h-[15vh] relative mt-4 grid place-items-center h-[100vh]'>
                    <br />
                    <ComponentLoader customLoaderColor='#fff' />
                </div>
            )}

            {/* <EventsGroup title='Similar Events' subText='Dear superstar, below is a list of all events available at the moment.' eventsData={events} /> */}
        </div>
    );
};

export default EventDetails;
