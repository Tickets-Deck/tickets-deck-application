import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from "../../../models/IEvents";
import Image from "next/image";
import { PhotoIcon } from "../../SVGs/SVGicons";
import moment from "moment";
import { NairaPrice } from "@/app/constants/priceFormatter";
import { EventCreationStage } from "@/app/enums/EventCreationStage";


interface ConfirmationSectionProps {
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
    isEventCreated: boolean
    mainImageUrl: string | undefined
    setEventCreationStage: React.Dispatch<React.SetStateAction<EventCreationStage>>
}

const ConfirmationSection: FunctionComponent<ConfirmationSectionProps> = (
    { eventRequest, setEventRequest, isEventCreated, mainImageUrl, setEventCreationStage }): ReactElement => {

    /**
     * Function to generate a random string
     * @param length is the length of the string to generate
     * @returns the generated string
     */
    function generateRandomString(length: number) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            result += charset.charAt(randomIndex);
        }
        return result;
    }

    function generateEventCode() {
        const timestamp = new Date().getTime().toString(36);
        const randomString = generateRandomString(6); // Adjust the length as needed
        // const eventCode = timestamp + randomString;
        const eventCode = randomString;
        return eventCode.toUpperCase();
    }

    const [uniqueEventCode, setUniqueEventCode] = useState<string>();

    useEffect(() => {
        if (uniqueEventCode) {
            setEventRequest({ ...eventRequest as EventRequest, eventId: uniqueEventCode });
        }
    }, [uniqueEventCode]);

    useEffect(() => {
        if (eventRequest?.eventId || isEventCreated) {
            return;
        }
        setUniqueEventCode(generateEventCode());
    }, [eventRequest?.eventId, isEventCreated])

    return (
        <div className={styles.confirmationSection}>
            <div className={styles.topArea}>
                {
                    isEventCreated ? <h3>Event created. Redirecting you in seconds...</h3> :
                        <h3>Please review your event's information below.</h3>
                }
                {
                    !isEventCreated &&
                    <span>Event ID: {eventRequest?.eventId}</span>
                }
            </div>

            <div className={styles.confirmationSection__eventInfo}>
                <div className={styles.lhs}>
                    <div className={styles.eventImage}>
                        <div className={styles.image}>
                            <Image src={mainImageUrl as string} alt="Event flyer" fill />
                        </div>
                        <button type="button" onClick={() => setEventCreationStage(EventCreationStage.ImageUpload)}>Change image</button>
                    </div>

                    <div className={styles.basicInformation}>
                        <div className={styles.info}>
                            <span>Title</span>
                            <p>{eventRequest?.title}</p>
                        </div>
                        <div className={styles.info}>
                            <span>Location</span>
                            <p>{eventRequest?.venue}</p>
                        </div>
                        <div className={styles.infoRow}>
                            <div className={styles.info}>
                                <span>Date</span>
                                <p>{moment(eventRequest?.date).format("Do of MMM, YYYY")}</p>
                            </div>
                            <div className={styles.info}>
                                <span>Time</span>
                                <p>{eventRequest?.time}</p>
                            </div>
                        </div>
                        <div className={styles.info}>
                            <span>Description</span>
                            <p dangerouslySetInnerHTML={{ __html: eventRequest?.description as string }} />
                        </div>
                        <div className={styles.info}>
                            <span>Category</span>
                            <p>{eventRequest?.category}</p>
                        </div>
                        <div className={styles.info}>
                            <span>Visibility</span>
                            <p>{eventRequest?.visibility}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.rhs}>
                    <div className={styles.ticketsSection}>
                        <div className={styles.topArea}>
                            <h4>Tickets</h4>
                            <button
                                type='button'
                                onClick={() => setEventCreationStage(EventCreationStage.TicketDetails)}>
                                {eventRequest?.tickets.length && eventRequest?.tickets.length > 1 ? "Update tickets" : "Update ticket"}
                            </button>
                        </div>
                        <div className={styles.ticketCards}>
                            {
                                eventRequest?.tickets.map((ticket, index) => (
                                    <div className={styles.ticketCardBody} key={index}>
                                        <div className={styles.baseInfo}>
                                            <h5>{ticket.name}</h5>
                                            <span>{<>{`${NairaPrice.format(ticket.price)}`}</>}</span>
                                        </div>
                                        <div className={styles.metrics}>
                                            <div className={styles.metrics__single}>
                                                <p>Available tickets: </p>
                                                <span>{ticket.quantity}</span>
                                            </div>
                                            <div className={styles.metrics__single}>
                                                <p>Tickets can admit: </p>
                                                <span>{ticket.numberOfUsers} {ticket.numberOfUsers > 1 ? "persons" : "person"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.confirmationSection__uploadStatus}></div> */}
        </div >
    );
}

export default ConfirmationSection;