import Link from "next/link";
import { FunctionComponent, ReactElement, useContext, Dispatch, SetStateAction } from "react";
import { DeleteIcon, EditIcon, HorizontalLineIcon, LikeIcon, LocationPinIcon, ShareIcon } from "../SVGs/SVGicons";
import Image from "next/image";
import images from "../../../public/images";
import styles from "../../styles/EventCard.module.scss";
import moment from "moment";
import { ToastContext } from "../../extensions/toast";
import { EventResponse } from "@/app/models/IEvents";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { useRouter } from "next/navigation";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";

interface EventCardProps {
    event: EventResponse
    mobileAndActionButtonDismiss?: boolean
    consoleDisplay?: boolean
    gridDisplay?: boolean
    setIsDeleteConfirmationModalVisible?: Dispatch<SetStateAction<boolean>>
    setSelectedEvent?: Dispatch<SetStateAction<EventResponse | undefined>>
}

const EventCard: FunctionComponent<EventCardProps> = (
    { event, mobileAndActionButtonDismiss, consoleDisplay, gridDisplay,
        setIsDeleteConfirmationModalVisible, setSelectedEvent }): ReactElement => {

    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const { push } = useRouter();
    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const toasthandler = useContext(ToastContext);

    function shareEvent(eventUrl: string) {
        // const eventURL = window.location.href;
        // If we are using a mobile device
        if (onMobile) {
            if (navigator.share) {
                navigator.share({
                    title: "Check out this event!",
                    text: "I found this amazing event. You should check it out!",
                    url: eventUrl
                })
                    .then(() => console.log("Shared successfully"))
                    .catch(error => console.log("Sharing failed:", error));
            } else {
                navigator.clipboard.writeText(eventUrl);
                toasthandler?.logSuccess('Event link copied.', `The link to ${event.title} has been copied.`)
                console.log("Web Share API not supported");
            }
        }
        if (onDesktop) {
            try {
                navigator.clipboard.writeText(eventUrl);
                toasthandler?.logSuccess('Event link copied.', `The link to ${event.title} has been copied.`)
                console.log("Link copied successfully")
            } catch (error) {
                console.error("Copying to clipboard failed:", error);
            }

        }
    }
    function shareEventMobile(eventUrl: string) {
        // const eventURL = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: "Check out this event!",
                text: "I found this amazing event. You should check it out!",
                url: eventUrl
            })
                .then(() => console.log("Shared successfully"))
                .catch(error => console.log("Sharing failed:", error));
        } else {
            console.log("Web Share API not supported");
        }
    }

    return (
        <div className={`${appTheme == Theme.Light ? styles.eventLightTheme : styles.event} ${gridDisplay ? styles.gridDisplay : ""}`} style={mobileAndActionButtonDismiss ? { minWidth: 'auto' } : {}}>
            {/* <div className={styles.backgroundImage}>
                <Image src={images.ticketbg} alt='Ticket background' />
            </div> */}
            <span className={styles.event__tag}>Latest</span>
            <div className={styles.event__image}>
                <Link href={consoleDisplay ? `/app/event/${event.id}` : `/event/${event.id}`}>
                    <Image src={event.mainImageUrl} alt='Event flyer' fill />
                </Link>
            </div>
            {/* <span className={styles.hLine}>
                <HorizontalLineIcon />
            </span> */}
            <div className={styles.eventInfo}>
                <div className={styles.eventInfo__lhs}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <div className={styles.dateTime}>
                        <span className={styles.dateTime__date}>{moment(event.date).format('MMM DD')}</span>
                        <span className={styles.dateTime__dot}></span>
                        <span className={styles.dateTime__time}>{event.time}</span>
                    </div>
                    <div className={styles.location}>
                        <LocationPinIcon />
                        <p>{event.venue}</p>
                        {/* <p>{event.location.blockNumber + ' ' + event.location.city + ', ' + event.location.state + ', ' + event.location.country}</p> */}
                    </div>
                </div>
                {(!mobileAndActionButtonDismiss || consoleDisplay) &&
                    <div className={styles.eventInfo__rhs}>
                        <div className={styles.actions}>
                            <button className={styles.actions__like}><LikeIcon /></button>
                            <button
                                className={styles.actions__share}
                                onClick={() => shareEvent(`${window.location.origin + ApplicationRoutes.GeneralEvent + event.id}`)}>
                                <ShareIcon />
                            </button>
                        </div>
                        <p className={styles.restriction}>{event.allowedGuestType}</p>
                    </div>}
            </div>
            <div className={styles.actionBtnContainer}>
                {
                    consoleDisplay && setIsDeleteConfirmationModalVisible && setSelectedEvent &&
                    <Link href={`/app/event/edit/${event.id}`} className={styles.noStyle}>
                        <button className={styles.editBtn}>
                            <EditIcon />
                        </button>
                    </Link>
                }
                <Link href={consoleDisplay ? `/app/event/${event.id}` : `/event/${event.id}`}>
                    <button>View details</button>
                </Link>
                {
                    consoleDisplay && setIsDeleteConfirmationModalVisible && setSelectedEvent &&
                    <button
                        className={styles.deleteBtn}
                        onClick={() => {
                            setSelectedEvent(event)
                            setIsDeleteConfirmationModalVisible(true)
                        }}>
                        <DeleteIcon />
                    </button>
                }
            </div>
        </div>
    );
}

export default EventCard;