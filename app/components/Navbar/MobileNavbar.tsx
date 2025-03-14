"use client";
import Link from "next/link";
import { FunctionComponent, ReactElement, useRef, useState } from "react";
import Image from "next/image";
import images from "@/public/images";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "next-auth";
import { clearUserCredentials } from "@/app/redux/features/user/userSlice";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Theme } from "@/app/enums/Theme";
import {
    hideNavItemsVariant,
    liVariant,
    mobileMenuVariant,
    overlayVariant,
    profileVariant,
    ulVariant,
} from "@/app/animations/navbarAnimations";
import { Icons } from "../ui/icons";
import { RootState } from "@/app/redux/store";

interface MobileNavbarProps {
}

const MobileNavbar: FunctionComponent<MobileNavbarProps> = ({}): ReactElement => {
    const dispatch = useDispatch();

    const userInfo = useSelector(
        (state: RootState) => state.userCredentials.userInfo
    );

    const pathname = usePathname();
    const [navbarIsVisible, setNavbarIsVisible] = useState(false);

    const fadeInStart = { opacity: 0 };
    const fadeInEnd = { opacity: 1 };
    const fadeInTransition = { duration: 1 };

    const navLinks = [
        {
            link: ApplicationRoutes.Home,
            text: "Home",
            icon: Icons.Home,
        },
        {
            link: ApplicationRoutes.GeneralEvents,
            text: "Events",
            icon: Icons.Events,
        },
        {
            link: ApplicationRoutes.About,
            text: "About Us",
            icon: Icons.About,
        },
        {
            link: ApplicationRoutes.Contact,
            text: "Contact Us",
            icon: Icons.Contact,
        },
    ];

    return (
        <motion.section
            initial='closed'
            animate={navbarIsVisible ? "opened" : "closed"}
            className='sectionPadding flex items-center justify-between bg-dark-grey [&_a]:flex [&_a]:items-center'
        >
            <Link href={ApplicationRoutes.Home}>
                <div className='size-8 mr-2'>
                    <Image src={images.logoWhite} alt='Logo' />
                </div>
                <p className='text-white text-xs'>
                    Ticketsdeck <br /> Events
                </p>
            </Link>
            <motion.div
                variants={hideNavItemsVariant}
                className='flex items-center gap-[0.85rem]'
            >
                {/* <span onClick={() => dispatch(appTheme == Theme.Light ? updateAppTheme(Theme.Dark) : updateAppTheme(Theme.Light))}>
                    {appTheme === Theme.Light ? <MoonIcon /> : <SunIcon />}
                </span> */}
                {userInfo && (
                    <Link
                        href={ApplicationRoutes.Dashboard}
                        className='size-10 rounded-full overflow-hidden hidden relative border-[1.5px] border-primary-color-sub hover:scale-[0.85] hover:opacity-80'
                    >
                        <Image
                            src={userInfo.profilePhoto ?? images.user_avatar}
                            className='size-full object-cover'
                            alt='Profile photo'
                            fill
                            sizes='auto'
                        />
                    </Link>
                )}
                <span
                    className='size-10 rounded-[0.625rem] bg-white/10 grid place-items-center cursor-pointer hover:scale-[0.85]'
                    onClick={() => setNavbarIsVisible(true)}
                >
                    <Icons.HamburgerMenu className='size-6' />
                </span>
            </motion.div>

            <div
                className='fixed top-0 right-0 w-screen h-screen flex flex-col items-end z-[999]'
                style={navbarIsVisible ? {} : { pointerEvents: "none" }}
            >
                <motion.span
                    variants={overlayVariant}
                    className='absolute bg-dark-grey/90 z-[1] size-full top-0 right-0'
                    onClick={() => setNavbarIsVisible(false)}
                ></motion.span>

                <motion.div
                    variants={mobileMenuVariant({ direction: "fromRight" })}
                    className='bg-white backdrop-blur-[10px] w-[80%] h-full mx-0 my-auto p-5 flex flex-col z-[2]'
                >
                    <div className='flex items-center justify-between mb-10'>
                        {userInfo && (
                            <motion.div
                                variants={profileVariant}
                                className='flex items-center gap-2 w-full'
                            >
                                <span className='size-[56px] block rounded-full overflow-hidden relative'>
                                    <Image
                                        className='size-full object-cover'
                                        src={userInfo.profilePhoto ?? images.user_avatar}
                                        alt='Profile image'
                                        fill
                                        sizes='auto'
                                    />
                                </span>
                                <div className='flex flex-col w-full'>
                                    <h4 className='text-base font-medium text-dark-grey mb-1 max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis'>
                                        {userInfo.firstName ?? "Account"}
                                    </h4>
                                    <Link
                                        className='text-xs text-primary-color bg-white w-fit'
                                        href={ApplicationRoutes.Dashboard}
                                        onClick={() => setNavbarIsVisible(false)}
                                    >
                                        View dashboard
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                        <span
                            className='ml-auto size-10 rounded-lg grid place-items-center bg-primary-color/5 hover:scale[0.85]'
                            onClick={() => setNavbarIsVisible(false)}
                        >
                            <Icons.CloseMenu className='size-[1.65rem] [&_path]:fill-primary-color' />
                        </span>
                    </div>

                    <motion.div
                        variants={ulVariant}
                        className='flex flex-col gap-6 h-full'
                    >
                        {navLinks.map((navLink, index) => (
                            <Link
                                key={index}
                                href={navLink.link}
                                onClick={() => setNavbarIsVisible(false)}
                            >
                                <motion.span
                                    variants={liVariant}
                                    className='navLink text-black hover:text-primary-color hover:bg-primary-color/5 rounded-lg group'
                                    // className={pathname == navLink.link ? styles.active : ""}
                                    key={index}
                                >
                                    <navLink.icon className='group-hover:*:fill-primary-color' />
                                    {navLink.text}
                                </motion.span>
                            </Link>
                        ))}
                        {userInfo ? (
                            <>
                                {/* <Link href={ApplicationRoutes.Dashboard} onClick={() => setNavbarIsVisible(false)}>
                                    <span className={pathname == ApplicationRoutes.Dashboard ? styles.active : ''}>
                                        <DashboardIcon />
                                        Dashboard
                                    </span>
                                </Link> */}
                                <motion.button
                                    variants={liVariant}
                                    className='navLink bg-failed-color/0 text-failed-color'
                                    onClick={() => {
                                        setNavbarIsVisible(false);
                                        signOut();
                                        // Clear user credentials from redux store
                                        dispatch(clearUserCredentials());
                                    }}
                                >
                                    <Icons.Logout className='*:stroke-failed-color' />
                                    Log out
                                </motion.button>
                            </>
                        ) : (
                            <motion.a
                                variants={liVariant}
                                className='navLink bg-primary-color/5 text-primary-color'
                                href='/auth/signin'
                                onClick={() => setNavbarIsVisible(false)}
                            >
                                <Icons.Login className='*:stroke-primary-color border' />
                                Login
                            </motion.a>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default MobileNavbar;
