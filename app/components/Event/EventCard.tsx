import Link from "next/link";
import { FunctionComponent, ReactElement, useContext } from "react";
import { HorizontalLineIcon, LikeIcon, LocationPinIcon, ShareIcon } from "../SVGs/SVGicons";
import Image from "next/image";
import images from "../../../public/images";
import useResponsive from "../../hooks/useResponsiveness";
import styles from "../../styles/EventCard.module.scss";
import moment from "moment";
import { Event } from "../models/IEvent";
import { ToastContext } from "../../extensions/toast";

interface EventCardProps {
    event: Event
    mobileAndActionButtonDismiss?: boolean
    consoleDisplay?: boolean 
}

const EventCard: FunctionComponent<EventCardProps> = (
    { event, mobileAndActionButtonDismiss, consoleDisplay }): ReactElement => {

    
    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;
    const toasthandler = useContext(ToastContext);

    function shareEvent() {
        const eventURL = window.location.href;
        try {
            navigator.clipboard.writeText(eventURL);
            toasthandler?.logSuccess('Event link copied.', `The link to ${event.title} has been copied.`)
        } catch (error) {
            console.error("Copying to clipboard failed:", error);
        }
    }
    function shareEventMobile() {
        const eventURL = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: "Check out this event!",
                text: "I found this amazing event. You should check it out!",
                url: eventURL
            })
                .then(() => console.log("Shared successfully"))
                .catch(error => console.log("Sharing failed:", error));
        } else {
            console.log("Web Share API not supported");
        }
    }

    return (
        <div className={styles.event} style={mobileAndActionButtonDismiss ? { minWidth: 'auto' } : {}}>
            <div className={styles.backgroundImage}>
                <Image src={images.ticketbg} alt='Ticket background' />
            </div>
            <span className={styles.event__tag}>Latest</span>
            <div className={styles.event__image}>
                <Link href={consoleDisplay ? `/app/event/${event.id}` : `/event/${event.id}`}>
                    <Image src={images.event_flyer} alt='Event flyer' />
                </Link>
            </div>
            <span className={styles.hLine}>
                <HorizontalLineIcon />
            </span>
            <div className={styles.eventInfo}>
                <div className={styles.eventInfo__lhs}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <div className={styles.dateTime}>
                        <span className={styles.dateTime__date}>{moment(event.dateCreated).format('MMM DD')}</span>
                        <span className={styles.dateTime__dot}></span>
                        <span className={styles.dateTime__time}>{moment(event.dateCreated).format('hh:mmA')}</span>
                    </div>
                    <div className={styles.location}>
                        <LocationPinIcon />
                        <p>{event.location.blockNumber + ' ' + event.location.city + ', ' + event.location.state + ', ' + event.location.country}</p>
                    </div>
                </div>
                {mobileAndActionButtonDismiss ?
                    <></> :
                    <div className={styles.eventInfo__rhs}>
                        <div className={styles.actions}>
                            <button className={styles.actions__like}><LikeIcon /></button>
                            <button className={styles.actions__share} onClick={() => typeof (onMobile) == "boolean" && onMobile ? shareEventMobile() : shareEvent()}><ShareIcon /></button>
                        </div>
                        <p className={styles.restriction}>Everyone</p>
                    </div>}
                {/* <div className={styles.eventInfo__rhs}>
                    <div className={styles.actions}>
                        <button className={styles.actions__like}><LikeIcon /></button>
                        <button className={styles.actions__share} onClick={() => typeof (onMobile) == "boolean" && onMobile ? shareEventMobile() : shareEvent(event)}><ShareIcon /></button>
                    </div>
                    <p className={styles.restriction}>Everyone</p>
                </div> */}
            </div>
            <Link href={consoleDisplay ? `/app/event/${event.id}` : `/event/${event.id}`}>
                <button>View details</button>
            </Link>
        </div>
    );
}

export default EventCard;