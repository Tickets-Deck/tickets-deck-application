import images from "@/public/images";
import Image from "next/image";
import { FunctionComponent, ReactElement } from "react";
import styles from "../../styles/EventDetails.module.scss";
import { useRouter } from 'next/navigation';

interface TicketsFetchErrorContainerProps {

}

const TicketsFetchErrorContainer: FunctionComponent<TicketsFetchErrorContainerProps> = (): ReactElement => {

    const router = useRouter();

    return (
        <div className={styles.ticketsFetchErrorMsgContainer}>
            <div className={styles.topArea}>
                <h3>Oops!</h3>
            </div>
            <div className={styles.messageContent}>
                <div className={styles.messageContent__image}>
                    <Image src={images.sad_face} alt='Sad face' />
                </div>
                <h4>We encountered an issue, while trying to get the available tickets.</h4>
                <p>Please <span onClick={() => router.refresh()}>reload</span> the page, and keep your fingers crossed while try our best again.</p>
            </div>
        </div>
    );
}

export default TicketsFetchErrorContainer;