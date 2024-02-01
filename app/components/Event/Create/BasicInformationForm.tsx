import { FunctionComponent, ReactElement, Dispatch, SetStateAction, ChangeEvent, useState, useRef, useEffect } from 'react';
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from '@/app/models/IEvents';
import { AddIcon, CalenderIcon } from '../../SVGs/SVGicons';
import { DatePicker } from '@fluentui/react';
import useOuterClick from '@/app/hooks/useOuterClick';
import { categories } from '@/app/constants/eventCategories';
import { EventVisibility } from '@/app/enums/IEventVisibility';
import { ValidationStatus } from '@/app/enums/BasicInfoFormValidationStatus';
import { EventCreationStage } from '@/app/enums/EventCreationStage';


interface BasicInformationFormProps {
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
    validationStage: { status: ValidationStatus } | undefined
    setValidationStage: React.Dispatch<React.SetStateAction<{ status: ValidationStatus; } | undefined>>
    setEventCreationStage: Dispatch<SetStateAction<EventCreationStage>>
}

const BasicInformationForm: FunctionComponent<BasicInformationFormProps> = (
    { eventRequest, setEventRequest, validationStage, setEventCreationStage, setValidationStage }): ReactElement => {

    const [categoryDropdownIsVisible, setCategoryDropdownIsVisible] = useState(false);
    const [tag, setTag] = useState<string>();

    const [titleErrorMsg, setTitleErrorMsg] = useState<boolean>();
    const [venueErrorMsg, setVenueErrorMsg] = useState<boolean>();
    const [dateErrorMsg, setDateErrorMsg] = useState<boolean>();
    const [timeErrorMsg, setTimeErrorMsg] = useState<boolean>();
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState<boolean>();
    const [tagErrorMsg, setTagErrorMsg] = useState<boolean>();

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
        if (eventRequest?.title && eventRequest.venue && eventRequest.date && eventRequest.time && eventRequest.description && (eventRequest.tags && eventRequest.tags.length > 0)) {
            // Close all error messages
            setTitleErrorMsg(false);
            setVenueErrorMsg(false);
            setDateErrorMsg(false);
            setTimeErrorMsg(false);
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
            if (!eventRequest?.date) {
                setDateErrorMsg(true);
            } else {
                setDateErrorMsg(false);
            }
            if (!eventRequest?.time) {
                setTimeErrorMsg(true);
            } else {
                setTimeErrorMsg(false);
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

    const eventDateRef = useRef(null);
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
    }, [validationStage])

    // useEffect(() => {
    //     console.log(validationStage)
    // }, [validationStage])

    return (
        <div className={styles.formContainer}>
            <div className={styles.lhs}>
                <div className={styles.formField}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={eventRequest?.title}
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
                        value={eventRequest?.venue}
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
                                value={eventRequest?.date}
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
                            value={eventRequest?.time}
                            placeholder="Event Time e.g 8pm"
                            onChange={(e) => onFormValueChange(e, setTimeErrorMsg)}
                        />
                        {timeErrorMsg && <span className={styles.errorMsg}>Please enter event time</span>}
                    </div>
                </div>
            </div>
            <span></span>
            <div className={styles.rhs}>
                <div className={styles.formField}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={eventRequest?.description}
                        placeholder="Event Description"
                        onChange={(e) => onFormValueChange(e, setDescriptionErrorMsg)}
                    />
                    {descriptionErrorMsg && <span className={styles.errorMsg}>Please enter event description</span>}
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formField}>
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Select category"
                            value={eventRequest?.category}
                            onFocus={() => setCategoryDropdownIsVisible(true)}
                            onClick={() => setCategoryDropdownIsVisible(true)}
                            onChange={(e) => onFormValueChange(e)}
                        />
                        {categoryDropdownIsVisible &&
                            <div className={styles.categoryDropdownContainer} ref={categoryDropdownRef}>
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
                    <div className={styles.formField}>
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
                    </div>
                </div>
                <div className={styles.formField}>
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