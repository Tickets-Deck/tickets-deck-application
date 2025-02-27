import { FunctionComponent, ReactElement, Dispatch, SetStateAction, ChangeEvent, useState, useRef, useEffect } from 'react';
import { EventRequest } from '@/app/models/IEvents';
import { Icons } from '../../ui/icons';
import useOuterClick from '@/app/hooks/useOuterClick';
import { EventVisibility } from '@/app/enums/IEventVisibility';
import { ValidationStatus } from '@/app/enums/BasicInfoFormValidationStatus';
import { EventCreationStage } from '@/app/enums/EventCreationStage';
import EventDescriptionEditor from '../../Editor/EventDescription';
import { formattedDateForApi } from '@/utils/dateformatter';
import moment from 'moment';
import BasicDateTimePicker from '../../custom/DateTimePicker';
import { useApplicationContext } from '@/app/context/ApplicationContext';


interface BasicInformationFormProps {
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
    validationStage: { status: ValidationStatus } | undefined
    setValidationStage: React.Dispatch<React.SetStateAction<{ status: ValidationStatus; } | undefined>>
    setEventCreationStage: Dispatch<SetStateAction<EventCreationStage>>
}

const BasicInformationForm: FunctionComponent<BasicInformationFormProps> = (
    { eventRequest, setEventRequest, validationStage, setEventCreationStage, setValidationStage }): ReactElement => {

    const { eventCategories } = useApplicationContext();

    //#region States

    const [categoryDropdownIsVisible, setCategoryDropdownIsVisible] = useState(false);
    const [tag, setTag] = useState<string>();

    const [titleErrorMsg, setTitleErrorMsg] = useState<boolean>();
    const [venueErrorMsg, setVenueErrorMsg] = useState<boolean>();
    const [startDateErrorMsg, setStartDateErrorMsg] = useState<boolean>();
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState<boolean>();
    const [tagErrorMsg, setTagErrorMsg] = useState<boolean>();

    //#endregion

    //#region Functions

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

    function validateForm() {
        if (eventRequest?.title && eventRequest.venue && eventRequest.startDate && eventRequest.description && (eventRequest.tags && eventRequest.tags.length > 0)) {
            // Close all error messages
            setTitleErrorMsg(false);
            setVenueErrorMsg(false);
            setStartDateErrorMsg(false);
            setDescriptionErrorMsg(false);
            setTagErrorMsg(false);
            return true;
        } else {
            if (!eventRequest?.title) {
                setTitleErrorMsg(true);
            } else {
                setTitleErrorMsg(false);
            }
            if (!eventRequest?.venue) {
                setVenueErrorMsg(true);
            } else {
                setVenueErrorMsg(false);
            }
            if (!eventRequest?.startDate) {
                setStartDateErrorMsg(true);
            } else {
                setStartDateErrorMsg(false);
            }
            if (!eventRequest?.description) {
                setDescriptionErrorMsg(true);
            } else {
                setDescriptionErrorMsg(false);
            }
            if (!eventRequest?.tags || eventRequest?.tags?.length < 1) {
                setTagErrorMsg(true);
            } else {
                setTagErrorMsg(false);
            }
            return false;
        }
    };

    function addTagToFormRequest() {
        // If tag is empty...
        if (!tag || tag.trim() === '') {
            return;
        };

        // If tag already exists...
        if (eventRequest?.tags?.includes(tag)) {
            return;
        };

        // If we have existing tags...
        if (eventRequest?.tags?.length) {
            // Add the tag to the form request
            setEventRequest({ ...eventRequest as EventRequest, tags: [...eventRequest?.tags as string[], tag] });
            // Clear error 
            setTagErrorMsg(false);
            // Clear the tag input
            setTag('');
            return;
        } else {
            // Add the tag to the form request
            setEventRequest({ ...eventRequest as EventRequest, tags: [tag] });
            // Clear error 
            setTagErrorMsg(false);
            // Clear the tag input
            setTag('');
            return;
        }
    };

    //#endregion

    //#region Effects & other hooks

    const categoryDropdownRef = useRef(null);

    useOuterClick(categoryDropdownRef, () => setCategoryDropdownIsVisible(false));

    useEffect(() => {
        if (validationStage?.status === ValidationStatus.Running) {
            // Validate the form
            if (!validateForm()) {
                return;
            }
            // Update validation stage
            setValidationStage({ status: ValidationStatus.Success });
            // Proceed to image upload 
            setEventCreationStage(EventCreationStage.ImageUpload);
        }
    }, [validationStage]);

    //#endregion

    return (
        <div className="flex flex-col md:flex-row gap-8 size-full mb-8">
            <div className="w-full max-w-[50%] flex flex-col gap-5">
                <div className="createEventFormField">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={eventRequest?.title}
                        placeholder="Event Title"
                        onChange={(e) => onFormValueChange(e, setTitleErrorMsg)}
                    />
                    {titleErrorMsg && <span className="errorMsg">Please enter event title</span>}
                </div>
                <div className="createEventFormField">
                    <label htmlFor="venue">Location</label>
                    <input
                        type="text"
                        name="venue"
                        value={eventRequest?.venue}
                        id="venue"
                        placeholder="Event Venue"
                        onChange={(e) => onFormValueChange(e, setVenueErrorMsg)}
                    />
                    {venueErrorMsg && <span className="errorMsg">Please enter event location</span>}
                </div>
                {/* <div className="createEventFormField">
                        <label htmlFor="date">Start date</label>
                        <div className="rounded-lg w-full px-4 py-1 bg-white/10 text-sm flex items-center [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg_path]:fill-white" ref={eventDateRef}>
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
                                value={eventRequest?.date}
                                onSelectDate={(date) => {
                                    // Set the form value
                                    setEventRequest({ ...eventRequest as EventRequest, date: formattedDateForApi(date as Date) });
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
                        {dateErrorMsg && <span className="errorMsg">Please enter event date</span>}
                    </div> */}
                <div className="createEventFormField">
                    <label htmlFor="date">Start date</label>
                    <div className=''>
                        <BasicDateTimePicker
                            className='custom-datepicker'
                            defaultValue={eventRequest?.startDate ? moment(eventRequest.startDate) : undefined}
                            onChangeFn={(newValue) => {
                                // Set the form value
                                setEventRequest({ ...eventRequest as EventRequest, startDate: formattedDateForApi(newValue.toDate()) });
                                // Close error message
                                setStartDateErrorMsg(false);
                            }}
                            minDate={moment(new Date())}
                        />
                    </div>
                    {startDateErrorMsg && <span className="errorMsg">Please enter event start date</span>}
                </div>
                <div className="createEventFormField">
                    <label htmlFor="date">End date (Optional)</label>
                    <div className=''>
                        <BasicDateTimePicker
                            className='custom-datepicker'
                            // defaultValue={eventRequest?.startDate ? moment(eventRequest.startDate) : undefined}
                            // onChangeFn={(newValue) => {
                            //     // Set the form value
                            //     setEventRequest({ ...eventRequest as EventRequest, startDate: formattedDateForApi(newValue.toDate()) });
                            //     // Close error message
                            //     setStartDateErrorMsg(false);
                            // }}
                            minDate={moment(eventRequest?.startDate)}
                        />
                    </div>
                </div>
            </div>

            <span className='w-[1px] h-auto bg-white/20 block'></span>

            <div className={"w-full max-w-[50%] flex flex-col gap-5"}>
                {/* <div className="createEventFormField">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={eventRequest?.description}
                        placeholder="Event Description"
                        onChange={(e) => onFormValueChange(e, setDescriptionErrorMsg)}
                    />
                    {descriptionErrorMsg && <span className="errorMsg">Please enter event description</span>}
                </div> */}
                <div className="createEventFormField">
                    <label htmlFor="description">Description</label>
                    <EventDescriptionEditor
                        description={eventRequest?.description ?? ''}
                        setEventRequest={setEventRequest}
                    />
                    {descriptionErrorMsg && <span className="errorMsg">Please enter event description</span>}
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                    <div className="createEventFormField">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Select category"
                            value={eventCategories?.find(category => category.id === eventRequest?.categoryId)?.name}
                            onFocus={() => setCategoryDropdownIsVisible(true)}
                            onClick={() => setCategoryDropdownIsVisible(true)}
                            onChange={(e) => onFormValueChange(e)}
                        />
                        {categoryDropdownIsVisible && eventCategories &&
                            <div
                                className="absolute w-[120%] top-[70px] left-0 bg-dark-grey z-10 rounded-lg overflow-hidden max-h-[180px] overflow-y-auto scrollbar-thin"
                                ref={categoryDropdownRef}>
                                {eventCategories.map((category, index) => (
                                    <span
                                        className='block px-2 py-3 text-sm text-white cursor-pointer hover:bg-white/10'
                                        key={index}
                                        onClick={() => {
                                            // Set the form value
                                            setEventRequest({ ...eventRequest as EventRequest, categoryId: category.id });
                                            // Hide the dropdown
                                            setCategoryDropdownIsVisible(false);
                                        }}>
                                        {category.name}
                                    </span>
                                ))}
                            </div>}
                    </div>
                    <div className="createEventFormField">
                        <label htmlFor="tags">Tags</label>
                        <div className="flex flex-row items-center space-x-1">
                            <input
                                type="text"
                                name="tags"
                                className='input !rounded-lg w-full !bg-white/10 text-sm'
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
                                className="w-[50px] h-full grid place-items-center rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 [&_svg]:w-[20px] [&_svg]:h-[20px] [&_svg_path]:fill-white"
                                onClick={() => addTagToFormRequest()}>
                                <Icons.Add />
                            </span>
                        </div>
                        {tagErrorMsg && <span className="errorMsg">Please add at least one tag</span>}
                    </div>
                </div>
                <div className="createEventFormField">
                    <label htmlFor="time">Visibility</label>
                    <select name="visibility" onChange={(e) => onFormValueChange(e)} value={eventRequest?.visibility}>
                        <option value={EventVisibility.PUBLIC}>Public - Visible to everyone</option>
                        <option value={EventVisibility.PRIVATE}>Private - Visible to only people that have the link</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default BasicInformationForm;