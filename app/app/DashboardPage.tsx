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
import { ApplicationRoutes } from "../constants/applicationRoutes";

interface DashboardPageProps {
}

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

    useEffect(() => {
        if (user) {
            handleFetchDashboardInfo();
        }
    }, [user]);

    useEffect(() => {
        if (status === "unauthenticated") {
            push(ApplicationRoutes.SignIn);
        }
    }, [status]);

    return (
        <div className={styles.dashboard}>
            <div className={styles.topArea}>
                <h3>Dashboard</h3>
                <Link href={ApplicationRoutes.CreateEvent}>
                    <button>New Event</button>
                </Link>
            </div>

            {
                !isLoading && dashboardInfo &&
                <div className={styles.kpiSection}>
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