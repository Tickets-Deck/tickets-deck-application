import images from "@/public/images";
import Image from "next/image";
import styles from "../../styles/TicketDelivery.module.scss";
import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import ComponentLoader from "../Loader/ComponentLoader";
import { EventResponse } from "@/app/models/IEvents";

interface OrderSummarySectionProps {
    eventTickets: RetrievedTicketResponse[] | undefined
    totalPrice: number
    setVisibility: Dispatch<SetStateAction<boolean>>
    handleTicketOrderCreation(): Promise<void>
    isProcessingOrder: boolean
    eventInfo: EventResponse | undefined
}

const OrderSummarySection: FunctionComponent<OrderSummarySectionProps> = (
    { eventTickets, totalPrice, setVisibility,
        handleTicketOrderCreation, isProcessingOrder, eventInfo }): ReactElement => {

    return (
        <div className={styles.rhs}>
            <div className={styles.eventImage}>
                <Image src={eventInfo?.mainImageUrl as string} fill alt="Flyer" />
            </div>
            <h3>Order summary</h3>
            <div className={styles.summaryInfo}>
                {
                    eventTickets?.filter((eventTicket) => eventTicket.selectedTickets > 0).map((eventTicket, index) => {
                        return (
                            <div className={styles.summaryInfo__ticket} key={index}>
                                <span>{eventTicket.selectedTickets} x {eventTicket.name}</span>
                                <span className={styles.value}>&#8358;{(eventTicket.price * eventTicket.selectedTickets).toLocaleString()}</span>
                            </div>
                        )
                    })
                }
                {/* {
                                    ticketPricings.map((ticketPricing, index) => {
                                        return (
                                            <div className={styles.summaryInfo__ticket} key={index}>
                                                <span>{ticketPricing.selectedTickets} x {ticketPricing.ticketType}</span>
                                                <span className={styles.value}>&#8358;{(parseInt(ticketPricing.price.total) * ticketPricing.selectedTickets).toLocaleString()}</span>
                                            </div>
                                        )
                                    })
                                } */}
                <div className={styles.summaryInfo__subs}>
                    <span>Subtotal</span>
                    <span className={styles.value}>&#8358;{(totalPrice)?.toLocaleString()}</span>
                </div>
                <div className={styles.summaryInfo__subs}>
                    <span>Discount (0% off)</span>
                    <span className={styles.value}>-&nbsp;&#8358;{(0).toLocaleString()}</span>
                </div>
                <div className={styles.summaryInfo__subs}>
                    <span>Total</span>
                    <span className={styles.value}>&#8358;{(totalPrice)?.toLocaleString()}</span>
                </div>
            </div>
            <div className={styles.actionButtons}>
                <button onClick={() => setVisibility(false)} disabled={isProcessingOrder} tabIndex={1}>Cancel</button>
                <button onClick={() => handleTicketOrderCreation()} disabled={isProcessingOrder} tabIndex={1}>
                    Pay now
                    {isProcessingOrder && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                </button>
            </div>
        </div>
    );
}

export default OrderSummarySection;