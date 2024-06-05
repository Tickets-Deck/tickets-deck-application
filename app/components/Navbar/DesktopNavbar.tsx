"use client"
import { FunctionComponent, ReactElement, useRef, useState } from "react";
import Link from 'next/link';
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import Image from 'next/image';
import images from "@/public/images";
import { CaretDownIcon, MoonIcon, SunIcon, UserIcon } from "../SVGs/SVGicons";
import { useDispatch } from 'react-redux';
import { signOut } from 'next-auth/react';
import { clearUserCredentials } from "@/app/redux/features/user/userSlice";
import styles from '@/app/styles/Navbar.module.scss';
import useOuterClick from "@/app/hooks/useOuterClick";
import { Session } from "next-auth";
import { Theme } from "@/app/enums/Theme";
import { updateAppTheme } from "@/app/redux/features/theme/themeSlice";

interface DesktopNavbarProps {
    isLightTheme: boolean
    appTheme: Theme | null
    session: Session | null
}

const DesktopNavbar: FunctionComponent<DesktopNavbarProps> = ({ isLightTheme, session, appTheme }): ReactElement => {
    const dispatch = useDispatch();
    const user = session?.user;

    const [navbarDropdownIsVisible, setNavbarDropdownIsVisible] = useState(false);

    const navbarDropdownRef = useRef<HTMLDivElement>(null);

    useOuterClick(navbarDropdownRef, setNavbarDropdownIsVisible);

    return (
        <section className={styles.navbarContainer}>
            <Link href={ApplicationRoutes.Home}>
                <div className={styles.navbarContainer__lhs}>
                    <div className={styles.logo}>
                        {appTheme === Theme.Light ? <Image src={images.logoPurple} alt='Logo' /> : <Image src={images.logoWhite} alt='Logo' />}
                    </div>
                    <p>Ticketsdeck Events</p>
                </div>
            </Link>
            <div className={styles.navbarContainer__rhs}>
                <ul className={styles.navLinks}>
                    <Link href={ApplicationRoutes.Home}>
                        <li>Home</li>
                    </Link>
                    <Link href={ApplicationRoutes.GeneralEvents}>
                        <li>Events</li>
                    </Link>
                    <Link href={ApplicationRoutes.About}>
                        <li>About</li>
                    </Link>
                    {/* <li>Support</li> */}
                </ul>
                <div className={styles.accountSection} ref={navbarDropdownRef} onClick={() => setNavbarDropdownIsVisible(!navbarDropdownIsVisible)}>
                    {
                        user ? <>
                            <div className={styles.profileCircle}>
                                {<Image src={user?.image ?? images.user_avatar} alt='Profile picture' fill /> ?? <UserIcon />}
                            </div>
                            <h3>{user?.name ?? 'Account'}</h3>
                            <span className={styles.dropdownIcon}>
                                <CaretDownIcon />
                            </span>
                            {
                                navbarDropdownIsVisible &&
                                <div className={styles.dropdownContainer}>
                                    <Link href={ApplicationRoutes.Dashboard}>Dashboard</Link>
                                    <Link href={ApplicationRoutes.Profile}>Profile</Link>
                                    <span onClick={() => {
                                        signOut();
                                        // Clear user credentials from redux store
                                        dispatch(clearUserCredentials());
                                    }}>Log out</span>
                                </div>
                            }
                        </>
                            : <Link href={ApplicationRoutes.SignIn}>
                                <button>
                                    Log in
                                </button>
                            </Link>
                    }
                </div>
                <span
                    className={styles.themeController}
                    onClick={() =>
                        dispatch(appTheme == Theme.Light ?
                            updateAppTheme(Theme.Dark) :
                            updateAppTheme(Theme.Light))}>
                    {appTheme === Theme.Light ? <MoonIcon /> : <SunIcon />}
                </span>
            </div>
        </section>
    );
}

export default DesktopNavbar;