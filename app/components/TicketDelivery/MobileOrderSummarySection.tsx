import moment from "moment";
import Image from "next/image";
import { FunctionComponent, ReactElement, useContext } from "react";
import styles from "@/app/styles/TicketDelivery.module.scss";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";
import { CouponDetails } from "@/app/models/ICoupon";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";

interface MobileOrderSummarySectionProps {
    eventTickets: RetrievedTicketResponse[] | undefined
    totalPrice: number
    eventInfo: EventResponse | undefined
    couponDetails: CouponDetails | undefined
}

const MobileOrderSummarySection: FunctionComponent<MobileOrderSummarySectionProps> = ({
    eventInfo, eventTickets, totalPrice, couponDetails
}): ReactElement => {
    

    const { transactionFees } = useContext(ApplicationContext) as ApplicationContextData;

    const eventTransactionFee = transactionFees?.find((transactionFee) => transactionFee.events.find((event) => event.title == eventInfo?.title));
    const generalTransactionFee = transactionFees?.find((transactionFee) => transactionFee.events.length == 0);

    const transactionFeePercentage = Number(eventTransactionFee?.percentage as string) || Number(generalTransactionFee?.percentage as string) || 0;
    const flatFee = Number(eventTransactionFee?.flatFee as string) || Number(generalTransactionFee?.flatFee as string) || 0; 

    const fees = (transactionFeePercentage ? (totalPrice * transactionFeePercentage) / 100 : 0) + (flatFee || 0);
    const totalAmountPayable = totalPrice + fees - (couponDetails?.discount ? (totalPrice * Number(couponDetails.discount)) / 100 : 0);

    return (
        <>
            <div className={styles.eventImageContainer}>
                <div className={styles.eventImage}>
                    {eventInfo?.mainImageUrl && <Image src={eventInfo.mainImageUrl as string} fill alt="Flyer" />}
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
                    <span>Discount ({couponDetails?.discount ?? 0}% off)</span>
                    <span className={styles.value}>-&nbsp;&#8358;{((totalPrice * Number(couponDetails?.discount ?? 0)) / 100).toLocaleString()}</span>
                </div>
                <div className={styles.summaryInfo__subs}>
                    <span>Fees</span>
                    <span className={styles.value}>&#8358;{(fees)?.toLocaleString()}</span>
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