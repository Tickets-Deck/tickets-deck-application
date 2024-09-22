import { FunctionComponent, LegacyRef, MouseEvent, ReactElement, RefObject, useRef } from "react";
import styles from "@/app/styles/components/TicketUi.module.scss";
import Image from "next/image";
import { TicketPass } from "@/app/models/ITicketPass";
import moment from "moment";
// import domtoimage from 'dom-to-image';
// import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';


interface TicketUiProps {
    ticketInfo: TicketPass
}

const TicketUi: FunctionComponent<TicketUiProps> = ({ ticketInfo }): ReactElement => {

    const pdfRef = useRef<HTMLDivElement>(null);

    const captureTicketForDownload = async () => {
        if (pdfRef.current) {
            console.log("Capturing 2 ...");
            try {
                // Capture the div as a canvas
                const canvas = await html2canvas(pdfRef.current);
                const image = canvas.toDataURL('image/png');

                // Create an anchor element to download the image
                const link = document.createElement('a');
                link.href = image;
                link.download = `${ticketInfo.eventInfo.title}-${ticketInfo.ticketType}` + '.png';
                document.body.appendChild(link); // Append the link to the body
                link.click(); // Trigger the download
                document.body.removeChild(link); // Remove the link after download
            } catch (error) {
                console.error('Error capturing or downloading the image:', error);
            }
        } else { }
    }

    // const captureTicketForDownload = async (e: MouseEvent) => {
    //     e.preventDefault();
        
    //     await domtoimage.toJpeg(pdfRef.current as Node)
    //         .then((dataUrl) => {
    //             console.log("dataUrl: ", dataUrl);
    //             saveAs(dataUrl, 'Ticket.png');
    //         })
    // }

    return (
        <>
            <div className={styles.ticketContainer} id="capture" ref={pdfRef}>
                <div className={styles.topSection}>
                    <h3>{ticketInfo.eventInfo.title}</h3>
                    <div className={styles.image}>
                        <Image src={ticketInfo.eventInfo.mainImageUrl} fill alt="Event flyer" />
                    </div>
                </div>
                <div className="bg-primary-color text-white flex flex-col items-center justify-center py-2">
                    <h1 className="text-xl">{ticketInfo.ticketType}</h1>
                    {/* <p>~ Simlex</p> */}
                </div>
                <div className={styles.eventInfo}>
                    <div className="flex flex-col md:flex-row items-center justify-between text-black mb-2">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row gap-5 mb-2">
                                <div>
                                    <h5>Date:</h5>
                                    <p>{moment(ticketInfo.eventInfo.date).format("Do of MMM YYYY")}</p>
                                </div>
                                <div>
                                    <h5>Time:</h5>
                                    <p>{ticketInfo.eventInfo.time}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <h5>Location:</h5>
                                <p>{ticketInfo.eventInfo.venue}</p>
                            </div>
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
                    <p className="text-base text-black text-center">Order #{ticketInfo.orderId}</p>
                </div>
            </div>
            <button
                className="bg-primary-color text-white py-2 px-4 rounded-lg mt-2 mx-auto"
                onClick={(e) => captureTicketForDownload()}
            >
                Download
            </button>
        </>
    );
}

export default TicketUi;