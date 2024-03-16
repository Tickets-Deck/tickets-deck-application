"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "@/app/styles/Tickets.module.scss";
import DynamicTab from "@/app/components/custom/DynamicTab";
import { CaretDownIcon, DownloadIcon } from "@/app/components/SVGs/SVGicons";
import { useFetchUserTicketOrders } from "@/app/api/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { catchError } from "@/app/constants/catchError";
import { toast } from "sonner";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { TicketCategory } from "@/app/enums/ITicket";
import { UserTicketOrders } from "@/app/models/ITicketOrder";
import moment from "moment";
import { serializeOrderStatus } from "@/app/constants/serializer";
import { OrderStatus } from "@/app/enums/IOrderStatus";

interface TicketsPageProps {

}

export enum TicketTab {
    Bought = 0,
    Sold = 1,
}

const TicketsPage: FunctionComponent<TicketsPageProps> = (): ReactElement => {

    const fetchUserTicketOrders = useFetchUserTicketOrders();

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);
    const [selectedTicketTab, setSelectedTicketTab] = useState(TicketTab.Bought);
    const [isFetchingUserTicketOrders, setIsFetchingUserTicketOrders] = useState(true);
    const [userTicketOrders, setUserTicketOrders] = useState<UserTicketOrders[]>([]);

    const ticketTabOptions = [
        {
            tabName: 'Tickets bought',
        },
        {
            tabName: 'Tickets sold',
            isDisabled: false
        },
    ];

    function showTagStyle(orderStatus: OrderStatus) {
        switch (orderStatus) {
            case OrderStatus.Pending:
                return styles.pendingTag;
            case OrderStatus.PaymentInitiated:
                return styles.initiatedTag;
            case OrderStatus.Confirmed:
                return styles.completedTag;
            case OrderStatus.Cancelled:
                return styles.cancelledTag;
            default:
                return styles.pendingTag;
        }
    }

    async function handleFetchUserTicketOrders() {

        // Start loader
        setIsFetchingUserTicketOrders(true);

        await fetchUserTicketOrders(userInfo?.id as string, selectedTicketTab === TicketTab.Bought ? TicketCategory.Bought : TicketCategory.Sold)
            .then((response) => {
                // Log response
                // console.log(response);

                // Update state
                setUserTicketOrders(response.data);
            })
            .catch((error) => {
                // Display error
                toast.error("An error occurred while fetching your ticket orders");

                // Catch error
                catchError(error);
            })
            .finally(() => {
                // Close loader
                setIsFetchingUserTicketOrders(false);
            })
    };

    useEffect(() => {
        if (userInfo) {
            handleFetchUserTicketOrders();
        }
    }, [userInfo, selectedTicketTab]);

    useEffect(() => {
        if (!isFetchingUserTicketOrders) {
            setTimeout(() => {
                toast.dismiss();
            }, 3000);
        }
    }, [isFetchingUserTicketOrders])

    return (
        <div className={styles.ticketsPage}>
            <div className={styles.topArea}>
                <h3>Tickets page</h3>
            </div>
            <div className={styles.filterSection}>
                <DynamicTab
                    currentTab={selectedTicketTab}
                    setCurrentTab={setSelectedTicketTab}
                    arrayOfTabOptions={ticketTabOptions}
                    tabCustomWidth={140}
                    tabCustomHeight={44}
                    indicatorColor='#8133F1'
                    containerbackgroundColor="#fff"
                />
            </div>
            <div className={styles.tableContainer}>
                <table>
                    <tbody>
                        <tr>
                            <th>Event name</th>
                            <th>Ticket name</th>
                            <th>Amount</th>
                            <th>Assigned email</th>
                            <th>Transaction date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                        {
                            userTicketOrders.map((userTicketOrder, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{userTicketOrder.ticket.event.title}</td>
                                        <td>{userTicketOrder.ticket.name}</td>
                                        <td>&#8358;{Number(userTicketOrder.ticket.price).toLocaleString()}</td>
                                        <td>
                                            <a href={`mailto:${userTicketOrder.associatedEmail}`}>{userTicketOrder.associatedEmail}</a>
                                        </td>
                                        <td>{moment(userTicketOrder.createdAt).format("ddd Do MMM, YYYY | hh:mma")}</td>
                                        <td>
                                            <span className={styles[`${serializeOrderStatus(userTicketOrder.orderStatus).toLowerCase()}Tag`]}>
                                                {serializeOrderStatus(userTicketOrder.orderStatus)}
                                            </span>
                                        </td>
                                        <td className={styles.actionsDropdownContainer}>
                                            <button>View Info</button>
                                            <span><DownloadIcon /></span>
                                            {/* <span className={styles.dropdownBtn}>
                                                <CaretDownIcon />
                                            </span>
                                            <div className={styles.dropdownOptions}>
                                                <span>Option</span>
                                                <span>Option</span>
                                                <span>Option</span>
                                            </div> */}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {
                    userTicketOrders.length == 0 && !isFetchingUserTicketOrders &&
                    <div className={styles.tableInfoUnavailable}>
                        <p>There is no data available</p>
                    </div>
                }
                {
                    userTicketOrders.length == 0 && isFetchingUserTicketOrders &&
                    <div className={styles.tableLoader}>
                        <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />
                    </div>
                }
            </div>
        </div >
    );
}

export default TicketsPage;