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
import KpiSection from "../components/UserConsole/DashboardPage/KpiSection";
import RecentTransactions from "../components/UserConsole/DashboardPage/RecentTransactions";
import TicketsSold from "../components/UserConsole/DashboardPage/TicketsSold";

interface DashboardPageProps {
}

const DashboardPage: FunctionComponent<DashboardPageProps> = (): ReactElement => {

    const fetchDashboardInfo = useFetchDashboardInfo();
    const fetchTicketsSoldMetrics = useFetchTicketsSoldMetrics();

    const { data: session, status } = useSession();
    const user = session?.user;
    const { push } = useRouter();

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);

    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoResponse>();
    const [isLoading, setIsLoading] = useState(true);
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

    async function handleFetchTicketsSoldMetrics() {

        // show loader
        setIsFetchingTicketsSoldMetrics(true);

        await fetchTicketsSoldMetrics(user?.id as string)
            .then((response) => {
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
            // handleFetchUserRecentTransactions("14"); // set to fetch transactions within the last 2 weeks by default
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

                        <KpiSection
                            dashboardInfo={dashboardInfo}
                        />
                    </div>
                }
                {
                    isLoading &&
                    <div className={styles.loaderArea}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div>
                }

                <div className="flex flex-col items-start gap-4 mt-8 pb-10 md:pb-0 md:flex-row">
                    <RecentTransactions
                        session={session}
                    />

                    <TicketsSold
                        isFetchingTicketsSoldMetrics={isFetchingTicketsSoldMetrics}
                        ticketsSoldMetrics={ticketsSoldMetrics}
                    />
                </div>
            </div>
        </>
    );
}

export default DashboardPage;