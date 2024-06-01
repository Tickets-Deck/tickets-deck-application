"use client"
import { FunctionComponent, ReactElement, useState, useRef, useEffect } from 'react';
import styles from '../styles/Navbar.module.scss';
import Image from 'next/image';
import images from '../../public/images';
import { CaretDownIcon, CloseMenuIcon, HamburgerMenuIcon, MoonIcon, SunIcon, UserIcon } from './SVGs/SVGicons';
import useOuterClick from '../hooks/useOuterClick';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { WindowSizes } from '../constants/windowSizes';
import { signOut, useSession } from 'next-auth/react';
import useResponsiveness from '../hooks/useResponsiveness';
import { useDispatch } from 'react-redux';
import { clearUserCredentials } from '../redux/features/user/userSlice';
import { Session } from 'next-auth';
import { ApplicationRoutes } from '../constants/applicationRoutes';

interface NavbarProps {
    session: Session | null
}

const Navbar: FunctionComponent<NavbarProps> = (): ReactElement => {

    const { data: session } = useSession();
    const user = session?.user;
    const pathname = usePathname();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const dispatch = useDispatch();

    const [navbarDropdownIsVisible, setNavbarDropdownIsVisible] = useState(false);
    // const [mobileNavbarIsVisible, setMobileNavbarIsVisible] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);

    const navbarDropdownRef = useRef<HTMLDivElement>(null);

    useOuterClick(navbarDropdownRef, setNavbarDropdownIsVisible);

    const [navbarIsVisible, setNavbarIsVisible] = useState(false);

    const navbarRef = useRef<HTMLDivElement>(null);

    // useRemoveHtmlElementFromDOM(navbarRef, navbarIsVisible, 600, "flex");
    // console.log(user);

    // useEffect(() => {
    //     if(!session) {
    //         router.push('/auth/signin');
    //         return;
    //     }
    // }, [session])

    return (
        <>
            {
                onMobile &&
                <section className={styles.mobileNavbarContainer}>
                    <Link href={ApplicationRoutes.Home}>
                        <div className={styles.logo}>
                            <Image src={images.logoWhite} alt='Logo' />
                        </div>
                        <p>Ticketsdeck <br /> Events</p>
                    </Link>
                    <div className={styles.buttons}>
                        <span><SunIcon /></span>
                        <span onClick={() => setNavbarIsVisible(true)}><HamburgerMenuIcon /></span>
                    </div>
                    {navbarRef &&
                        <div className={navbarIsVisible ? styles.navbarOverlayContainer : styles.navbarOverlayContainerClose} ref={navbarRef}>
                            <span className={styles.overlay} onClick={() => setNavbarIsVisible(false)}></span>
                            <div className={styles.navbarOverlay}>
                                <span className={styles.closeIcon} onClick={() => setNavbarIsVisible(false)}><CloseMenuIcon /></span>
                                <div className={styles.navLinks}>
                                    <Link href={ApplicationRoutes.Home} onClick={() => setNavbarIsVisible(false)}>
                                        <span className={pathname == ApplicationRoutes.Home ? styles.active : ''}>Home</span>
                                    </Link>
                                    <Link href={ApplicationRoutes.GeneralEvents} onClick={() => setNavbarIsVisible(false)}>
                                        <span className={pathname == ApplicationRoutes.GeneralEvents ? styles.active : ''}>Events</span>
                                    </Link>
                                    <Link href={ApplicationRoutes.About} onClick={() => setNavbarIsVisible(false)}>
                                        <span className={pathname == ApplicationRoutes.About ? styles.active : ''}>About</span>
                                    </Link>
                                    {/* <Link href='/support' onClick={() => setNavbarIsVisible(false)}>
                                            <span className={pathname == '/support' ? styles.active : ''}>Support</span>
                                        </Link> */}
                                    {user ? <>
                                        <Link href={ApplicationRoutes.Dashboard} onClick={() => setNavbarIsVisible(false)}>
                                            <span className={pathname == ApplicationRoutes.Dashboard ? styles.active : ''}>Dashboard</span>
                                        </Link>
                                        {/* <Link href='/api/auth/logout'> */}
                                            <span
                                                onClick={() => {
                                                    setNavbarIsVisible(false);
                                                    signOut();
                                                    // Clear user credentials from redux store
                                                    dispatch(clearUserCredentials());
                                                }}>
                                                Log out
                                            </span>
                                        {/* </Link> */}
                                    </> :
                                        <Link href='/auth/signin' onClick={() => setNavbarIsVisible(false)}>
                                            <span className={pathname == '/account' ? styles.active : ''}>Login</span>
                                        </Link>}
                                </div>
                            </div>
                        </div>}
                </section>
            }
            {
                onDesktop &&
                <section className={styles.navbarContainer}>
                    <Link href={ApplicationRoutes.Home}>
                        <div className={styles.navbarContainer__lhs}>
                            <div className={styles.logo}>
                                <Image src={images.logoWhite} alt='Logo' />
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
                        <span className={styles.themeController}>
                            {isLightTheme ? <MoonIcon /> : <SunIcon />}
                        </span>
                    </div>
                </section>
            }
        </>
    );
}

export default Navbar;