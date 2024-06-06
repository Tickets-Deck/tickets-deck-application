"use client"
import { CSSProperties, Dispatch, FunctionComponent, ReactElement, SetStateAction, useState } from "react";
import styles from "../../styles/ConsoleSidebar.module.scss";
import { AddEventIcon, CaretRightIcon, DashboardIcon, EventIcon, LogoutIcon, OrderIcon, ProfileIcon, WalletIcon } from "../SVGs/SVGicons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface SidebarProps {
    isMobileSidebarOpen: boolean;
    setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>
}

interface ReusableLinkProps {
    route: ApplicationRoutes, currentPageChecker: boolean, text: string, icon: ReactElement
}

const Sidebar: FunctionComponent<SidebarProps> = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }): ReactElement => {

    const pathname = usePathname();
    const [eventsSubLinksIsOpen, setEventsSubLinksIsOpen] = useState(false);

    const currentPageIsDashboard = pathname == ApplicationRoutes.Dashboard;
    const currentPageIsEvents = pathname == ApplicationRoutes.Events;
    const currentPageIsCreateEvent = pathname == ApplicationRoutes.CreateEvent;
    const currentPageIsEditEvent = pathname.startsWith(ApplicationRoutes.EditEvent);
    const currentPageIsProfile = pathname.includes(ApplicationRoutes.Profile);
    const currentPageIsWallet = pathname.includes(ApplicationRoutes.Wallet);

    function closeSidebar() {
        if (isMobileSidebarOpen) {
            setIsMobileSidebarOpen(false);
        };
    }

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    function ReusableLink({ route, currentPageChecker, text, icon }: ReusableLinkProps) {
        return (
            <Link href={route} onClick={closeSidebar}>
                <li className={currentPageChecker ? styles.active : ''}>{icon} {text}</li>
            </Link>
        )
    }

    return (
        <div className={onMobile ? isMobileSidebarOpen ? styles.sidebarOpen : styles.sidebarClose : styles.sidebar}>
            <div className={styles.sidebar__menu}>
                <ul>
                    <ReusableLink
                        route={ApplicationRoutes.Dashboard}
                        currentPageChecker={currentPageIsDashboard}
                        text="Dashboard"
                        icon={<DashboardIcon />}
                    />
                    <li
                        className={(currentPageIsEvents || currentPageIsCreateEvent || currentPageIsEditEvent) ? styles.active : ''}
                        onClick={() => setEventsSubLinksIsOpen(!eventsSubLinksIsOpen)}>
                        <EventIcon /> Events <span className={eventsSubLinksIsOpen ? styles.active : ''}><CaretRightIcon /></span>
                    </li>
                    <div className={`${styles.subLinks} ${eventsSubLinksIsOpen ? styles.subLinkContainerIsOpen : ''}`} style={{ '--multiplicant-value': `${2.1}` } as CSSProperties}>

                        <ReusableLink
                            route={ApplicationRoutes.Events}
                            currentPageChecker={currentPageIsEvents}
                            text="My Events"
                            icon={<EventIcon />}
                        />
                        <ReusableLink
                            route={ApplicationRoutes.CreateEvent}
                            currentPageChecker={currentPageIsCreateEvent}
                            text="Create Event"
                            icon={<AddEventIcon />}
                        />
                    </div>

                    <ReusableLink
                        route={ApplicationRoutes.Wallet}
                        currentPageChecker={currentPageIsWallet}
                        text="Wallet"
                        icon={<WalletIcon />}
                    />
                    <ReusableLink
                        route={ApplicationRoutes.Profile}
                        currentPageChecker={currentPageIsProfile}
                        text="Profile"
                        icon={<ProfileIcon />}
                    />
                    <li
                        className={styles.logoutBtn} onClick={() => {
                            signOut();
                            closeSidebar();
                        }}>
                        <LogoutIcon /> Logout
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;