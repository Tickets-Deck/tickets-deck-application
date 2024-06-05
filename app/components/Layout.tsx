"use client"
import type { Metadata } from 'next'
import { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContext } from '../extensions/toast';
import { ToastMessageType } from '../models/ToastMessageType';
import Sidebar from './shared/Sidebar';
import Topbar from './shared/Topbar';
import { usePathname } from 'next/navigation';
import images from '@/public/images';
import Image from "next/image";
import { IToastOptions } from '../models/toastOptions';
import { Session } from 'next-auth';
import { useFetchUserInformation } from '../api/apiClient';
import { useDispatch } from 'react-redux';
import { updateUserCredentials } from '../redux/features/user/userSlice';
import { catchError } from '../constants/catchError';
import { Toaster } from "sonner";
import useResponsiveness from '../hooks/useResponsiveness';
import { useSession } from 'next-auth/react';
import { Theme } from '../enums/Theme';
import { GlobalProvider } from './Provider';
import NextTopLoader from 'nextjs-toploader';

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
    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState(Theme.Light);

    const iswindow = typeof window !== "undefined" ? true : false;

    const fetchUserInformation = useFetchUserInformation();

    const dispatch = useDispatch();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    async function handleFetchUserInformation() {
        // console.log("Session on layout: ", session);

        await fetchUserInformation(session?.user.id as string)
            .then((response) => {
                // console.log("User information on layout: ", response.data);
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
    }, [session, status])

    const pathname = usePathname();

    // const toastContext = useContext(ToastContext);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const isAppPage = pathname.includes('/app');
    const isEventsPage = pathname == '/app/events';
    const isViewEventPage = pathname.startsWith('/app/event') && !pathname.includes('/create');


    const [toastOptions, setToastOptions] = useState<IToastOptions>({
        type: ToastMessageType.Info,
        title: 'Welcome',
        description: '',
        timeout: 0.01,
        visible: false
    });


    /**
     * Logs success message
     * @param title The title of the success
     * @param description The description of the success
     * @param timeout The display timeout of the toast
     */
    function logSuccess(title: string, description: string, timeout: number = 4000) {
        setToastOptions({
            type: ToastMessageType.Success,
            title: title,
            description: description,
            timeout: timeout,
            visible: true
        });
    };

    /**
     * Logs info message
     * @param title The title of the info
     * @param description The description of the info
     * @param timeout The display timeout of the toast
     */
    function logInfo(title: string, description: string, timeout: number = 4000) {
        setToastOptions({
            type: ToastMessageType.Info,
            title: title,
            description: description,
            timeout: timeout,
            visible: true
        });
    };

    /**
     * Logs warning message
     * @param title The title of the warning
     * @param description The description of the warning
     * @param timeout The display timeout of the toast
     */
    function logWarning(title: string, description: string, timeout: number = 4000) {
        setToastOptions({
            type: ToastMessageType.Warning,
            title: title,
            description: description,
            timeout: timeout,
            visible: true
        });
    };

    /**
     * Logs error message
     * @param title The title of the error
     * @param description The description of the error
     * @param timeout The display timeout of the toast
     */
    function logError(title: string, description: string, timeout: number = 4000) {
        setToastOptions({
            type: ToastMessageType.Error,
            title: title,
            description: description,
            timeout: timeout,
            visible: true
        });
    };

    function closeToast() {
        setToastOptions({
            type: ToastMessageType.None,
            title: '',
            description: '',
            timeout: 0.01,
            visible: false
        });
    };

    return (
        <html lang="en" data-theme={selectedTheme == Theme.Light ? "light" : "dark"}>
            <body>
                <NextTopLoader
                    color="#5419a7"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #d39efa,0 0 5px #5116a2"
                />
                {
                    !loaderIsVisible &&
                    <ToastContext.Provider value={{ toastOptions, logSuccess, logInfo, logWarning, logError, closeToast }}>
                        <Toaster
                            position="top-center"
                            richColors
                            closeButton
                            toastOptions={{
                                duration: 3000,
                                unstyled: false,
                            }}
                        />
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
                            isAppPage && <>
                                <div className="appLayout">
                                    <Topbar
                                        isMobileSidebarOpen={isMobileSidebarOpen}
                                        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                                    />
                                    <div className="appLayout__body">
                                        {/* {onDesktop && <Sidebar />} */}
                                        <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} />
                                        <div className="innerBody" style={(isEventsPage || isViewEventPage) ? { padding: 0 } : {}}>
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </ToastContext.Provider>
                }
                {
                    loaderIsVisible && <div className="splashScreen">
                        <div className="image">
                            <Image src={images.logoWhite} alt='logo' />
                        </div>
                    </div>
                }
            </body>
        </html>
    )
}

export default Layout;
