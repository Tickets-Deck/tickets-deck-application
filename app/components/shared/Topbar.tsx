import { FunctionComponent, ReactElement } from "react";
import styles from "../../styles/ConsoleTopbar.module.scss";
import Image from "next/image";
import images from "../../../public/images";
import { SearchIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface TopbarProps {

}

const Topbar: FunctionComponent<TopbarProps> = (): ReactElement => {

    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className={styles.topbar}>
            <Link href="/">
                <div className={styles.logo}>
                    <span className={styles.logo__image}>
                        <Image src={images.logoPurple} alt="Logo" />
                    </span>
                    <p>Ticketsdeck</p>
                </div>
            </Link>
            <div className={styles.topbar__rhs}>
                <div className={styles.searchContainer}>
                    <SearchIcon />
                    <input type="text" placeholder="Search for event" />
                </div>
                <Link href="/app/profile">
                    <div className={styles.accountContainer}>
                        <div className={styles.accountContainer__image}>
                            <Image src={user?.image ?? images.user_avatar} fill alt="Profile" />
                        </div>
                        <h3>{user?.name ?? user?.username}</h3>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Topbar;