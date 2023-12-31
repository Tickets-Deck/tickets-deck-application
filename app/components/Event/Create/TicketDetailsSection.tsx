import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useRef, ChangeEvent } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from "@/app/models/IEvents"; 
import { CalenderIcon } from "../../SVGs/SVGicons";
import { DatePicker } from "@fluentui/react";
import { TicketResponse } from "@/app/models/ITicket";


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

        if (eventRequest?.tickets) {
            setEventRequest({
                ...eventRequest as EventRequest,
                tickets: [{
                    ...eventRequest?.tickets[0] as TicketResponse,
                    [name]: name == "price" || name == "quantity" ? Number(value) : value
                }]
            });
        } else {
            // If tickets is undefined...
            // setEventRequest({ ...eventRequest as EventRequest, tickets[name]: value  }); 
            setEventRequest(prevState => {
                const ticketsArray = eventRequest?.tickets || []; // Initialize as empty array if undefined

                return {
                    ...eventRequest as EventRequest,
                    tickets: [
                        {
                            ...(ticketsArray[0] as TicketResponse),
                            [name]: name == "price" || name == "quantity" ? Number(value) : value,
                        },
                        // If you have more elements in the array, you can spread them here
                    ],
                };
            });
        }
    }

    return (
        <div className={styles.ticketDetailsSection}>
            <h3>Ticket details</h3>
            <div className={styles.formContainer}>
                <div className={styles.lhs}>
                    <div className={styles.formField}>
                        <label htmlFor="role">Ticket role (General by default)</label>
                        <input
                            type="text"
                            name="role"
                            value={eventRequest?.tickets[0]?.role}
                            placeholder="Ticket role (VIP, Regular, Team, Geneal, etc. )"
                            onChange={(e) => onFormValueChange(e)}
                        />
                        {/* {titleErrorMsg && <span className={styles.errorMsg}>Please enter event title</span>} */}
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="price">Price per ticket</label>
                        <input
                            type="text"
                            name="price"
                            value={eventRequest?.tickets[0]?.price}
                            placeholder="Price per ticket"
                            onChange={(e) => {
                                if (Number(e.target.value) == 0) {
                                    setEventRequest(prevState => {
                                        const ticketsArray = eventRequest?.tickets || []; // Initialize as empty array if undefined

                                        return {
                                            ...eventRequest as EventRequest,
                                            tickets: [
                                                {
                                                    ...(ticketsArray[0] as TicketResponse),
                                                    price: 0,
                                                },
                                                // If you have more elements in the array, you can spread them here
                                            ],
                                        };
                                    });
                                    return;
                                }
                                if (!Number(e.target.value)) {
                                    return;
                                }

                                onFormValueChange(e);

                                // setEventRequest(prevState => {
                                //     const ticketsArray = eventRequest?.tickets || []; // Initialize as empty array if undefined

                                //     return {
                                //         ...eventRequest as EventRequest,
                                //         tickets: [
                                //             {
                                //                 ...(ticketsArray[0] as Tickets),
                                //                 price: Number(e.target.value),
                                //             },
                                //             // If you have more elements in the array, you can spread them here
                                //         ],
                                //     };
                                // });

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
                                    maxDate={eventRequest?.date as Date ?? undefined}
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
                                    maxDate={eventRequest?.date as Date ?? undefined}
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
                            value={eventRequest?.tickets[0]?.quantity}
                            placeholder="Number of available tickets"
                            onChange={(e) => {
                                if (Number(e.target.value) == 0) {
                                    setEventRequest(prevState => {
                                        const ticketsArray = eventRequest?.tickets || []; // Initialize as empty array if undefined

                                        return {
                                            ...eventRequest as EventRequest,
                                            tickets: [
                                                {
                                                    ...(ticketsArray[0] as TicketResponse),
                                                    quantity: 0,
                                                },
                                                // If you have more elements in the array, you can spread them here
                                            ],
                                        };
                                    });
                                    return;
                                }
                                if (!Number(e.target.value)) {
                                    return;
                                }

                                onFormValueChange(e);
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