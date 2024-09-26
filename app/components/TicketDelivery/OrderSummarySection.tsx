import images from "@/public/images";
import Image from "next/image";
import styles from "../../styles/TicketDelivery.module.scss";
import { FunctionComponent, ReactElement, Dispatch, SetStateAction, useContext, useEffect } from "react";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import ComponentLoader from "../Loader/ComponentLoader";
import { EventResponse } from "@/app/models/IEvents";
import moment from "moment";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";
import { CouponDetails } from "@/app/models/ICoupon";

interface OrderSummarySectionProps {
    eventTickets: RetrievedTicketResponse[] | undefined
    totalPrice: number
    setVisibility: Dispatch<SetStateAction<boolean>>
    handleTicketOrderCreation(): Promise<void>
    isProcessingOrder: boolean
    eventInfo: EventResponse | undefined
    couponDetails: CouponDetails | undefined
    setOrganizerAmount: Dispatch<SetStateAction<number | undefined>>
}

const OrderSummarySection: FunctionComponent<OrderSummarySectionProps> = (
    { eventTickets, totalPrice, setVisibility, couponDetails, setOrganizerAmount,
        handleTicketOrderCreation, isProcessingOrder, eventInfo }): ReactElement => {

    const { transactionFees } = useContext(ApplicationContext) as ApplicationContextData;

    const eventTransactionFee = transactionFees?.find((transactionFee) => transactionFee.events.find((event) => event.title == eventInfo?.title));
    const generalTransactionFee = transactionFees?.find((transactionFee) => transactionFee.events.length == 0);

    const transactionFeePercentage = Number(eventTransactionFee?.percentage as string) || Number(generalTransactionFee?.percentage as string) || 0;
    const flatFee = Number(eventTransactionFee?.flatFee as string) || Number(generalTransactionFee?.flatFee as string) || 0;

    const fees = eventInfo?.organizerPaysFee || totalPrice == 0 ? 0 : (transactionFeePercentage ? (totalPrice * transactionFeePercentage) / 100 : 0) + (flatFee || 0);
    const totalAmountPayable = eventInfo?.organizerPaysFee ? totalPrice - (couponDetails?.discount ? (totalPrice * Number(couponDetails.discount)) / 100 : 0) : totalPrice + fees - (couponDetails?.discount ? (totalPrice * Number(couponDetails.discount)) / 100 : 0);

    useEffect(() => {
        setOrganizerAmount(fees == 0 ? totalAmountPayable : totalAmountPayable - fees);
    }, [totalAmountPayable, fees]);

    return (
        <div className={styles.rhs}>
            <div className={styles.eventImageContainer}>
                <div className={styles.eventImage}>
                    {eventInfo?.mainImageUrl && <Image src={eventInfo.mainImageUrl as string} fill alt="Flyer" sizes="auto" />}
                </div>
                <div className={styles.eventDetails}>
                    <h3>{eventInfo?.title}</h3>
                    {/* <p>{eventInfo?.description}</p> */}
                    {/* <p>{eventInfo?.venue}</p> */}
                    <p>{moment(eventInfo?.date).format("Do of MMMM YYYY")}</p>
                </div>
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
                    <span>Discount ({couponDetails?.discount ?? 0}% off)</span>
                    <span className={styles.value}>-&nbsp;&#8358;{((totalPrice * Number(couponDetails?.discount ?? 0)) / 100).toLocaleString()}</span>
                </div>
                <div className={styles.summaryInfo__subs}>
                    <span>Fees</span>
                    <span className={styles.value}>&#8358;{(fees)?.toLocaleString()}</span>
                </div>
                <div className={styles.summaryInfo__subs}>
                    <span>Total</span>
                    <span className={styles.value}>&#8358;{(totalAmountPayable)?.toLocaleString()}</span>
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