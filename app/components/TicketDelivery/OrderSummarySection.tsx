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
    hideActionButtons?: boolean
}

const OrderSummarySection: FunctionComponent<OrderSummarySectionProps> = (
    { eventTickets, totalPrice, setVisibility, couponDetails, setOrganizerAmount,
        handleTicketOrderCreation, isProcessingOrder, eventInfo, hideActionButtons }): ReactElement => {

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
        <div className="flex flex-col basis-full gap-4 md:basis-[35%]">
            <div className="relative before:contents before:absolute before:w-full before:h-[60%] before:bottom-0 before:z-10 before:bg-gradient-to-b from-transparent to-black/80">
                <div className="w-full h-[150px] min-h-[150px] rounded-2xl overflow-hidden relative">
                    {
                        eventInfo?.mainImageUrl &&
                        <Image
                            className="w-full h-full object-cover"
                            src={eventInfo.mainImageUrl as string}
                            fill
                            alt="Flyer"
                        />
                    }
                </div>
                <div className="z-10 absolute w-full bottom-0 p-[10px]">
                    <h3 className="text-2xl font-bold text-white whitespace-nowrap text-ellipsis overflow-hidden w-full">
                        {eventInfo?.title}
                    </h3>
                    <p className="text-white opacity-80">
                        {moment(eventInfo?.date).format("Do of MMMM YYYY")}
                    </p>
                </div>
            </div>
            <h3>Order summary</h3>
            <div className="flex flex-col gap-2 h-full max-h-full overflow-y-auto pr-[0.375rem] summaryInfoScroller">
                {
                    eventTickets?.filter((eventTicket) => eventTicket.selectedTickets > 0).map((eventTicket, index) => {
                        return (
                            <div className="px-6 py-3 bg-primary-color-sub-50/10 rounded-lg flex items-center justify-between" key={index}>
                                <span className="text-[14px] text-primary-color-sub-50">
                                    {eventTicket.selectedTickets} x {eventTicket.name}
                                </span>
                                <span className="text-[14px] font-sans">
                                    &#8358;{(eventTicket.price * eventTicket.selectedTickets).toLocaleString()}
                                </span>
                            </div>
                        )
                    })
                }
                <div className="px-6 py-[6px] bg-transparent rounded-lg flex items-center justify-between">
                    <span className="text-[14px] text-primary-color-sub-50">
                        Subtotal
                    </span>
                    <span className="text-[14px] font-sans">
                        &#8358;{(totalPrice)?.toLocaleString()}
                    </span>
                </div>
                <div className="px-6 py-[6px] bg-transparent rounded-lg flex items-center justify-between">
                    <span className="text-[14px] text-primary-color-sub-50">
                        Discount ({couponDetails?.discount ?? 0}% off)
                    </span>
                    <span className="text-[14px] font-sans">
                        -&nbsp;&#8358;{((totalPrice * Number(couponDetails?.discount ?? 0)) / 100).toLocaleString()}
                    </span>
                </div>
                <div className="px-6 py-[6px] bg-transparent rounded-lg flex items-center justify-between">
                    <span className="text-[14px] text-primary-color-sub-50">
                        Fees
                    </span>
                    <span className="text-[14px] font-sans">
                        &#8358;{(fees)?.toLocaleString()}
                    </span>
                </div>
                <div className="px-6 py-[6px] bg-transparent rounded-lg flex items-center justify-between">
                    <span className="text-[14px] text-primary-color-sub-50">
                        Total
                    </span>
                    <span className="text-[14px] font-sans">
                        &#8358;{(totalAmountPayable)?.toLocaleString()}
                    </span>
                </div>
            </div>
            {
                hideActionButtons ? <></> :
                    <div className="fixed bottom-0 left-0 w-full px-2 py-4 md:relative md:z-10 flex items-center gap-4 mt-4 z-10">
                        <button
                            className="secondary-button !bg-failed-color"
                            onClick={() => setVisibility(false)}
                            disabled={isProcessingOrder}
                            tabIndex={1}>
                            Cancel
                        </button>
                        <button
                            className="secondary-button !bg-white !text-dark-grey"
                            onClick={() => handleTicketOrderCreation()}
                            disabled={isProcessingOrder}
                            tabIndex={1}>
                            Pay now
                            {isProcessingOrder && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                        </button>
                    </div>
            }
        </div>
    );
}

export default OrderSummarySection;