import { FunctionComponent, LegacyRef, ReactElement } from "react";
import styles from "@/app/styles/components/TicketUi.module.scss";
import Image from "next/image";
import images from "@/public/images";
import { TicketPass } from "@/app/models/ITicketPass";
import moment from "moment";
import QRCode from 'qrcode.react';

interface TicketUiProps {
    ticketInfo: TicketPass
}

const TicketUi: FunctionComponent<TicketUiProps> = ({ ticketInfo }): ReactElement => {
    return (
        <div className={styles.ticketContainer}>
            <div className={styles.topSection}>
                <h3>{ticketInfo.eventInfo.title}</h3>
                <div className={styles.image}>
                    <Image src={ticketInfo.eventInfo.mainImageUrl} fill alt="Event flyer" />
                </div>
            </div>
            <div className={styles.passSegment}>
                <h1>{ticketInfo.ticketType}</h1>
                {/* <p>~ Simlex</p> */}
            </div>
            <div className={styles.eventInfo}>
                <div className={styles.main}>
                    <div className={styles.lhs}>
                        <h5>Date:</h5>
                        <p>{moment(ticketInfo.eventInfo.date).format("Do of MMM YYYY")}</p>
                        <h5>Time:</h5>
                        <p>{ticketInfo.eventInfo.time}</p>
                        <h5>Location:</h5>
                        <p>{ticketInfo.eventInfo.venue}</p>
                    </div>
                    <div className={styles.rhs}>
                        <div className={styles.qr}>
                            {ticketInfo.qr}
                            {/* <QRCode value={ticketInfo.qr} /> */}
                            {/* <Image src={ticketInfo.qr} alt="QR code" /> */}
                        </div>
                        {/* <p>Order code: BY45CZ</p> */}
                    </div>
                </div>
                <p className={styles.order}>Order #BY45CZ</p>
            </div>
        </div>
    );
}

export default TicketUi;