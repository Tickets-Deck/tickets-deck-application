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
import { useFetchUserInformation } from '../api/apiClient';
import { useDispatch } from 'react-redux';
import { updateUserCredentials } from '../redux/features/user/userSlice';
import { catchError } from '../constants/catchError';
import { Toaster } from "sonner";
import { signOut, useSession } from 'next-auth/react';
import { Theme } from '../enums/Theme';
import NextTopLoader from 'nextjs-toploader';
import UserLoginPrompt from './Modal/UserLoginPrompt';
import { ApplicationContext, ApplicationContextData } from '../context/ApplicationContext';
import ToastCard from './Card/ToastCard';
import { ToastMessageType } from '../enums/ToastMessageType';
import { ToastContext } from '../context/ToastCardContext';
import TokenSync from './Auth/TokenSync';

export const metadata: Metadata = {
    title: 'Ticketsdeck Events',
    description: 'Unlocking best experiences, easily.'
}

interface LayoutProps {
    children?: ReactNode;
    session: Session | null
}

const Layout: FunctionComponent<LayoutProps> = ({ children, session }): ReactElement => {

    const { status } = useSession();
    const toastContext = useContext(ToastContext);

    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState(Theme.Dark);

    const iswindow = typeof window !== "undefined" ? true : false;

    const fetchUserInformation = useFetchUserInformation();

    const dispatch = useDispatch();

    // const windowRes = useResponsiveness();
    // const isMobile = windowRes.width && windowRes.width < 768;
    // const onMobile = typeof (isMobile) == "boolean" && isMobile;
    // const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    async function handleFetchUserInformation() {
        // console.log("Session on layout: ", session);

        await fetchUserInformation(session?.user.id as string)
            .then((response) => {
                console.log("User information on layout: ", response.data);
                // Save to redux
                dispatch(updateUserCredentials(response.data));
            })
            .catch((error) => {
                // console.log(error);
                catchError(error);
            })
    };


    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoaderIsVisible(false);
        }
    }, [iswindow]);

    useEffect(() => {
        if (session && status === 'authenticated') {
            handleFetchUserInformation();
        }
        if (session?.error === 'RefreshAccessTokenError') {
            // Force user to re-auth if refresh fails
            signOut({ redirect: false });
        }
    }, [session, status])

    const pathname = usePathname();

    // const toastContext = useContext(ToastContext);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { isUserLoginPromptVisible, toggleUserLoginPrompt } = useContext(ApplicationContext) as ApplicationContextData;

    const isAppPage = pathname.includes('/app');
    const isEventsPage = pathname == '/app/events';
    const isFavoritesPage = pathname == '/app/favourite-events';
    const isViewEventPage = pathname.startsWith('/app/event') && !pathname.includes('/create');

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
            <TokenSync />

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
                    {/* <Toaster
                        position="top-center"
                        richColors
                        closeButton
                        toastOptions={{
                            duration: 3000,
                            unstyled: false,
                        }}
                    /> */}
                    {
                        !isAppPage && <>
                            <Navbar
                                setSelectedTheme={setSelectedTheme}
                                session={session}
                            />
                            {children}
                            <Footer />
                        </>
                    }
                    {
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
                    }
                </>
            }
            {
                loaderIsVisible && <div className="splashScreen">
                    <div className="image">
                        <Image src={images.logoWhite} priority alt='logo' />
                    </div>
                </div>
            }
        </>
    )
}

export default Layout;
