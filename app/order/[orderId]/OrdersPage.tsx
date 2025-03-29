"use client"
import { ReactElement, FunctionComponent, useEffect, useState, useRef, Suspense } from "react";
import styles from "@/app/styles/OrdersPage.module.scss";
import EventMainInfo from "../../components/Event/EventInfo";
import { EventResponse } from "../../models/IEvents";
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

interface OrdersPageProps {
    hostUrl: string | undefined
    orderInformation: UserTicketOrderInfo | null
}

const OrdersPage: FunctionComponent<OrdersPageProps> = ({ orderInformation, hostUrl }): ReactElement => {

    const [isFetchingOrderInformation, setIsFetchingOrderInformation] = useState(false);
    const [selectedTicketOrderInfo, setSelectedTicketOrderInfo] = useState<TicketPass>();
    const [isTicketVisible, setIsTicketVisible] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    /**
     * Function to fetch order information
     */
    // async function handleFetchOrderInformation() {

    //     await fetchOrderInformationById(orderId)
    //         .then((response) => {
    //             setOrderInformation(response.data);
    //         })
    //         .catch((error) => {
    //             setOrderInformation(null);
    //         })
    //         .finally(() => {
    //             // Fetch order information
    //             setIsFetchingOrderInformation(false);
    //         })
    // };

    function showTicketUi(ticketOrder: UserTicketOrder) {
        setSelectedTicketOrderInfo({
            ticketType: ticketOrder.ticket.name,
            eventInfo: orderInformation?.event as EventResponse,
            qr: <QRCode value={ticketOrder?.orderId as string} />,
            orderId: ticketOrder?.orderId as string
        });
    };

    // useEffect(() => {
    //     handleFetchOrderInformation();
    // }, []);

    useEffect(() => {
        if (selectedTicketOrderInfo) {
            setIsTicketVisible(true);
            return;
        }
    }, [selectedTicketOrderInfo]);

    return (
        <>
            <Suspense fallback={<div className="bg-black text-white"><p>Loading order information...</p></div>}>
                <ModalWrapper
                    visibility={isTicketVisible && (selectedTicketOrderInfo !== undefined)}
                    setVisibility={setIsTicketVisible}
                    styles={{ backgroundColor: 'transparent', color: '#fff', width: "fit-content", overflowY: "auto", maxHeight: "100vh", paddingTop: "50px", paddingBottom: "50px" }}>
                    {
                        selectedTicketOrderInfo &&
                        <TicketUi
                            ticketInfo={selectedTicketOrderInfo}
                            setIsTicketVisible={setIsTicketVisible}
                        />
                    }
                </ModalWrapper>
                {
                    orderInformation && orderInformation.event &&
                    <ImagePopup
                        imageUrl={orderInformation.event.mainImageUrl}
                        alt={orderInformation.event.title}
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                    />
                }

                <main className={styles.orderspage}>
                    {
                        isFetchingOrderInformation && !orderInformation &&
                        <div className={styles.loaderAreaContainer}>
                            <div className={styles.loaderArea}>
                                <ComponentLoader customLoaderColor="#fff" />
                            </div>
                            <h3>Fetching ticket order information</h3>
                            <p>Please wait while we fetch your ticket order information.</p>
                        </div>
                    }

                    {
                        !isFetchingOrderInformation && !orderInformation &&
                        <div className={styles.loaderAreaContainer}>
                            {/* <div className={styles.loaderArea}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div> */}
                            <h3>There was no ticket order found</h3>
                            <p>It seems the ticket order you are looking for does not exist.</p>
                        </div>
                    }

                    {
                        !isFetchingOrderInformation && orderInformation &&
                        <>
                            <div className={styles.topArea}>
                                {/* <span className={styles.closeIcon}><ArrowLeftIcon /></span> */}
                                {/* <h2>Order <span>#{orderInformation?.orderId}</span> on {moment(orderInformation?.createdAt).format("MMM D, YYYY")}</h2> */}
                                <h2>Order <span>#{orderInformation.orderId}</span></h2>
                            </div>
                            <div className={styles.orderInformationContainer}>
                                <div className={styles.eventContainer}>
                                    <EventMainInfo
                                        eventInfo={orderInformation.event}
                                        forOrdersPage
                                        hideStatusTag
                                        hostUrl={hostUrl}
                                        setIsPopupOpen={setIsPopupOpen}
                                    />
                                </div>
                                <div className={styles.ticketsContainer}>
                                    <h2>Tickets</h2>
                                    <p className="text-white">Primary email: {orderInformation.contactEmail}</p>
                                    <div className={styles.tickets}>
                                        {
                                            orderInformation.orderedTickets.map((orderedTicket, index) => (
                                                <div className="flex flex-row items-center justify-between py-4 border-b-[1px] border-b-container-grey" key={index}>
                                                    <div className="flex flex-col">
                                                        <h3>{orderedTicket.ticket.name}</h3>
                                                        <p className="text-sm italic text-white/50">
                                                            {orderedTicket.associatedEmail || "Sent to primary email"}
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="p-2 px-4 bg-white/10 hover:bg-white/30 rounded-full text-sm transition-all flex flex-row items-center gap-2"
                                                        onClick={() => showTicketUi(orderedTicket)}
                                                    >
                                                        <Icons.Ticket width={18} />
                                                        View Ticket
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {/* <div className={styles.actions}>
                        <button>Cancel order</button>
                        <button>Resend tickets to email</button>
                    </div> */}
                                </div>
                            </div>
                        </>
                    }
                </main>
            </Suspense>
        </>
    );
}

export default OrdersPage;