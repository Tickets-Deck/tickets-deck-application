import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useRef, ChangeEvent, useState, useEffect } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from "@/app/models/IEvents";
import { CalenderIcon, CloseIcon, DeleteIcon, EditIcon } from "../../SVGs/SVGicons";
import { DatePicker } from "@fluentui/react";
import { TicketRequest, TicketResponse } from "@/app/models/ITicket";
import ModalWrapper from "../../Modal/ModalWrapper";
import ComponentLoader from "../../Loader/ComponentLoader";
import TicketCreationModal from "./TicketsCreation/TicketCreationModal";
import { FormFieldResponse } from "@/app/models/IFormField";
import { formattedDateForApi } from "@/utils/dateformatter";


interface TicketDetailsSectionProps {
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
    ticketValidationMessage: FormFieldResponse | undefined
    setTicketValidationMessage: React.Dispatch<React.SetStateAction<FormFieldResponse | undefined>>
}

const TicketDetailsSection: FunctionComponent<TicketDetailsSectionProps> = (
    { eventRequest, setEventRequest, ticketValidationMessage, setTicketValidationMessage }): ReactElement => {

    const purchaseStartDateRef = useRef(null);
    const purchaseEndDateRef = useRef(null);

    const [isEditingTicket, setIsEditingTicket] = useState(false);

    function deleteTicket(ticket: TicketRequest) {

        // Create a representation of the event request
        const _eventRequest = eventRequest;

        const filteredTickets = _eventRequest?.tickets.filter((anyTicket) => anyTicket.name != ticket.name);

        setEventRequest({ ...eventRequest as EventRequest, tickets: filteredTickets ?? [] as TicketRequest[] });
    }

    function editTicket(ticketIndex: number, ticket: TicketRequest) {
        // Create a representation of the event request
        const _eventRequest = eventRequest;

        // Set the ticket to be edited
        // setEventRequest({ ...eventRequest as EventRequest, ticketToEdit: ticket });
    }

    const [isTicketCreationModalVisible, setIsTicketCreationModalVisible] = useState(false);
    const [selectedTicketIndex, setSelectedTicketIndex] = useState<number | undefined>();

    useEffect(() => {
        if (eventRequest && eventRequest?.tickets.length > 0) {
            setTicketValidationMessage(undefined);
        }
    }, [eventRequest?.tickets]);

    useEffect(() => {
        if (!isTicketCreationModalVisible) {
            setIsEditingTicket(false);
            setSelectedTicketIndex(undefined);
        }
    }, [isTicketCreationModalVisible])

    return (
        <div className={styles.ticketDetailsSection}>

            <TicketCreationModal
                modalVisibility={isTicketCreationModalVisible}
                setModalVisibility={setIsTicketCreationModalVisible}
                eventRequest={eventRequest}
                setEventRequest={setEventRequest}
                isEditingTicket={isEditingTicket}
                selectedTicketIndex={selectedTicketIndex}
            />

            <div className={styles.topSection}>
                <div className={styles.textContents}>
                    <h3>Let's Create Tickets</h3>
                    <p>Click on the "Create ticket" button below to add tickets for your event</p>
                </div>
                <div className={styles.ticketsCreated}>
                    <span>{eventRequest?.tickets.length}</span>
                    <p>tickets created</p>
                </div>
            </div>

            <div className={styles.ticketCards}>
                {
                    eventRequest?.tickets.map((ticket, index) =>
                        <div className={styles.ticketCard} key={index}>
                            <div className={styles.ticketCardHeader}>
                                <h3>{ticket.name}</h3>
                                <span onClick={() => {
                                    setIsEditingTicket(true)
                                    setSelectedTicketIndex(index)
                                    setIsTicketCreationModalVisible(true)
                                }}><EditIcon /></span>
                            </div>
                            <div className={styles.ticketCardBody}>
                                <div className={styles.info}>
                                    <span>Price</span>
                                    <p>&#8358;{ticket.price.toLocaleString()}</p>
                                </div>
                                <div className={styles.info}>
                                    <span>Total available</span>
                                    <p>{ticket.quantity}</p>
                                </div>
                                <div className={styles.info}>
                                    <span>User per Ticket</span>
                                    <p>{ticket.numberOfUsers}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            {
                eventRequest?.tickets.length == 0 &&
                <div className={styles.noTicketCard}>
                    <p>No tickets created yet</p>
                </div>
            }

            {ticketValidationMessage && <span className={styles.errorMsg} style={{ textAlign: 'center' }}>{ticketValidationMessage.message}</span>}

            <button type="button" onClick={() => setIsTicketCreationModalVisible(true)}>Create Ticket</button>
            <br />
            {
                eventRequest?.tickets && eventRequest?.tickets.length > 0 &&
                <div className={styles.formContainer}>
                    <div className={styles.lhs}>
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
                                            setEventRequest({ ...eventRequest as EventRequest, purchaseStartDate: formattedDateForApi(date as Date) });
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
                                        placeholder="Purchase end date"
                                        ariaLabel="Select a date"
                                        minDate={eventRequest?.purchaseStartDate as Date ?? new Date()}
                                        maxDate={eventRequest?.date as Date ?? undefined}
                                        value={eventRequest?.purchaseEndDate}
                                        onSelectDate={(date) => {
                                            // Set the form value
                                            setEventRequest({ ...eventRequest as EventRequest, purchaseEndDate: formattedDateForApi(date as Date) });
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
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default TicketDetailsSection;