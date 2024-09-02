import { FunctionComponent, ReactElement, useEffect, useState, Dispatch, SetStateAction } from "react";
import styles from "../../styles/EventDetails.module.scss";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { Theme } from "@/app/enums/Theme";
import { CloseIcon } from "../SVGs/SVGicons";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface TicketsSelectionContainerProps {
    appTheme: Theme | null
    eventTickets: RetrievedTicketResponse[]
    setEventTickets: Dispatch<SetStateAction<RetrievedTicketResponse[] | undefined>>
    totalPrice: number
    setTicketDeliveryModalIsVisible: Dispatch<SetStateAction<boolean>>
    setTicketsSelectionContainerIsVisible: Dispatch<SetStateAction<boolean>>
    setContactDetailsModalIsVisible: Dispatch<SetStateAction<boolean>>
}

const TicketsSelectionContainer: FunctionComponent<TicketsSelectionContainerProps> = (
    { appTheme, eventTickets, setEventTickets, totalPrice, setContactDetailsModalIsVisible,
        setTicketDeliveryModalIsVisible, setTicketsSelectionContainerIsVisible }): ReactElement => {

    const [totalSelectedTicketsCount, setTotalSelectedTicketsCount] = useState(0);
    const [userHasSelectedAtLeastOneTicket, setUserHasSelectedAtLeastOneTicket] = useState(false);

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);


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
        <div className={appTheme === Theme.Light ? styles.ticketsSelectionContainerLightTheme : styles.ticketsSelectionContainer}>
            <div className={styles.topArea}>
                <h3>Select the tickets you would like to get, and the number for each.</h3>
                <p>You can select multiple tickets.</p>
            </div>
            <div className={styles.ticketsContainer}>
                {eventTickets?.map((ticketType, index) => {

                    const ticketIsSoldOut = ticketType.remainingTickets === 0;
                    // border: 0.2rem solid rgba($color: $primary-color-sub-50, $alpha: 0.2);
                    return (
                        <div
                            className={`flex flex-col gap-2 bg-primary-color-sub-50/10 p-5 rounded-lg border-2 border-solid border-transparent ${ticketIsSoldOut ? "border-failed-color/0 pointer-events-none" : ""} ${ticketType.selectedTickets > 0 ? 'border-primary-color-sub-50/30' : ''}`}
                            key={index}>
                            <div className={styles.ticket__topArea}>
                                <p>{ticketType.name}</p>
                                <h4>
                                    {ticketType.price > 0 ?
                                        <>&#8358;{ticketType.price.toLocaleString()}</> :
                                        "Free"
                                    }
                                </h4>
                            </div>
                            {
                                ticketIsSoldOut ?
                                    <div className="bg-white rounded-md h-[30px] grid place-items-center mt-auto">
                                        <p className="text-sm text-failed-color">Sold Out!</p>
                                    </div>
                                    :
                                    <div className={styles.ticket__bottomArea}>
                                        <span onClick={() => { ticketType.selectedTickets > 0 && decrementTicket(ticketType) }}>-</span>
                                        <p>{ticketType.selectedTickets} {ticketType.selectedTickets > 1 ? "tickets" : "ticket"}</p>
                                        <span onClick={() => incrementTicket(ticketType)}>+</span>
                                    </div>
                            }
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
                <div className={styles.right}>
                    <button
                        onClick={() => {
                            if (!userInfo) {
                                setContactDetailsModalIsVisible(true);
                                return;
                            }
                            setTicketDeliveryModalIsVisible(true)
                        }}
                        disabled={!userHasSelectedAtLeastOneTicket}>
                        Purchase {totalSelectedTicketsCount > 1 ? 'tickets' : 'ticket'}
                    </button>
                    <button
                        onClick={() => setTicketsSelectionContainerIsVisible(false)}
                        className={styles.closeBtn}>
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketsSelectionContainer;