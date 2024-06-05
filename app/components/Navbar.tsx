"use client"
import { FunctionComponent, ReactElement, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useResponsiveness from '../hooks/useResponsiveness';
import { Session } from 'next-auth';
import DesktopNavbar from './Navbar/DesktopNavbar';
import MobileNavbar from './Navbar/MobileNavbar';
import { RootState } from "@/app/redux/store";
import { useSelector } from 'react-redux';
import { Theme } from '../enums/Theme';

interface NavbarProps {
    session: Session | null
    setSelectedTheme: Dispatch<SetStateAction<Theme>>
}

const Navbar: FunctionComponent<NavbarProps> = ({ setSelectedTheme }): ReactElement => {

    const { data: session } = useSession();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const [isLightTheme, setIsLightTheme] = useState(false);
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    useEffect(() => {
        if(appTheme) {
            setSelectedTheme(appTheme);
        }
    }, [appTheme]);

    return (
        <>
            {
                onMobile &&
                <MobileNavbar
                    session={session}
                    appTheme={appTheme}
                />
            }
            {
                onDesktop &&
                <DesktopNavbar
                    isLightTheme={isLightTheme}
                    session={session}
                    appTheme={appTheme}
                />
            }
        </>
    );
}

export default Navbar;