"use client";
import { FunctionComponent, ReactElement, useRef, useState } from "react";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import Image from "next/image";
import images from "@/public/images";
import { CaretDownIcon } from "../ui/icons";
import { useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { clearUserCredentials } from "@/app/redux/features/user/userSlice";
import useOuterClick from "@/app/hooks/useOuterClick";
import { Session } from "next-auth";
import { Theme } from "@/app/enums/Theme";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface DesktopNavbarProps {
    isLightTheme: boolean;
    appTheme: Theme | null;
    session: Session | null;
}

const DesktopNavbar: FunctionComponent<DesktopNavbarProps> = ({ session, appTheme }): ReactElement => {
    const dispatch = useDispatch();

    const userInfo = useSelector(
        (state: RootState) => state.userCredentials.userInfo
    );

    const [navbarDropdownIsVisible, setNavbarDropdownIsVisible] = useState(false);

    const navbarDropdownRef = useRef<HTMLDivElement>(null);

    useOuterClick(navbarDropdownRef, setNavbarDropdownIsVisible);

    return (
        <section className='bg-dark-grey flex items-center justify-between sectionPadding'>
            <Link href={ApplicationRoutes.Home}>
                <div className='flex items-center gap-1 '>
                    <div className='h-[1.875rem]'>
                        {appTheme === Theme.Light ? (
                            <Image
                                src={images.logoPurple}
                                alt='Logo'
                                className='h-full w-full object-contain'
                            />
                        ) : (
                            <Image
                                src={images.logoWhite}
                                alt='Logo'
                                className='h-full w-full object-contain'
                            />
                        )}
                    </div>
                    <p className='text-white text-sm font-[300]'>Ticketsdeck Events</p>
                </div>
            </Link>
            <div className='flex items-center gap-6 text-white text-sm'>
                <ul className='border-r pr-6 border-grey list-none flex items-center gap-4 cursor-pointer'>
                    <Link href={ApplicationRoutes.Home}>
                        <li className='hover:text-primary-color-sub'>Home</li>
                    </Link>
                    <Link href={ApplicationRoutes.GeneralEvents}>
                        <li className='hover:text-primary-color-sub'>Events</li>
                    </Link>
                    <Link href={ApplicationRoutes.About}>
                        <li className='hover:text-primary-color-sub'>About</li>
                    </Link>
                    <Link href={ApplicationRoutes.Contact}>
                        <li className='hover:text-primary-color-sub'>Contact</li>
                    </Link>
                </ul>
                <div
                    className='flex group items-center relative cursor-pointer gap-2'
                    ref={navbarDropdownRef}
                    onClick={() => setNavbarDropdownIsVisible(!navbarDropdownIsVisible)}
                >
                    {userInfo ? (
                        <>
                            <div className='size-8 border border-grey/10 grid place-items-center rounded-full relative overflow-hidden [&_img]:size-full [&_img]:object-cover [&_svg]:size-[0.85rem]'>
                                {
                                    <Image
                                        src={userInfo.profilePhoto || images.user_avatar}
                                        alt='Profile picture'
                                        fill
                                        sizes='auto'
                                    />
                                }
                            </div>
                            <h3 className='font-medium text-sm text-primary-color-sub max-w-[90px] text-ellipsis overflow-hidden whitespace-nowrap'>
                                {userInfo.firstName ?? "Account"}
                            </h3>
                            <span className='size-6 grid place-items-center rounded-lg group-hover:bg-white/10'>
                                <CaretDownIcon className='size-4 [&_path]:fill-primary-color-sub text-white' />
                            </span>
                            {navbarDropdownIsVisible && (
                                <div className='bg-white p-1 rounded-lg flex flex-col absolute top-[2.813rem] -right-[0.688rem] w-[90%] max-w-32 shadow-[0rem_0.25rem_0.5rem_0.063rem_rgba(0,0,0,0.04)] z-[3] animate-bumpDown after:size-[0.875rem] after:bg-white after:rotate-45 after:absolute after:top[-0.375rem] after:right-4 after:rounded-[0.188rem]'>
                                    <Link
                                        className='py-2 px-3 text-black rounded-[0.375rem] hover:bg-grey/80'
                                        href={ApplicationRoutes.Dashboard}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        className='py-2 px-3 text-black rounded-[0.375rem] hover:bg-grey/80'
                                        href={ApplicationRoutes.Profile}
                                    >
                                        Profile
                                    </Link>
                                    <span
                                        className='py-2 px-3 text-black rounded-[0.375rem] hover:bg-grey/80'
                                        onClick={() => {
                                            signOut();
                                            // Clear user credentials from redux store
                                            dispatch(clearUserCredentials());
                                        }}
                                    >
                                        Log out
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link href={ApplicationRoutes.SignIn}>
                            <button className='primaryButton !py-2 !bg-white hover:!bg-transparent !text-dark-grey hover:bg-dark-grey hover:!text-white'>
                                Log in
                            </button>
                        </Link>
                    )}
                </div>
                {/* <span
                    className={styles.themeController}
                    onClick={() =>
                        dispatch(appTheme == Theme.Light ?
                            updateAppTheme(Theme.Dark) :
                            updateAppTheme(Theme.Light))}>
                    {appTheme === Theme.Light ? <MoonIcon /> : <SunIcon />}
                </span> */}
            </div>
        </section>
    );
};

export default DesktopNavbar;
