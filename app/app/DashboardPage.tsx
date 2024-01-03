"use client"
import { ReactElement, FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { EventIcon } from "../components/SVGs/SVGicons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

    const { data: session } = useSession();
    const user = session?.user;
    const { push, prefetch } = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     if (!session) {
    //         push('/auth/signin');
    //     }
    // }, [session])

    return (
        <div className={styles.dashboard}>
            <div className={styles.topArea}>
                <h3>Dashboard</h3>
                <Link href="/app/event/create">
                    <button>New Event</button>
                </Link>
            </div>

            <div className={styles.kpiSection}>
                <div className={styles.kpi}>
                    <span><EventIcon /></span>
                    <div className={styles.content}>
                        <h4>12</h4>
                        <p>Total Events</p>
                    </div>
                </div>
                <div className={styles.kpi}>
                    <span><EventIcon /></span>
                    <div className={styles.content}>
                        <h4>120</h4>
                        <p>Tickets Bought</p>
                    </div>
                </div>
                <div className={styles.kpi}>
                    <span><EventIcon /></span>
                    <div className={styles.content}>
                        <h4>120</h4>
                        <p>Tickets Sold</p>
                    </div>
                </div>
                <div className={styles.kpi}>
                    <span><EventIcon /></span>
                    <div className={styles.content}>
                        <h4>$1200</h4>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;