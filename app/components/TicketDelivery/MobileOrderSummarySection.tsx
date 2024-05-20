import moment from "moment";
import Image from "next/image";
import { FunctionComponent, ReactElement } from "react";
import styles from "@/app/styles/TicketDelivery.module.scss";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";

interface MobileOrderSummarySectionProps {
    eventTickets: RetrievedTicketResponse[] | undefined
    totalPrice: number
    eventInfo: EventResponse | undefined
}

const MobileOrderSummarySection: FunctionComponent<MobileOrderSummarySectionProps> = ({
    eventInfo, eventTickets, totalPrice
}): ReactElement => {
    return (
        <>
            <div className={styles.eventImageContainer}>
                <div className={styles.eventImage}>
                    <Image src={eventInfo?.mainImageUrl as string} fill alt="Flyer" />
                </div>
                <div className={styles.eventDetails}>
                    <h3>{eventInfo?.title}</h3>
                    <p>{moment(eventInfo?.date).format("Do of MMMM YYYY")}</p>
                </div>
            </div>
            <h3>Order summary</h3>
            <div className={styles.summaryInfo}>
                {
                    eventTickets?.filter((eventTicket) => eventTicket.selectedTickets > 0).map((eventTicket, index) => {
                        return (
                            <div className={styles.summaryInfo__ticket}>
                                <span>{eventTicket.selectedTickets} x {eventTicket.name}</span>
                                <span className={styles.value}>&#8358;{(eventTicket.price * eventTicket.selectedTickets).toLocaleString()}</span>
                            </div>
                        )
                    })
                }
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
        </>
    );
}

export default MobileOrderSummarySection;