"use client"
import { ReactElement, FunctionComponent, useEffect, useState, useRef } from "react";
import styles from "@/app/styles/OrdersPage.module.scss";
import { ArrowLeftIcon, DownloadIcon } from "../../components/SVGs/SVGicons";
import EventMainInfo from "../../components/Event/EventInfo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EventResponse } from "../../models/IEvents";
import { useFetchOrderInformationById } from "@/app/api/apiClient";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { UserTicketOrderInfo } from "@/app/models/IUserTicketOrder";
import moment from "moment";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { UserTicketOrder } from "@/app/models/ITicketOrder";
import { TicketPass } from "@/app/models/ITicketPass";
import QRCode from "qrcode.react";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import TicketUi from "@/app/components/Ticket/TicketUi";

interface OrdersPageProps {
    orderId: string
    hostUrl: string | undefined
}

const OrdersPage: FunctionComponent<OrdersPageProps> = ({ orderId, hostUrl }): ReactElement => {

    const fetchOrderInformationById = useFetchOrderInformationById();
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const [isFetchingOrderInformation, setIsFetchingOrderInformation] = useState(true);
    const [orderInformation, setOrderInformation] = useState<UserTicketOrderInfo | null>(null);
    const [selectedTicketOrderInfo, setSelectedTicketOrderInfo] = useState<TicketPass>();
    const [isTicketVisible, setIsTicketVisible] = useState(false);

    /**
     * Function to fetch order information
     */
    async function handleFetchOrderInformation() {

        await fetchOrderInformationById(orderId)
            .then((response) => {
                setOrderInformation(response.data);
            })
            .catch((error) => {
                setOrderInformation(null);
            })
            .finally(() => {
                // Fetch order information
                setIsFetchingOrderInformation(false);
            })
    };

    function showTicketUi(ticketOrder: UserTicketOrder) {
        setSelectedTicketOrderInfo({
            ticketType: ticketOrder.ticket.name,
            eventInfo: orderInformation?.event as EventResponse,
            qr: <QRCode value={ticketOrder?.orderId as string} />,
            orderId: ticketOrder?.orderId as string
        });
    };

    useEffect(() => {
        handleFetchOrderInformation();
    }, []);

    useEffect(() => {
        if (selectedTicketOrderInfo) {
            setIsTicketVisible(true);
            return;
        }
    }, [selectedTicketOrderInfo]);

    const pdfRef = useRef<HTMLDivElement>(null);

    return (
        <>
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
                                    appTheme={appTheme}
                                    eventInfo={orderInformation.event}
                                    forOrdersPage
                                    hideStatusTag
                                    hostUrl={hostUrl}
                                />
                            </div>
                            <div className={styles.ticketsContainer}>
                                <h2>Tickets</h2>
                                <p>Primary email: {orderInformation.contactEmail}</p>
                                <div className={styles.tickets}>
                                    {
                                        orderInformation.orderedTickets.map((orderedTicket, index) => (
                                            <div className="flex flex-row items-center justify-between py-4 border-b-[1px] border-b-container-grey" key={index}>
                                                <h3>{orderedTicket.ticket.name}</h3>
                                                <p style={orderedTicket.associatedEmail ? {} : { fontSize: "14px", fontStyle: "italic", opacity: 0.5 }}>
                                                    {orderedTicket.associatedEmail ?? "Sent to primary email"}
                                                </p>
                                                <button
                                                className="p-2 px-4 bg-white/10 hover:bg-white/30 rounded-full text-sm transition-all"
                                                    onClick={() => showTicketUi(orderedTicket)}
                                                >
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
        </>
    );
}

export default OrdersPage;