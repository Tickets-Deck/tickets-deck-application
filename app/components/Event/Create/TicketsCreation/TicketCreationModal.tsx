import { useCreateTicketForSpecifiedEvent } from "@/app/api/apiClient";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import { Icons } from "@/app/components/ui/icons";
import { catchError } from "@/app/constants/catchError";
import { EventRequest } from "@/app/models/IEvents";
import { DefaultFormResponseStatus, FormFieldResponse } from "@/app/models/IFormField";
import { TicketRequest } from "@/app/models/ITicket";
import styles from '@/app/styles/CreateEvent.module.scss';
import { ReactElement, FunctionComponent, Dispatch, SetStateAction, ChangeEvent, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface TicketCreationModalProps {
    modalVisibility: boolean;
    setModalVisibility: Dispatch<SetStateAction<boolean>>
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
    forExistingEvent?: boolean
    eventId?: string
    handleFetchEventInfo?: () => Promise<void>
    isEditingTicket?: boolean
    selectedTicketIndex?: number
}

const TicketCreationModal: FunctionComponent<TicketCreationModalProps> = (
    { modalVisibility, setModalVisibility, eventRequest, isEditingTicket,
        setEventRequest, forExistingEvent, eventId, handleFetchEventInfo, selectedTicketIndex }): ReactElement => {

    const createTicketForSpecifiedEvent = useCreateTicketForSpecifiedEvent();

    const [ticketFormRequest, setTicketFormRequest] = useState<TicketRequest>();
    const [isCreatingNewTicket, setIsCreatingNewTicket] = useState(false);

    const [ticketNameErrorMsg, setTicketNameErrorMsg] = useState<FormFieldResponse>();
    const [ticketPriceErrorMsg, setTicketPriceErrorMsg] = useState<FormFieldResponse>();
    const [ticketQuantityErrorMsg, setTicketQuantityErrorMsg] = useState<FormFieldResponse>();
    const [ticketNumberOfUsersErrorMsg, setTicketNumberOfUsersErrorMsg] = useState<FormFieldResponse>();
    const [ticketDescriptionErrorMsg, setTicketDescriptionErrorMsg] = useState<FormFieldResponse>();


    function onFormValueChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, setErrorStateFunction?: Dispatch<SetStateAction<FormFieldResponse | undefined>>) {

        // Desctructure the name and value from the event target
        const { name, value } = e.target;

        if (name == "numberOfUsers" || name == "quantity") {
            // Update the state
            setTicketFormRequest({ ...ticketFormRequest as TicketRequest, [name]: Number(value) });

            // If there is an error message, clear it
            if (setErrorStateFunction) {
                setErrorStateFunction(undefined);
            }
            return;
        }

        // Update the state
        setTicketFormRequest({ ...ticketFormRequest as TicketRequest, [name]: value });

        // If there is an error message, clear it
        if (setErrorStateFunction) {
            setErrorStateFunction(undefined);
        }
    };

    /**
     * Function to validate the form
     */
    function validateForm() {

        if (ticketFormRequest && ticketFormRequest.name && ticketFormRequest.price && (ticketFormRequest.price == 0 || ticketFormRequest.price > 1000) && ticketFormRequest.quantity && ticketFormRequest.numberOfUsers) {
            return true;
        } 
        else {
            console.log(ticketFormRequest)

            // Validate the ticket name
            if (!ticketFormRequest?.name) {
                setTicketNameErrorMsg({ message: "Please enter ticket name", status: DefaultFormResponseStatus.Failed });
            } else {
                setTicketNameErrorMsg(undefined);
            }

            // Validate the ticket price
            if (!ticketFormRequest?.price) {
                setTicketPriceErrorMsg({ message: "Please enter ticket price", status: DefaultFormResponseStatus.Failed });
            } else {
                if (Number(ticketFormRequest?.price) > 0 && Number(ticketFormRequest?.price) < 1000) {
                    setTicketPriceErrorMsg({ message: "Ticket price cannot be less than 1000", status: DefaultFormResponseStatus.Failed });
                    return false;
                }
                setTicketPriceErrorMsg(undefined);
            }

            // Validate the ticket quantity
            if (!ticketFormRequest?.quantity) {
                setTicketQuantityErrorMsg({ message: "Please enter ticket quantity", status: DefaultFormResponseStatus.Failed });
            } else {
                if (Number(ticketFormRequest?.quantity < 1)) {
                    console.log("Less than 1")
                    setTicketQuantityErrorMsg({ message: "Ticket quantity cannot be less than 1", status: DefaultFormResponseStatus.Failed });
                    return false;
                }
                setTicketQuantityErrorMsg(undefined);
            }

            // Validate the ticket number of users
            if (!ticketFormRequest?.numberOfUsers) {
                setTicketNumberOfUsersErrorMsg({ message: "Please enter number of users", status: DefaultFormResponseStatus.Failed });
            } else {
                if (Number(ticketFormRequest?.numberOfUsers < 1)) {
                    console.log("Less than 1")
                    setTicketNumberOfUsersErrorMsg({ message: "Number of users cannot be less than 1", status: DefaultFormResponseStatus.Failed });
                    return false;
                }
                setTicketNumberOfUsersErrorMsg(undefined);
            }

            // Validate the ticket description
            // if (!ticketFormRequest?.description) {
            //     setTicketDescriptionErrorMsg({ message: "Please enter ticket description", status: DefaultFormResponseStatus.Failed });
            // } else {
            //     setTicketDescriptionErrorMsg(undefined);
            // }

            return false;
        }
    };

    function addNewTicket() {
        if (!validateForm()) {
            return;
        }

        // console.log({ticketFormRequest});
        // return;

        // If there are created tickets...
        if (eventRequest?.tickets) {
            setEventRequest({
                ...eventRequest as EventRequest,
                tickets: [...eventRequest?.tickets as TicketRequest[], ticketFormRequest as TicketRequest]
            });
        } else {
            // If there are no existing tickets...
            setEventRequest({
                ...eventRequest as EventRequest,
                tickets: [ticketFormRequest as TicketRequest]
            });
        }

        // Clear all fields
        setTicketFormRequest({} as TicketRequest);
        // Close modal
        setModalVisibility(false);
    };

    function updateExistingTicket() {
        if (!validateForm()) {
            return;
        }

        // If there are created tickets...
        if (eventRequest?.tickets) {
            const updatedTickets = eventRequest?.tickets.map((ticket, index) => {
                if (index == selectedTicketIndex) {
                    return ticketFormRequest as TicketRequest;
                }
                return ticket;
            });

            setEventRequest({
                ...eventRequest as EventRequest,
                tickets: updatedTickets
            });
        }

        // Clear all fields
        setTicketFormRequest({} as TicketRequest);
        // Close modal
        setModalVisibility(false);
    }

    async function handleAddNewTicketToEvent() {
        // console.log("New ticket: ", ticketFormRequest);
        // console.log("Event: ", eventId);

        if (!validateForm()) {
            return;
        }

        // Show loader
        setIsCreatingNewTicket(true);

        await createTicketForSpecifiedEvent(eventId as string, ticketFormRequest as TicketRequest)
            .then(async (response) => {

                handleFetchEventInfo && await handleFetchEventInfo();

                // Clear all fields
                setTicketFormRequest({} as TicketRequest);

                // Close modal
                setModalVisibility(false);
            })
            .catch((error) => {
                // Display error
                toast.error("An error occurred while creating your ticket");

                // Catch error
                catchError(error);
            })
            .finally(() => {
                // Show loader
                setIsCreatingNewTicket(false);
            })
    };

    useEffect(() => {
        // If we are editing a ticket, set the ticket form request to the selected ticket
        if (isEditingTicket && eventRequest?.tickets && selectedTicketIndex != undefined) {
            setTicketFormRequest(eventRequest?.tickets[selectedTicketIndex]);
        }
    }, [selectedTicketIndex]);

    return (
        <ModalWrapper visibility={modalVisibility} setVisibility={setModalVisibility} styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content" }}>
            <div className={styles.ticketCreationModal}>
                <div className={styles.topArea}>
                    <h4>{isEditingTicket ? "Edit Ticket" : "Create Ticket"}</h4>
                    <span
                        className={styles.closeIcon}
                        onClick={() => {
                            setModalVisibility(false)
                            setTicketFormRequest({} as TicketRequest);
                        }}>
                        <Icons.Close />
                    </span>
                </div>
                <div className={styles.mainFormSection}>
                    <div className={styles.formField}>
                        <label htmlFor="name">Ticket Name</label>
                        <input
                            type="text"
                            name="name"
                            // value={eventRequest?.tickets[0]?.role}
                            value={ticketFormRequest?.name ?? ""}
                            placeholder="Ticket name"
                            onChange={(e) => onFormValueChange(e, setTicketNameErrorMsg)}
                        />
                        {
                            ticketNameErrorMsg && ticketNameErrorMsg.status == DefaultFormResponseStatus.Failed &&
                            <span className={styles.errorMsg}>{ticketNameErrorMsg.message}</span>
                        }
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="price">Ticket Price</label>
                        <input
                            type="text"
                            name="price"
                            // value={eventRequest?.tickets[0]?.price}
                            value={ticketFormRequest?.price ?? ""}
                            placeholder="Price per ticket"
                            onChange={(e) => {
                                if (Number(e.target.value) == 0) {
                                    onFormValueChange(e);
                                    return;
                                }
                                if (!Number(e.target.value)) {
                                    return;
                                }

                                onFormValueChange(e, setTicketPriceErrorMsg);
                            }}
                            onKeyUp={(e) => {
                                const value = Number(e.currentTarget.value);
                                if (value > 0 && value < 1000) {
                                    setTicketPriceErrorMsg({ message: "Ticket price can either be 0 or greater than 1,000", status: DefaultFormResponseStatus.Failed });
                                } else {
                                    setTicketPriceErrorMsg(undefined);
                                }
                            }}
                            onKeyDown={(e) => {
                                // If . was pressed, prevent it
                                if (e.key === ".") {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <p className={styles.formFieldInfo}>Make the ticket price zero if it's marked as 'Free.' Tickets marked as '&#8358;0' can be gotten without paying anything.</p>
                        {
                            ticketPriceErrorMsg && ticketPriceErrorMsg.status == DefaultFormResponseStatus.Failed &&
                            <span className={styles.errorMsg}>{ticketPriceErrorMsg.message}</span>
                        }
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="numberOfUsers">Number of persons for this ticket</label>
                        <input
                            type="text"
                            name="numberOfUsers"
                            value={ticketFormRequest?.numberOfUsers ?? ""}
                            placeholder="Number of users"
                            onChange={(e) => {
                                if (Number(e.target.value) == 0) {
                                    onFormValueChange(e, setTicketNumberOfUsersErrorMsg);
                                    return;
                                }
                                if (!Number(e.target.value)) {
                                    return;
                                }

                                onFormValueChange(e, setTicketNumberOfUsersErrorMsg);
                            }}
                            onKeyUp={(e) => {
                                if (Number(ticketFormRequest?.numberOfUsers) < 1 && e.currentTarget.value != "") {
                                    setTicketNumberOfUsersErrorMsg({ message: "The minimum number of users for a ticket is 1", status: DefaultFormResponseStatus.Failed });
                                }
                            }}
                            onKeyDown={(e) => {
                                // If . was pressed, prevent it
                                if (e.key == ".") {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {
                            ticketNumberOfUsersErrorMsg && ticketNumberOfUsersErrorMsg.status == DefaultFormResponseStatus.Failed &&
                            <span className={styles.errorMsg}>{ticketNumberOfUsersErrorMsg.message}</span>
                        }
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="quantity">Number of available tickets</label>
                        <input
                            type="text"
                            name="quantity"
                            value={ticketFormRequest?.quantity ?? ""}
                            placeholder="Number of available tickets"
                            onChange={(e) => {
                                if (Number(e.target.value) == 0) {
                                    onFormValueChange(e, setTicketQuantityErrorMsg);
                                    return;
                                }
                                if (!Number(e.target.value)) {
                                    return;
                                }

                                onFormValueChange(e, setTicketQuantityErrorMsg);
                            }}
                            onKeyUp={(e) => {
                                if (Number(ticketFormRequest?.quantity) < 0 && e.currentTarget.value != "") {
                                    setTicketQuantityErrorMsg({ message: "The minimum number of available tickets cannot be less than 0", status: DefaultFormResponseStatus.Failed });
                                }
                            }}
                            onKeyDown={(e) => {
                                // If . was pressed, prevent it
                                if (e.key == ".") {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {
                            ticketQuantityErrorMsg && ticketQuantityErrorMsg.status == DefaultFormResponseStatus.Failed &&
                            <span className={styles.errorMsg}>{ticketQuantityErrorMsg.message}</span>
                        }
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="description">Ticket Description</label>
                        <textarea
                            name="description"
                            value={ticketFormRequest?.description ?? ""}
                            placeholder="Short description of the ticket, including benefits, etc."
                            onChange={(e) => onFormValueChange(e, setTicketDescriptionErrorMsg)}
                        />
                        {
                            ticketDescriptionErrorMsg && ticketDescriptionErrorMsg.status == DefaultFormResponseStatus.Failed &&
                            <span className={styles.errorMsg}>{ticketDescriptionErrorMsg.message}</span>
                        }
                    </div>
                    <button
                        type="button"
                        disabled={forExistingEvent && isCreatingNewTicket}
                        onClick={() => isEditingTicket ? updateExistingTicket() : forExistingEvent ? handleAddNewTicketToEvent() : addNewTicket()}>
                        {
                            isEditingTicket ?
                                <>Update ticket</> :
                                <>{forExistingEvent && isCreatingNewTicket ? "Adding ticket..." : "Add Ticket"}</>
                        }
                        {/* {forExistingEvent ? isCreatingNewTicket ? "Creating ticket..." : "Create Ticket" : "Add Ticket"} */}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default TicketCreationModal;