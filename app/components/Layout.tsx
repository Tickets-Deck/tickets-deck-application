"use client"
import type { Metadata } from 'next'
import { FunctionComponent, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContext } from '../extensions/toast';
import { ToastMessageType } from '../models/ToastMessageType';
import ToastCard from './Card/ToastCard';
import Sidebar from './shared/Sidebar';
import Topbar from './shared/Topbar';
import { usePathname, useRouter } from 'next/navigation';
import { Provider } from './Provider';
import images from '@/public/images';
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { IToastOptions } from '../models/toastOptions';

export const metadata: Metadata = {
    title: 'Ticket wave web application',
    description: 'Ticket wave web application',
}

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {

    const [loaderIsVisible, setLoaderIsVisible] = useState(true);

    const iswindow = typeof window !== "undefined" ? true : false;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoaderIsVisible(false);
        }
    }, [iswindow]);

    const pathname = usePathname();

    const toastContext = useContext(ToastContext);

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
    }

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
    }

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
    }

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
    }

    function closeToast() {
        setToastOptions({
            type: ToastMessageType.None,
            title: '',
            description: '',
            timeout: 0.01,
            visible: false
        });
    }

    return (
        <>
            {
                !loaderIsVisible &&
                <>
                    <ToastContext.Provider value={{ toastOptions, logSuccess, logInfo, logWarning, logError, closeToast }}>
                        <ToastCard
                            visibility={toastContext?.toastOptions?.visible ?? false}
                            title={toastContext?.toastOptions?.title ?? 'Welcome'}
                            description={toastContext?.toastOptions?.description ?? ''}
                            messageType={toastContext?.toastOptions?.type ?? ToastMessageType.Info}
                            timeout={toastContext?.toastOptions?.timeout ?? 0.01} />
                        {
                            !isAppPage && <>
                                <Navbar />
                                {children}
                                <Footer />
                            </>
                        }
                        {
                            isAppPage && <>
                                <div className="appLayout">
                                    <Topbar />
                                    <div className="appLayout__body">
                                        <Sidebar />
                                        <div className="innerBody" style={(isEventsPage || isViewEventPage) ? { padding: 0 } : {}}>
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </ToastContext.Provider>
                </>
            }
            {
                loaderIsVisible && <div className="splashScreen">
                    <div className="image">
                        <Image src={images.logoWhite} alt='logo' />
                    </div>
                </div>
            }
        </>
    )
}

export default Layout;
