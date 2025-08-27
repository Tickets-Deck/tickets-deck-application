"use client"
import type { Metadata } from 'next'
import { FunctionComponent, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './shared/Sidebar';
import Topbar from './shared/Topbar';
import { usePathname } from 'next/navigation';
import images from '@/public/images';
import Image from "next/image";
import { Session } from 'next-auth';
import { clearUserCredentials, fetchUserProfile, updateUserCredentials } from '../redux/features/user/userSlice';
import { signOut, useSession } from 'next-auth/react';
import { Theme } from '../enums/Theme';
import NextTopLoader from 'nextjs-toploader';
import UserLoginPrompt from './Modal/UserLoginPrompt';
import { ApplicationContext, ApplicationContextData } from '../context/ApplicationContext';
import ToastCard from './Card/ToastCard';
import { ToastMessageType } from '../enums/ToastMessageType';
import { ToastContext } from '../context/ToastCardContext';
import TokenSync from './Auth/TokenSync';
import { UserCredentialsResponse } from '../models/IUser';
import { useAppDispatch } from '../redux/hook';

export const metadata: Metadata = {
    title: 'Ticketsdeck Events',
    description: 'Unlocking best experiences, easily.'
}

interface LayoutProps {
    children?: ReactNode;
    session: Session | null
    userData: UserCredentialsResponse | null
}

const Layout: FunctionComponent<LayoutProps> = ({ children, session, userData }): ReactElement => {

    const { status } = useSession();
    const toastContext = useContext(ToastContext);

    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState(Theme.Dark);

    const iswindow = typeof window !== "undefined" ? true : false;

    const dispatch = useAppDispatch();

    // const windowRes = useResponsiveness();
    // const isMobile = windowRes.width && windowRes.width < 768;
    // const onMobile = typeof (isMobile) == "boolean" && isMobile;
    // const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoaderIsVisible(false);
        }
    }, [iswindow]);

    // useEffect(() => {
    //     if (userData) {
    //         dispatch(updateUserCredentials(userData));
    //     } else {
    //         if (session && status === 'authenticated') {
    //             dispatch(fetchUserProfile(session?.user.id as string));
    //         }
    //         // Clear Redux when session expires
    //         if (status === "unauthenticated") {
    //             dispatch(clearUserCredentials());
    //         }
    //     }
    // }, [userData, session, status, dispatch]);
    
    useEffect(() => {
        if (userData) {
            dispatch(updateUserCredentials(userData));
        }
    }, [userData, dispatch]);
    
    useEffect(() => {
        if (!userData && session && status === 'authenticated') {
            dispatch(fetchUserProfile(session.user.id as string));
        }
    }, [userData, session, status, dispatch]);
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            dispatch(clearUserCredentials());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            // Force user to re-auth if refresh fails
            signOut({ redirect: false });
        }
    }, [session, status]);

    // useSocket(WebhookEvent.USER_EMAIL_VERIFIED, (data) => {
    //     // Refresh page or trigger state update
    //     // window.location.reload();
    // });

    const pathname = usePathname();

    const { isUserLoginPromptVisible, toggleUserLoginPrompt } = useContext(ApplicationContext) as ApplicationContextData;

    const isAppPage = pathname.includes('/app');

    return (
        <>
            <NextTopLoader
                color="#5419a7"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #f1fa9e,0 0 5px #ceb0fa"
            />
            <UserLoginPrompt
                visibility={isUserLoginPromptVisible}
                setVisibility={toggleUserLoginPrompt}
            />
            <TokenSync
                session={session}
            />

            {
                !loaderIsVisible &&
                <>
                    <ToastCard
                        visibility={toastContext?.toastOptions?.visible ?? false}
                        title={toastContext?.toastOptions?.title ?? 'Welcome'}
                        description={toastContext?.toastOptions?.description ?? ''}
                        messageType={toastContext?.toastOptions?.type ?? ToastMessageType.Info}
                        timeout={toastContext?.toastOptions?.timeout ?? 0.01}
                        position="top-right"
                    />

                    {
                        !isAppPage &&
                        <Navbar
                            setSelectedTheme={setSelectedTheme}
                            session={session}
                        />
                    }
                    {children}
                    {
                        !isAppPage &&
                        <Footer />
                    }
                    {/* {
                        isAppPage &&
                        <div className="appLayout">
                            <Topbar
                                isMobileSidebarOpen={isMobileSidebarOpen}
                                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                            />
                            <div className="appLayout__body">
                                <Sidebar
                                    isMobileSidebarOpen={isMobileSidebarOpen}
                                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                                />
                                <div className="innerBody" style={(isEventsPage || isFavoritesPage || isViewEventPage) ? { padding: 0 } : {}}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    } */}
                </>
            }
            {
                loaderIsVisible &&
                <div className="splashScreen">
                    <div className="image">
                        <Image src={images.logoWhite} priority alt='logo' />
                    </div>
                </div>
            }
        </>
    )
}

export default Layout;
