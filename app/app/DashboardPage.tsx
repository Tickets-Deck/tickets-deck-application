"use client"
import { ReactElement, FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { EventIcon } from "../components/SVGs/SVGicons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetchDashboardInfo } from "../api/apiClient";
import { DashboardInfoResponse } from "../models/IDashboardInfoResponse";
import { catchError } from "../constants/catchError";
import ComponentLoader from "../components/Loader/ComponentLoader";

interface DashboardPageProps {
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

//     // Get session
//     const session = await getServerSession(req, res, {});

//     console.log({session});

//     // If session is null...
//     if (!session) {
//         // Redirect
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: '/auth/signin'
//             }
//         }
//     }

//     return {
//         props: {}
//     };
// }

const DashboardPage: FunctionComponent<DashboardPageProps> = (): ReactElement => {

    const fetchDashboardInfo = useFetchDashboardInfo();
    const { data: session, status } = useSession();
    const user = session?.user;
    const { push } = useRouter();

    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoResponse>();
    const [isLoading, setIsLoading] = useState(true);

    async function handleFetchDashboardInfo() {
        // Start loader
        setIsLoading(true);
        try {
            const response = await fetchDashboardInfo(user?.id as string);
            setDashboardInfo(response.data);
        } catch (error) {
            catchError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            handleFetchDashboardInfo();
        }
    }, [user]);

    useEffect(() => {
        if (status === "unauthenticated") {
            push("/auth/signin");
        }
    }, [status]);

    return (
        <div className={styles.dashboard}>
            <div className={styles.topArea}>
                <h3>Dashboard</h3>
                <Link href="/app/event/create">
                    <button>New Event</button>
                </Link>
            </div>

            {
                !isLoading && dashboardInfo && 
                <div className={styles.kpiSection}>
                    <Link href="/app/events" className={styles.kpi}>
                        <span><EventIcon /></span>
                        <div className={styles.content}>
                            <h4>{dashboardInfo.totalEvents}</h4>
                            <p>Total {dashboardInfo.totalEvents > 1 ? "Events" : "Event"}</p>
                        </div>
                    </Link>
                    <Link href="/app/tickets?t=0" className={styles.kpi}>
                        <span><EventIcon /></span>
                        <div className={styles.content}>
                            <h4>{dashboardInfo.ticketsBought}</h4>
                            <p>Tickets Bought</p>
                        </div>
                    </Link>
                    <Link href="/app/tickets?t=1" className={styles.kpi}>
                        <span><EventIcon /></span>
                        <div className={styles.content}>
                            <h4>{dashboardInfo.ticketsSold}</h4>
                            <p>Tickets Sold</p>
                        </div>
                    </Link>
                    <Link href="/wallet" className={styles.kpi}>
                        <span><EventIcon /></span>
                        <div className={styles.content}>
                            <h4>&#8358;{dashboardInfo.totalRevenue.toLocaleString()}</h4>
                            <p>Total Revenue</p>
                        </div>
                    </Link>
                </div>
            }
            {
                isLoading &&
                <div className={styles.loaderArea}>
                    <ComponentLoader customLoaderColor="#fff" />
                </div>
            }
        </div>
    );
}

export default DashboardPage;