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

    const { push } = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    const toastContext = useContext(ToastContext);
    const isAppPage = pathname.includes('/app');
    const isEventsPage = pathname == '/app/events';
    const isViewEventPage = pathname.startsWith('/app/event') && !pathname.includes('/create');

    useEffect(() => {
        if (!session && isAppPage) {
            push('/');
        }
    }, [session]);


    return (
        <>
            {
                !loaderIsVisible &&
                <>
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
