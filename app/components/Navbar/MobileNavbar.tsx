"use client"
import Link from "next/link";
import { FunctionComponent, ReactElement, useRef, useState } from "react";
import styles from '@/app/styles/Navbar.module.scss';
import Image from "next/image";
import images from "@/public/images";
import { AboutIcon, CloseMenuIcon, ContactIcon, DashboardIcon, EventsIcon, HamburgerMenuIcon, HomeIcon, LoginIcon, LogoutIcon, MoonIcon, ProfileIcon, SunIcon } from "../SVGs/SVGicons";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Session } from "next-auth";
import { clearUserCredentials } from "@/app/redux/features/user/userSlice";
import { signOut } from 'next-auth/react';
import { motion } from "framer-motion";
import { Theme } from "@/app/enums/Theme";
import { updateAppTheme } from "@/app/redux/features/theme/themeSlice";
import { hideNavItemsVariant, liVariant, mobileMenuVariant, overlayVariant, profileVariant, ulVariant } from "@/app/animations/navbarAnimations";

interface MobileNavbarProps {
    session: Session | null
    appTheme: Theme | null
}

const MobileNavbar: FunctionComponent<MobileNavbarProps> = ({ appTheme, session }): ReactElement => {
    const dispatch = useDispatch();
    const user = session?.user;

    const pathname = usePathname();
    const [navbarIsVisible, setNavbarIsVisible] = useState(false);

    const fadeInStart = { opacity: 0 }
    const fadeInEnd = { opacity: 1 }
    const fadeInTransition = { duration: 1 }

    const navLinks = [
        {
            link: ApplicationRoutes.Home,
            text: "Home",
            icon: <HomeIcon />
        },
        {
            link: ApplicationRoutes.GeneralEvents,
            text: "Events",
            icon: <EventsIcon />
        },
        {
            link: ApplicationRoutes.About,
            text: "About Us",
            icon: <AboutIcon />
        },
        {
            link: ApplicationRoutes.Contact,
            text: "Contact Us",
            icon: <ContactIcon />
        }
    ];

    return (
        <motion.section
            initial="closed"
            animate={navbarIsVisible ? "opened" : "closed"}
            className={styles.mobileNavbarContainer}>
            <Link href={ApplicationRoutes.Home}>
                <div className={styles.logo}>
                    <Image src={images.logoWhite} alt='Logo' />
                </div>
                <p>Ticketsdeck <br /> Events</p>
            </Link>
            <motion.div variants={hideNavItemsVariant} className={styles.menuItems}>
                {/* <span onClick={() => dispatch(appTheme == Theme.Light ? updateAppTheme(Theme.Dark) : updateAppTheme(Theme.Light))}>
                    {appTheme === Theme.Light ? <MoonIcon /> : <SunIcon />}
                </span> */}
                {
                    user &&
                    <Link href={ApplicationRoutes.Profile} className={styles.profilePhoto}>
                        <Image src={user?.image ?? images.user_avatar} alt="Profile photo" fill sizes="auto" />
                    </Link>
                }
                <span onClick={() => setNavbarIsVisible(true)}><HamburgerMenuIcon /></span>
            </motion.div>

            <div className={styles.navbarOverlayContainer} style={navbarIsVisible ? {} : { pointerEvents: 'none' }}>
                <motion.span
                    variants={overlayVariant}
                    className={styles.overlay}
                    onClick={() => setNavbarIsVisible(false)}>
                </motion.span>

                <motion.div variants={mobileMenuVariant({direction: "fromRight"})} className={styles.navbarOverlay}>
                    <div className={styles.topArea}>
                        {
                            user &&
                            <motion.div variants={profileVariant} className={styles.profileArea}>
                                <span className={styles.userImage}>
                                    <Image src={user.image ?? images.user_avatar} alt="Profile image" fill sizes="auto" />
                                </span>
                                <div className={styles.userInfo}>
                                    <h4>{user.name}</h4>
                                    <Link href={ApplicationRoutes.Profile} onClick={() => setNavbarIsVisible(false)}>
                                        View profile
                                    </Link>
                                </div>
                            </motion.div>
                        }
                        <span className={styles.closeIcon} onClick={() => setNavbarIsVisible(false)}><CloseMenuIcon /></span>
                    </div>

                    <motion.div variants={ulVariant} className={styles.navLinks}>
                        {
                            navLinks.map((navLink, index) => (
                                <Link key={index} href={navLink.link} onClick={() => setNavbarIsVisible(false)}>
                                    <motion.span variants={liVariant} className={pathname == navLink.link ? styles.active : ''} key={index}>
                                        {navLink.icon}
                                        {navLink.text}
                                    </motion.span>
                                </Link>
                            ))
                        }
                        {user ?
                            <>
                                {/* <Link href={ApplicationRoutes.Dashboard} onClick={() => setNavbarIsVisible(false)}>
                                    <span className={pathname == ApplicationRoutes.Dashboard ? styles.active : ''}>
                                        <DashboardIcon />
                                        Dashboard
                                    </span>
                                </Link> */}
                                <motion.button
                                    variants={liVariant}
                                    className={styles.logoutBtn}
                                    onClick={() => {
                                        setNavbarIsVisible(false);
                                        signOut();
                                        // Clear user credentials from redux store
                                        dispatch(clearUserCredentials());
                                    }}>
                                    <LogoutIcon />
                                    Log out
                                </motion.button>
                            </> :
                            <motion.a
                                variants={liVariant}
                                className={styles.loginBtn}
                                href='/auth/signin'
                                onClick={() => setNavbarIsVisible(false)}>
                                <LoginIcon />
                                Login
                            </motion.a>
                        }
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}

export default MobileNavbar;