import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import styles from "../../styles/ConsoleTopbar.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import { Icons } from "../ui/icons";
import Link from "next/link";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface TopbarProps {
    isMobileSidebarOpen: boolean
    setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const Topbar: FunctionComponent<TopbarProps> = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }): ReactElement => {

    const userInfo = useSelector(
        (state: RootState) => state.userCredentials.userInfo
    );

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    return (
        <div className={styles.topbar}>
            <Link href={ApplicationRoutes.Home}>
                <div className={styles.logo}>
                    <span className={styles.logo__image}>
                        <Image src={images.logoPurple} alt="Logo" />
                    </span>
                    <p>Ticketsdeck</p>
                </div>
            </Link>
            <div className={styles.topbar__rhs}>
                {/* <div className={styles.searchContainer}>
                    <SearchIcon />
                    <input type="text" placeholder="Search for event" />
                </div> */}
                <Link href={ApplicationRoutes.Profile}>
                    <div className={styles.accountContainer}>
                        <div className={styles.accountContainer__image}>
                            <Image src={userInfo?.profilePhoto || images.user_avatar} fill alt="Profile" />
                        </div>
                        <h3>{userInfo?.firstName ?? userInfo?.username}</h3>
                    </div>
                </Link>
                {
                    onMobile &&
                    <motion.span whileTap={{ scale: 0.6 }} className={styles.menu} onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
                        <Icons.HamburgerMenu />
                    </motion.span>
                }
            </div>
        </div>
    );
}

export default Topbar;