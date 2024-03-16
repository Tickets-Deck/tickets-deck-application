import { FunctionComponent, ReactElement } from "react";
import styles from "@/app/styles/components/TicketUi.module.scss";
import Image from "next/image";
import images from "@/public/images";

interface TicketUiProps {
    
}
 
const TicketUi: FunctionComponent<TicketUiProps> = ():ReactElement => {
    return ( 
        <div className={styles.ticketContainer}>
            <div className={styles.topSection}>
                <h3>AIT Music Plus Festival here</h3>
                <div className={styles.image}>
                    <Image src={images.event_flyer} alt="Event flyer" />
                </div>
            </div>
            <div className={styles.passSegment}>
                <h1>PASS</h1>
                {/* <p>~ Simlex</p> */}
            </div>
            <div className={styles.eventInfo}>
                <div className={styles.main}>
                    <div className={styles.lhs}>
                        <h5>Date:</h5>
                        <p>25th of March 2024</p>
                        <h5>Time:</h5>
                        <p>08:00pm</p>
                        <h5>Location:</h5>
                        <p>Number 7, Shorta street, off giblo road, Agriz area, Ikorodu</p>
                    </div>
                    <div className={styles.rhs}>
                        <div className={styles.qr}>
                            <Image src={images.event_flyer} alt="QR code" />
                        </div>
                        {/* <p>Info on qr</p> */}
                    </div>
                </div>
                <p className={styles.order}>Order #Y45SHF-3328JDC</p>
            </div>
        </div>
     );
}
 
export default TicketUi;