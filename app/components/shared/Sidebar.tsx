"use client"
import { CSSProperties, Dispatch, FunctionComponent, ReactElement, SetStateAction, useState } from "react";
import styles from "../../styles/ConsoleSidebar.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { motion } from "framer-motion";
import { mobileMenuVariant } from "@/app/animations/navbarAnimations";
import { Icons } from "../ui/icons";

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
    const currentPageIsFavorites = pathname.includes(ApplicationRoutes.FavouriteEvents);

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
        <motion.div
            initial="closed"
            variants={onMobile ? mobileMenuVariant({direction: "fromRight", inDelay: 0, outDelay: 0.1}) : undefined}
            animate={isMobileSidebarOpen ? "opened" : "closed"}
            className={styles.sidebar}>
            <div className={styles.sidebar__menu}>
                <ul>
                    <ReusableLink
                        route={ApplicationRoutes.Dashboard}
                        currentPageChecker={currentPageIsDashboard}
                        text="Dashboard"
                        icon={<Icons.Dashboard />}
                    />
                    <li
                        className={(currentPageIsEvents || currentPageIsCreateEvent || currentPageIsEditEvent) ? styles.active : ''}
                        onClick={() => setEventsSubLinksIsOpen(!eventsSubLinksIsOpen)}>
                        <Icons.Event /> Events <span className={eventsSubLinksIsOpen ? styles.active : ''}><Icons.CaretRight /></span>
                    </li>
                    <div className={`${styles.subLinks} ${eventsSubLinksIsOpen ? styles.subLinkContainerIsOpen : ''}`} style={{ '--multiplicant-value': `${3.1}` } as CSSProperties}>

                        <ReusableLink
                            route={ApplicationRoutes.Events}
                            currentPageChecker={currentPageIsEvents}
                            text="My Events"
                            icon={<Icons.Event />}
                        />
                        <ReusableLink
                            route={ApplicationRoutes.FavouriteEvents}
                            currentPageChecker={currentPageIsFavorites}
                            text="My Favorites"
                            icon={<Icons.Event />}
                        />
                        <ReusableLink
                            route={ApplicationRoutes.CreateEvent}
                            currentPageChecker={currentPageIsCreateEvent}
                            text="Create Event"
                            icon={<Icons.AddEvent />}
                        />
                    </div>

                    <ReusableLink
                        route={ApplicationRoutes.Wallet}
                        currentPageChecker={currentPageIsWallet}
                        text="Wallet"
                        icon={<Icons.Wallet />}
                    />
                    <ReusableLink
                        route={ApplicationRoutes.Profile}
                        currentPageChecker={currentPageIsProfile}
                        text="Profile"
                        icon={<Icons.Profile />}
                    />
                    <li
                        className={styles.logoutBtn} onClick={() => {
                            signOut();
                            closeSidebar();
                        }}>
                        <Icons.Logout /> Logout
                    </li>
                </ul>
            </div>
        </motion.div>
    );
}

export default Sidebar;