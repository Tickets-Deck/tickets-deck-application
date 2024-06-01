"use client"
import Link from "next/link";
import { FunctionComponent, ReactElement, useRef, useState } from "react";
import styles from '@/app/styles/Navbar.module.scss';
import Image from "next/image";
import images from "@/public/images";
import { AboutIcon, CloseMenuIcon, ContactIcon, DashboardIcon, EventsIcon, HamburgerMenuIcon, HomeIcon, LoginIcon, LogoutIcon, ProfileIcon, SunIcon } from "../SVGs/SVGicons";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Session } from "next-auth";
import { clearUserCredentials } from "@/app/redux/features/user/userSlice";
import { signOut } from 'next-auth/react';
import { motion } from "framer-motion";

interface MobileNavbarProps {
    session: Session | null
}

const MobileNavbar: FunctionComponent<MobileNavbarProps> = ({ session }): ReactElement => {
    const dispatch = useDispatch();
    const user = session?.user;

    const pathname = usePathname();
    const [navbarIsVisible, setNavbarIsVisible] = useState(false);


    const hideNavItemsVariant = {
        opened: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.35,
                ease: "easeInOut"
            }
        },
        closed: {
            opacity: 1,
            y: "0%",
            transition: {
                delay: 0.5,
                duration: 0.35,
                ease: "easeInOut"
            }
        }
    }

    const mobileMenuVariant = {
        opened: {
            x: "0%",
            transition: {
                delay: 0.4,
                duration: 0.5,
                ease: [0.74, 0, 0.19, 1.02]
            }
        },
        closed: {
            x: "100%",
            transition: {
                delay: 0.35,
                duration: 0.63,
                ease: [0.74, 0, 0.19, 1.02]
            }
        }
    }

    const overlayVariant = {
        opened: {
            opacity: 1,
            x: "0%",
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        },
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                delay: 0.8,
                duration: 0.35,
                ease: "easeInOut"
            }
        }
    }

    const fadeInVariant = {
        opened: {
            opacity: 1,
            transition: {
                delay: 1.2
            }
        },
        closed: { opacity: 0 }
    }

    const ulVariant = {
        opened: {
            transition: {
                delayChildren: 1,
                staggerChildren: 0.18
            }
        },
        closed: {
            transition: {
                staggerChildren: 0.06,
                staggerDirection: -1
            }
        }
    }

    const liVariant = {
        opened: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        closed: {
            opacity: 0,
            y: "100%",
            transition: {
                duration: 0.25,
                ease: "easeInOut"
            }
        }
    }

    const profileVariant = {
        opened: {
            opacity: 1,
            x: "0%",
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        closed: {
            opacity: 0,
            x: "50%",
            transition: {
                duration: 0.25,
                ease: "easeInOut"
            }
        }
    }

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
            <motion.div variants={hideNavItemsVariant} className={styles.buttons}>
                <span><SunIcon /></span>
                <span onClick={() => setNavbarIsVisible(true)}><HamburgerMenuIcon /></span>
            </motion.div>

            <div className={styles.navbarOverlayContainer} style={navbarIsVisible ? {} : { pointerEvents: 'none' }}>
                <motion.span
                    variants={overlayVariant}
                    className={styles.overlay}
                    onClick={() => setNavbarIsVisible(false)}>
                </motion.span>

                <motion.div variants={mobileMenuVariant} className={styles.navbarOverlay}>
                    <div className={styles.topArea}>
                        {
                            user &&
                            <motion.div variants={profileVariant} className={styles.profileArea}>
                                <span className={styles.userImage}>
                                    <Image src={user.image ?? images.user_avatar} alt="Profile image" fill sizes="auto" />
                                </span>
                                <div className={styles.userInfo}>
                                    <h4>{user.name}</h4>
                                    <Link href="/app" onClick={() => setNavbarIsVisible(false)}>
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
                                <Link key={index} href={navLink.link}>
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