"use client"
import { ReactElement, FunctionComponent, useEffect, useState } from "react";
import styles from "@/app/styles/OrdersPage.module.scss";
import { ArrowLeftIcon, DownloadIcon } from "../../components/SVGs/SVGicons";
import EventMainInfo from "../../components/Event/EventInfo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EventResponse } from "../../models/IEvents";
import { useFetchOrderInformationById } from "@/app/api/apiClient";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { UserTicketOrder } from "@/app/models/IUserTicketOrder";
import moment from "moment";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

interface OrdersPageProps {
    orderId: string
    hostUrl: string | undefined
}

const OrdersPage: FunctionComponent<OrdersPageProps> = ({ orderId, hostUrl }): ReactElement => {

    const fetchOrderInformationById = useFetchOrderInformationById();
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const [isFetchingOrderInformation, setIsFetchingOrderInformation] = useState(true);
    const [orderInformation, setOrderInformation] = useState<UserTicketOrder | null>(null);

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

    useEffect(() => {
        handleFetchOrderInformation();
    }, []);

    return (
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
                !isFetchingOrderInformation &&
                <>
                    <div className={styles.topArea}>
                        {/* <span className={styles.closeIcon}><ArrowLeftIcon /></span> */}
                        {/* <h2>Order <span>#{orderInformation?.orderId}</span> on {moment(orderInformation?.createdAt).format("MMM D, YYYY")}</h2> */}
                        <h2>Order <span>#{orderInformation?.orderId}</span></h2>
                    </div>
                    <div className={styles.orderInformationContainer}>
                        <div className={styles.eventContainer}>
                            <EventMainInfo
                                appTheme={appTheme}
                                eventInfo={orderInformation?.event as EventResponse}
                                forOrdersPage
                                hideStatusTag
                                hostUrl={hostUrl}
                            />
                        </div>
                        <div className={styles.ticketsContainer}>
                            <h2>Tickets</h2>
                            <div className={styles.tickets}>
                                {
                                    orderInformation?.orderedTickets.map((orderedTickets, index) => (
                                        <div className={styles.ticket} key={index}>
                                            <h3>{orderedTickets.ticket.name}</h3>
                                            <p>{orderedTickets.associatedEmail}</p>
                                            <button><DownloadIcon /></button>
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
    );
}

export default OrdersPage;