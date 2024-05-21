"use client"
import { CSSProperties, FunctionComponent, ReactElement, useState } from "react";
import styles from "../../styles/ConsoleSidebar.module.scss";
import { AddEventIcon, CaretRightIcon, DashboardIcon, EventIcon, LogoutIcon, OrderIcon, ProfileIcon, WalletIcon } from "../SVGs/SVGicons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface SidebarProps {
    isMobileSidebarOpen: boolean;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ isMobileSidebarOpen }): ReactElement => {

    const pathname = usePathname();
    const [eventsSubLinksIsOpen, setEventsSubLinksIsOpen] = useState(false);

    const currentPageIsDashboard = pathname == ApplicationRoutes.Dashboard;
    const currentPageIsEvents = pathname == ApplicationRoutes.Events;
    const currentPageIsCreateEvent = pathname == ApplicationRoutes.CreateEvent;
    const currentPageIsEditEvent = pathname.startsWith(ApplicationRoutes.EditEvent);
    const currentPageIsProfile = pathname.includes(ApplicationRoutes.Profile);
    const currentPageIsWallet = pathname.includes(ApplicationRoutes.Wallet);

    
    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    return (
        <div className={onMobile ? isMobileSidebarOpen ? styles.sidebarOpen : styles.sidebarClose : styles.sidebar}>
            <div className={styles.sidebar__menu}>
                <ul>
                    <Link href={ApplicationRoutes.Dashboard}>
                        <li className={currentPageIsDashboard ? styles.active : ''}><DashboardIcon /> Dashboard</li>
                    </Link>
                    <li className={(currentPageIsEvents || currentPageIsCreateEvent || currentPageIsEditEvent) ? styles.active : ''} onClick={() => setEventsSubLinksIsOpen(!eventsSubLinksIsOpen)}>
                        <EventIcon /> Events <span className={eventsSubLinksIsOpen ? styles.active : ''}><CaretRightIcon /></span>
                    </li>
                    <div
                        className={`${styles.subLinks} ${eventsSubLinksIsOpen ? styles.subLinkContainerIsOpen : ''}`}
                        style={{ '--multiplicant-value': `${2.1}` } as CSSProperties}>
                        <Link href={ApplicationRoutes.Events}>
                            <li className={currentPageIsEvents ? styles.active : ''}><EventIcon /> My Events</li>
                        </Link>
                        <Link href={ApplicationRoutes.CreateEvent}>
                            <li className={currentPageIsCreateEvent ? styles.active : ''}><AddEventIcon /> Create Event</li>
                        </Link>
                    </div>
                    {/* <Link href="/app/orders">
                        <li className={currentPageIsOrder ? styles.active : ''}><OrderIcon /> Orders</li>
                    </Link> */}
                    <Link href={ApplicationRoutes.Wallet}>
                        <li className={currentPageIsWallet ? styles.active : ''}><WalletIcon /> Wallet</li>
                    </Link>
                    <Link href={ApplicationRoutes.Profile}>
                        <li className={currentPageIsProfile ? styles.active : ''}><ProfileIcon /> Profile</li>
                    </Link>
                    <li onClick={() => signOut()}><LogoutIcon /> Logout</li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;