"use client";
import {
    ReactElement,
    FunctionComponent,
    useEffect,
    useState,
    useRef,
    Suspense,
} from "react";
import styles from "@/app/styles/OrdersPage.module.scss";
import EventMainInfo from "../../../components/Event/EventInfo";
import { EventResponse } from "../../../models/IEvents";
import { useFetchOrderInformationById } from "@/app/api/apiClient";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { UserTicketOrderInfo } from "@/app/models/IUserTicketOrder";
import { UserTicketOrder } from "@/app/models/ITicketOrder";
import { TicketPass } from "@/app/models/ITicketPass";
import QRCode from "qrcode.react";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import TicketUi from "@/app/components/Ticket/TicketUi";
import { Icons } from "@/app/components/ui/icons";
import { ImagePopup } from "@/app/components/custom/ImagePopup";
import { Session } from "next-auth";

interface OrdersPageProps {
    hostUrl: string | undefined;
    orderInformation: UserTicketOrderInfo | null;
    session: Session | null
}

const OrdersPage: FunctionComponent<OrdersPageProps> = ({
    orderInformation,
    hostUrl,
    session
}): ReactElement => {
    const [isFetchingOrderInformation, setIsFetchingOrderInformation] = useState(false);
    const [selectedTicketOrderInfo, setSelectedTicketOrderInfo] = useState<TicketPass>();
    const [isTicketVisible, setIsTicketVisible] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    function showTicketUi(ticketOrder: UserTicketOrder) {
        const ticketInfo = {
            ticketType: ticketOrder.ticket.name,
            eventInfo: orderInformation?.event as EventResponse,
            qr: <QRCode value={ticketOrder?.orderId as string} />,
            orderId: ticketOrder?.orderId as string,
        };
        setSelectedTicketOrderInfo(ticketInfo);
        setIsTicketVisible(true);
    }

    // useEffect(() => {
    //     handleFetchOrderInformation();
    // }, []);

    // useEffect(() => {
    //     if (selectedTicketOrderInfo && !isTicketVisible) {
    //         setIsTicketVisible(true);
    //     }
    // }, [selectedTicketOrderInfo, isTicketVisible]);

    return (
        <>
            <ModalWrapper
                visibility={isTicketVisible && selectedTicketOrderInfo !== undefined}
                setVisibility={setIsTicketVisible}
                styles={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    width: "100%",
                    overflowY: "auto",
                    maxHeight: "100vh",
                    paddingTop: "50px",
                    paddingBottom: "50px",
                }}
            >
                {selectedTicketOrderInfo && (
                    <TicketUi
                        ticketInfo={selectedTicketOrderInfo}
                        setIsTicketVisible={setIsTicketVisible}
                    />
                )}
            </ModalWrapper>

            <Suspense
                fallback={
                    <div className='bg-black text-white'>
                        <p>Loading order information...</p>
                    </div>
                }
            >
                {orderInformation && orderInformation.event && (
                    <ImagePopup
                        imageUrl={orderInformation.event.mainImageUrl}
                        alt={orderInformation.event.title}
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                    />
                )}

                <main className='text-white bg-dark-grey sectionPadding pt-6 pb-20'>
                    {isFetchingOrderInformation && !orderInformation && (
                        <div className='flex flex-col items-center justify-center min-h-[80vh] text-center'>
                            <div className='size-[100px] relative mb-4'>
                                <ComponentLoader customLoaderColor='#fff' />
                            </div>
                            <h3 className='text-xl font-medium text-white mb-1'>
                                Fetching ticket order information
                            </h3>
                            <p className='text-[0.85rem] text-white text-center'>
                                Please wait while we fetch your ticket order information.
                            </p>
                        </div>
                    )}

                    {!isFetchingOrderInformation && !orderInformation && (
                        <div className='flex flex-col items-center justify-center min-h-[80vh] text-center'>
                            {/* <div className={styles.loaderArea}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div> */}
                            <h3 className='text-xl font-medium text-white mb-1'>
                                There was no ticket order found
                            </h3>
                            <p className='text-[0.85rem] text-white text-center'>
                                It seems the ticket order you are looking for does not exist.
                            </p>
                        </div>
                    )}

                    {!isFetchingOrderInformation && orderInformation && (
                        <>
                            <div className='flex items-center mb-6'>
                                {/* <span className={styles.closeIcon}><ArrowLeftIcon /></span> */}
                                {/* <h2>Order <span>#{orderInformation?.orderId}</span> on {moment(orderInformation?.createdAt).format("MMM D, YYYY")}</h2> */}
                                <h2 className='text-2xl font-medium m-0'>
                                    Order{" "}
                                    <span className='opacity-50'>
                                        #{orderInformation.orderId}
                                    </span>
                                </h2>
                            </div>
                            <div className='flex flex-col md:flex-row'>
                                <div className='w-full order-2 md:w-[35%] md:order-none mr-12'>
                                    <EventMainInfo
                                        eventInfo={orderInformation.event}
                                        forOrdersPage
                                        hideStatusTag
                                        hostUrl={hostUrl}
                                        setIsPopupOpen={setIsPopupOpen}
                                        session={session}
                                    />
                                </div>
                                <div className='w-full order-1 md:order-none md:w-[calc(65%-3rem)] flex flex-col bg-container-grey mb-8 h-fit p-5 rounded-[20px]'>
                                    <h2 className='text-2xl font-medium mb-1'>Tickets</h2>
                                    <p className='text-sm text-white opacity-70 mb-4'>
                                        Primary email: {orderInformation.contactEmail}
                                    </p>
                                    <div className='flex md:items-center justify-between border-b border-container-grey flex-col items-start'>
                                        {orderInformation.orderedTickets.map(
                                            (orderedTicket, index) => (
                                                <div
                                                    className='flex flex-row items-center justify-between w-full py-4 border-b-[1px] border-b-container-grey'
                                                    key={index}
                                                >
                                                    <div className="flex flex-col">
                                                        <h3 className='text-lg font-medium'>
                                                            {orderedTicket.ticket.name}
                                                        </h3>
                                                        <p className={`m-0 ${orderedTicket.associatedEmail ? '' : ' text-sm italic opacity-70'}`}>
                                                            {
                                                                orderedTicket.associatedEmail ?
                                                                    `Sent to: ${orderedTicket.associatedEmail}` :
                                                                    "Sent to primary email"
                                                            }
                                                        </p>
                                                    </div>

                                                    <button
                                                        className='p-2 px-4 bg-white/10 hover:bg-white/30 rounded-full text-sm transition-all flex flex-row items-center gap-2'
                                                        onClick={() => showTicketUi(orderedTicket)}
                                                    >
                                                        <Icons.Ticket width={18} />
                                                        View Ticket
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    {/* <div className={styles.actions}>
                        <button>Cancel order</button>
                        <button>Resend tickets to email</button>
                    </div> */}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </Suspense>
        </>
    );
};

export default OrdersPage;
