import { FunctionComponent, ReactElement, useEffect, useState, Dispatch, SetStateAction } from "react";
import styles from "../../styles/EventDetails.module.scss";
import { RetrievedTicketResponse } from "@/app/models/ITicket";

interface TicketsSelectionContainerProps {
    eventTickets: RetrievedTicketResponse[]
    setEventTickets: Dispatch<SetStateAction<RetrievedTicketResponse[] | undefined>>
    totalPrice: number
    setTicketDeliveryModalIsVisible: Dispatch<SetStateAction<boolean>>
}

const TicketsSelectionContainer: FunctionComponent<TicketsSelectionContainerProps> = (
    { eventTickets, setEventTickets, totalPrice, setTicketDeliveryModalIsVisible }): ReactElement => {


    const [totalSelectedTicketsCount, setTotalSelectedTicketsCount] = useState(0);
    const [userHasSelectedAtLeastOneTicket, setUserHasSelectedAtLeastOneTicket] = useState(false);


    function incrementTicket(selectedTicketType: RetrievedTicketResponse) {
        const updatedTickets = eventTickets?.map(ticketType => {
            if (ticketType === selectedTicketType) {
                return {
                    ...ticketType,
                    selectedTickets: ticketType.selectedTickets + 1,
                    isSelected: true
                };
            }
            return ticketType;
        })
        setEventTickets(updatedTickets);
    }

    function decrementTicket(selectedTicketType: RetrievedTicketResponse) {
        const updatedTickets = eventTickets?.map(ticketType => {
            if (ticketType === selectedTicketType) {
                if (selectedTicketType.selectedTickets == 1) {
                    return {
                        ...ticketType,
                        selectedTickets: ticketType.selectedTickets - 1,
                        isSelected: false
                    };
                }
                return {
                    ...ticketType,
                    selectedTickets: ticketType.selectedTickets - 1,
                    isSelected: true
                };
            }
            return ticketType;
        })
        setEventTickets(updatedTickets);
    }

    // useEffect hook to set total selected tickets count
    useEffect(() => {
        /**
         * the reduce function iterates through each ticket in the eventTickets array and adds up the selectedTickets count for each ticket. 
         * The 0 passed as the second argument to reduce initializes the total variable to 0.
         */
        setTotalSelectedTicketsCount(eventTickets?.reduce((total, ticket) => total + ticket.selectedTickets, 0) as number);
    }, [eventTickets]);

    useEffect(() => {
        if (eventTickets) {
            const selectedTickets = eventTickets.filter(ticket => ticket.isSelected);
            if (selectedTickets.length > 0) {
                setUserHasSelectedAtLeastOneTicket(true);
            } else {
                setUserHasSelectedAtLeastOneTicket(false);
            }
        }
    }, [eventTickets]);

    return (
        <div className={styles.ticketsSelectionContainer}>
            <div className={styles.topArea}>
                <h3>Select the tickets you would like to get, and the number for each.</h3>
                <p>You can select multiple tickets.</p>
            </div>
            <div className={styles.ticketsContainer}>
                {eventTickets?.map((ticketType, index) => {
                    return (
                        <div className={`${styles.ticket} ${ticketType.selectedTickets > 0 ? styles.active : ''}`} key={index}>
                            <div className={styles.ticket__topArea}>
                                <p>{ticketType.name}</p>
                                <h4>&#8358;{ticketType.price.toLocaleString()}</h4>
                            </div>
                            <div className={styles.ticket__bottomArea}>
                                <span onClick={() => { ticketType.selectedTickets > 0 && decrementTicket(ticketType) }}>-</span>
                                <p>{ticketType.selectedTickets} ticket</p>
                                <span onClick={() => incrementTicket(ticketType)}>+</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={styles.bottomContainer}>
                <div className={styles.left}>
                    <p>{totalSelectedTicketsCount} {totalSelectedTicketsCount > 1 ? 'tickets' : 'ticket'} selected</p>
                    <div className={styles.price}>
                        <p>Total Price:</p>
                        <h1>&#8358;{totalPrice?.toLocaleString()}</h1>
                    </div>
                </div>
                <button
                    onClick={() => setTicketDeliveryModalIsVisible(true)}
                    disabled={!userHasSelectedAtLeastOneTicket}>
                    Purchase {totalSelectedTicketsCount > 1 ? 'tickets' : 'ticket'}
                </button>
            </div>
        </div>
    );
}

export default TicketsSelectionContainer;