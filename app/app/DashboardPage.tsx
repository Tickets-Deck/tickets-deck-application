"use client"
import { ReactElement, FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { EventIcon } from "../components/SVGs/SVGicons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetchDashboardInfo, useFetchTicketsSoldMetrics, useFetchUserRecentTransactions } from "../api/apiClient";
import { DashboardInfoResponse } from "../models/IDashboardInfoResponse";
import { catchError } from "../constants/catchError";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { ApplicationRoutes } from "../constants/applicationRoutes";
import { UserRecentTransaction } from "../models/IUserRecentTransaction";
import moment from "moment";
import { serializeOrderStatus } from "../constants/serializer";
import { OrderStatus } from "../enums/IOrderStatus";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import PhoneNumberModal from "../components/Modal/PhoneNumberModal";
import { TicketsSoldMetrics } from "../models/IMetrics";

interface DashboardPageProps {
}

const DashboardPage: FunctionComponent<DashboardPageProps> = (): ReactElement => {

    const fetchDashboardInfo = useFetchDashboardInfo();
    const fetchUserRecentTransactions = useFetchUserRecentTransactions();
    const fetchTicketsSoldMetrics = useFetchTicketsSoldMetrics();

    const { data: session, status } = useSession();
    const user = session?.user;
    const { push } = useRouter();

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);

    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const [userRecentTransactions, setUserRecentTransactionss] = useState<UserRecentTransaction[]>([]);
    const [isFetchingUserRecentTransactions, setIsFetchingUserRecentTransactions] = useState(true);
    const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
    const [isFetchingTicketsSoldMetrics, setIsFetchingTicketsSoldMetrics] = useState(true);
    const [ticketsSoldMetrics, setTicketsSoldMetrics] = useState<TicketsSoldMetrics[]>([]);

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

    async function handleFetchDashboardInfo() {

        // Start loader
        setIsLoading(true);

        await fetchDashboardInfo(user?.id as string)
            .then((response) => {
                setDashboardInfo(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    async function handleFetchUserRecentTransactions(duration?: string) {

        // Start loader
        setIsFetchingUserRecentTransactions(true);

        await fetchUserRecentTransactions(user?.id as string, duration)
            .then((response) => {
                setUserRecentTransactionss(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsFetchingUserRecentTransactions(false);
            });
    };

    async function handleFetchTicketsSoldMetrics() {

        // show loader
        setIsFetchingTicketsSoldMetrics(true);

        await fetchTicketsSoldMetrics(user?.id as string)
            .then((response) => {
                console.log("🚀 ~ .fetchTicketsSoldMetrics ~ response:", response)
                setTicketsSoldMetrics(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                setIsFetchingTicketsSoldMetrics(false);
            });
    }

    function greeting() {
        const date = new Date();
        const hours = date.getHours();
        let greeting = "Good morning";

        if (hours >= 12 && hours < 17) {
            greeting = "Good afternoon";
        } else if (hours >= 17 && hours < 24) {
            greeting = "Good evening";
        }

        return greeting;
    }

    useEffect(() => {
        if (user) {
            handleFetchDashboardInfo();
            handleFetchUserRecentTransactions("14"); // set to fetch transactions within the last 2 weeks by default
            handleFetchTicketsSoldMetrics();
        }
    }, [user]);

    useEffect(() => {
        if (status === "unauthenticated") {
            push(ApplicationRoutes.SignIn);
        }
    }, [status]);

    useEffect(() => {
        if (userInfo && !userInfo.phone || userInfo?.phone == "") {
            setShowPhoneNumberModal(true);
        }
    }, [userInfo]);

    return (
        <>
            <PhoneNumberModal
                visibility={showPhoneNumberModal}
                setVisibility={setShowPhoneNumberModal}
            />
            <div className={styles.dashboard}>
                {
                    userInfo &&
                    <div className={styles.greetings}>
                        <p>{moment(new Date).format("dddd, Do MMM YYYY")}</p>
                        <h4>{greeting()}, {userInfo?.firstName}!</h4>
                    </div>
                }

                {/* <div className={styles.topArea}>
                <h3>Dashboard</h3>
                <Link href={ApplicationRoutes.CreateEvent}>
                    <button>New Event</button>
                </Link>
            </div> */}

                {
                    !isLoading && dashboardInfo &&
                    <div className={styles.kpiSection}>
                        <h3>Dashboard</h3>
                        <div className={styles.kpis}>
                            <Link href={ApplicationRoutes.Events} className={styles.kpi}>
                                <span><EventIcon /></span>
                                <div className={styles.content}>
                                    <h4>{dashboardInfo.totalEvents}</h4>
                                    <p>Total {dashboardInfo.totalEvents > 1 ? "Events" : "Event"}</p>
                                </div>
                            </Link>
                            <Link href={`${ApplicationRoutes.EventTickets}?t=0`} className={styles.kpi}>
                                <span><EventIcon /></span>
                                <div className={styles.content}>
                                    <h4>{dashboardInfo.ticketsBought}</h4>
                                    <p>Tickets Bought</p>
                                </div>
                            </Link>
                            <Link href={`${ApplicationRoutes.EventTickets}?t=1`} className={styles.kpi}>
                                <span><EventIcon /></span>
                                <div className={styles.content}>
                                    <h4>{dashboardInfo.ticketsSold}</h4>
                                    <p>Tickets Sold</p>
                                </div>
                            </Link>
                            <Link href={ApplicationRoutes.Wallet} className={styles.kpi}>
                                <span><EventIcon /></span>
                                <div className={styles.content}>
                                    <h4>&#8358;{dashboardInfo.totalRevenue.toLocaleString()}</h4>
                                    <p>Total Revenue</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                }
                {
                    isLoading &&
                    <div className={styles.loaderArea}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div>
                }

                <div className="flex flex-col items-start gap-4 mt-8 pb-10 md:pb-0 md:flex-row">
                    <div className={`${styles.activities} w-full md:basis-3/5`}>
                        <h3>Recent transactions&nbsp;
                            <select onChange={(e) => handleFetchUserRecentTransactions(e.target.value)}>
                                <option value="14">within the last 2 weeks</option>
                                <option value="30">within the last 1 month</option>
                                <option value="60">within the last 2 months</option>
                                <option value="90">within the last 3 months</option>
                            </select>
                        </h3>

                        <div className={styles.tableContainer}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Event name</th>
                                        <th>Order ID</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>

                                    {/* <tr>
                                <td>eventName</td>
                                <td>ticketName</td>
                                <td>&#8358;5,000</td>
                                <td>Mon 15th Jan, 2024 | 04:25pm</td>
                                <td>
                                    <span className={showTagStyle(OrderStatus.Pending)}>
                                        Pending
                                    </span>
                                </td>
                            </tr> */}
                                    {
                                        !isFetchingUserRecentTransactions && userRecentTransactions.map((userRecentTransaction, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{userRecentTransaction.eventName}</td>
                                                    <td>{userRecentTransaction.orderId}</td>
                                                    {
                                                        userRecentTransaction.amount == "0" ?
                                                            <td>Free</td> :
                                                            <td>&#8358;{Number(userRecentTransaction.amount).toLocaleString()}</td>
                                                    }
                                                    <td>{moment(userRecentTransaction.date).format("ddd Do MMM, YYYY | hh:mma")}</td>
                                                    <td>
                                                        <span className={showTagStyle(userRecentTransaction.status)}>
                                                            {serializeOrderStatus(userRecentTransaction.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            {
                                userRecentTransactions.length == 0 && !isFetchingUserRecentTransactions &&
                                <div className={styles.tableInfoUnavailable}>
                                    <p>There is no data available</p>
                                </div>
                            }
                            {
                                userRecentTransactions.length == 0 && isFetchingUserRecentTransactions &&
                                <div className={styles.tableLoader}>
                                    <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="w-full md:basis-2/5">
                        <div className="flex flex-row items-center justify-between mb-3">
                            <h3 className="text-white">Tickets Sold</h3>
                            <Link
                                href={`${ApplicationRoutes.EventTickets}?t=1`}
                                className="text-sm p-1 px-3 rounded-full bg-white/10 hover:bg-white/20">
                                See all
                            </Link>
                        </div>

                        <div className={styles.tableContainer}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Event name</th>
                                        <th>Tickets Sold</th>
                                        <th>Revenue</th>
                                        <th>Action</th>
                                    </tr>
                                    {
                                        !isFetchingTicketsSoldMetrics && ticketsSoldMetrics?.map((ticketsSoldMetric, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{ticketsSoldMetric.title}</td>
                                                    <td>{ticketsSoldMetric.totalTicketsSold}</td>
                                                    <td>&#8358;{ticketsSoldMetric.totalAmountPaid.toLocaleString()}</td>
                                                    <td>
                                                        <Link
                                                            className="text-primary-color p-2 px-3 rounded-full bg-primary-color/5 hover:bg-primary-color/20"
                                                            href={`${ApplicationRoutes.EventTickets}/${ticketsSoldMetric.id}`}>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            {
                                ticketsSoldMetrics.length == 0 && !isFetchingTicketsSoldMetrics &&
                                <div className={styles.tableInfoUnavailable}>
                                    <p>There is no data available</p>
                                </div>
                            }
                            {
                                ticketsSoldMetrics.length == 0 && isFetchingTicketsSoldMetrics &&
                                <div className={styles.tableLoader}>
                                    <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;