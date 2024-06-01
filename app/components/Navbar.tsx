"use client"
import { FunctionComponent, ReactElement, useState, Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import useResponsiveness from '../hooks/useResponsiveness';
import { Session } from 'next-auth';
import DesktopNavbar from './Navbar/DesktopNavbar';
import MobileNavbar from './Navbar/MobileNavbar';

interface NavbarProps {
    session: Session | null
}

const Navbar: FunctionComponent<NavbarProps> = (): ReactElement => {

    const { data: session } = useSession();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const [isLightTheme, setIsLightTheme] = useState(false);

    return (
        <>
            {
                onMobile &&
                <MobileNavbar
                    session={session}
                />
            }
            {
                onDesktop &&
                <DesktopNavbar
                    isLightTheme={isLightTheme}
                    session={session}
                />
            }
        </>
    );
}

export default Navbar;