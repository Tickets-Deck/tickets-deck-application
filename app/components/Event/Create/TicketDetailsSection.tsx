import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useRef, ChangeEvent } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from "@/app/models/IEvents";
import { Tickets } from "@/app/models/ITicket";
import { CalenderIcon } from "../../SVGs/SVGicons";
import { DatePicker } from "@fluentui/react";


interface TicketDetailsSectionProps {
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
}

const TicketDetailsSection: FunctionComponent<TicketDetailsSectionProps> = ({ eventRequest, setEventRequest }): ReactElement => {
    
    const purchaseStartDateRef = useRef(null);
    const purchaseEndDateRef = useRef(null);

    function onFormValueChange(e: ChangeEvent<HTMLInputElement>) {

        // Desctructure the name and value from the event target
        const { name, value } = e.target;

        // If the name is undefined...
        if (!name) return;

        if(eventRequest?.tickets) {
            setEventRequest({ ...eventRequest as EventRequest, tickets: [{ ...eventRequest?.tickets[0] as Tickets, [name]: value }] });
        } else {
            // If tickets is undefined...
            // setEventRequest({ ...eventRequest as EventRequest, tickets[name]: value  }); 
        }
    }

    return (
        <div className={styles.ticketDetailsSection}>
            <div>Ticket details</div>
            <div className={styles.formContainer}>
                <div className={styles.lhs}>
                    <div className={styles.formField}>
                        <label htmlFor="role">Ticket role (General by default)</label>
                        <input
                            type="text"
                            name="role"
                            // value={eventRequest?.tickets[0]?.role}
                            placeholder="Ticket role (VIP, Regular, Team, Geneal, etc. )"
                            onChange={(e) => setEventRequest({ ...eventRequest as EventRequest, tickets: [{ ...eventRequest?.tickets[0] as Tickets, role: e.target.value }] })}
                        />
                        {/* {titleErrorMsg && <span className={styles.errorMsg}>Please enter event title</span>} */}
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="price">Price per ticket</label>
                        <input
                            type="text"
                            name="price"
                            // value={eventRequest?.tickets[0].price}
                            placeholder="Price per ticket"
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value)) return;
                                setEventRequest({ ...eventRequest as EventRequest, tickets: [{ ...eventRequest?.tickets[0] as Tickets, price: value }] })
                            }}
                        />
                        {/* {titleErrorMsg && <span className={styles.errorMsg}>Please enter event title</span>} */}
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="date">Purchase start date</label>
                            <div className={styles.inputFieldContainer} ref={purchaseStartDateRef}>
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
                                        target: purchaseStartDateRef
                                    }}
                                    placeholder="Purchase start date"
                                    ariaLabel="Select a date"
                                    minDate={new Date()}
                                    value={eventRequest?.purchaseStartDate}
                                    onSelectDate={(date) => {
                                        // Set the form value
                                        setEventRequest({ ...eventRequest as EventRequest, purchaseStartDate: date as Date });
                                        // Close error message
                                        // setDateErrorMsg(false);
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
                            {/* {dateErrorMsg && <span className={styles.errorMsg}>Please enter event date</span>} */}
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="date">Purchase date deadline</label>
                            <div className={styles.inputFieldContainer} ref={purchaseEndDateRef}>
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
                                        target: purchaseEndDateRef
                                    }}
                                    placeholder="Start date"
                                    ariaLabel="Select a date"
                                    minDate={eventRequest?.purchaseStartDate as Date ?? new Date()}
                                    value={eventRequest?.purchaseEndDate}
                                    onSelectDate={(date) => {
                                        // Set the form value
                                        setEventRequest({ ...eventRequest as EventRequest, purchaseEndDate: date as Date });
                                        // Close error message
                                        // setDateErrorMsg(false);
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
                            {/* {dateErrorMsg && <span className={styles.errorMsg}>Please enter event date</span>} */}
                        </div>
                    </div>
                </div>
                <span></span>
                <div className={styles.rhs}>
                    <div className={styles.formField}>
                        <label htmlFor="quantity">Number of available tickets</label>
                        <input
                            type="text"
                            name="quantity"
                            // value={eventRequest?.tickets[0].quantity}
                            placeholder="Number of available tickets"
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value)) return;
                                setEventRequest({ ...eventRequest as EventRequest, tickets: [{ ...eventRequest?.tickets[0] as Tickets, quantity: value }] })
                            }}
                        />
                        {/* {titleErrorMsg && <span className={styles.errorMsg}>Please enter event title</span>} */}
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="allowedGuestType">Allowed guest type (All by default)</label>
                        <input
                            type="text"
                            name="allowedGuestType"
                            value={eventRequest?.allowedGuestType}
                            placeholder="Allowed guest type e.g. All, 18+, 21+, etc."
                            onChange={(e) => { setEventRequest({ ...eventRequest as EventRequest, allowedGuestType: e.target.value }) }}
                        />
                        {/* {titleErrorMsg && <span className={styles.errorMsg}>Please enter event title</span>} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketDetailsSection;