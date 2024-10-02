import Link from "next/link";
import { FunctionComponent, ReactElement, useContext, Dispatch, SetStateAction, useState } from "react";
import { DeleteIcon, EditIcon, LocationPinIcon, ShareIcon } from "../SVGs/SVGicons";
import Image from "next/image";
import styles from "../../styles/EventCard.module.scss";
import moment from "moment";
import { ToastContext } from "../../extensions/toast";
import { EventResponse } from "@/app/models/IEvents";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";
import EventLikeButton from "../custom/EventLikeButton";
import { toast } from "sonner";

interface EventCardProps {
    event: EventResponse
    mobileAndActionButtonDismiss?: boolean
    consoleDisplay?: boolean
    gridDisplay?: boolean
    setIsDeleteConfirmationModalVisible?: Dispatch<SetStateAction<boolean>>
    setSelectedEvent?: Dispatch<SetStateAction<EventResponse | undefined>>
    forFeaturedEvents?: boolean
}

const EventCard: FunctionComponent<EventCardProps> = (
    { event, mobileAndActionButtonDismiss, consoleDisplay, gridDisplay,
        setIsDeleteConfirmationModalVisible, setSelectedEvent, forFeaturedEvents }): ReactElement => {

    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const [isEventLiked, setIsEventLiked] = useState(false);

    const toasthandler = useContext(ToastContext);

    // const blurDataUrl = async (imageUrl: string) => await dynamicBlurDataUrl(imageUrl);

    function shareEvent(eventUrl: string) {
        navigator.clipboard.writeText(`${event.title} - Ticketsdeck Events: ${eventUrl}`)
            .then(() => {
                toast.success(`The link to ${event.title} has been copied.`);
            })
            .catch((error) => {
                toast.error('Failed to copy event link. Please try again.');
            });
    }

    // const isEventNow = (eventDate: string, eventTime: string) => {
    //     // Parse the event date (assuming it's in ISO format with "T00:00:00.000Z")
    //     const eventDateObj = new Date(eventDate);

    //     // Split the time into hours and minutes, converting the 12-hour format to 24-hour
    //     const [time, modifier] = eventTime.split(/([APap][Mm])/); // Split by 'am' or 'pm'
    //     let [hours, minutes] = time.split(':');
    //     hours = parseInt(hours, 10);

    //     // Adjust hours based on AM/PM
    //     if (modifier.toLowerCase() === 'pm' && hours !== 12) {
    //         hours += 12;
    //     }
    //     if (modifier.toLowerCase() === 'am' && hours === 12) {
    //         hours = 0;
    //     }

    //     // Set the hours and minutes in the event date object
    //     eventDateObj.setUTCHours(hours, minutes);

    //     // Get the current date and time for comparison
    //     const currentDateTime = new Date();

    //     // Compare both date and time (down to milliseconds)
    //     return eventDateObj.getTime() === currentDateTime.getTime();
    // };

    let eventDate = new Date(event.date);
    const currentDate = new Date();

    const eventHoldsToday = eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear();

    return (
        <div className={`${appTheme == Theme.Light ? styles.eventLightTheme : styles.event} ${gridDisplay ? styles.gridDisplay : ""}`} style={mobileAndActionButtonDismiss ? { minWidth: 'auto' } : {}}>
            {/* <div className={styles.backgroundImage}>
                <Image src={images.ticketbg} alt='Ticket background' />
            </div> */}
            {/* <span className={styles.event__tag}>Latest</span> */}
            <div className={styles.event__image}>
                {
                    event.isArchived ?
                        <Image
                            src={event.mainImageUrl}
                            alt='Event flyer'
                            fill
                        />
                        :
                        <Link href={consoleDisplay ? `/app/event/${event.id}` : `/event/${event.id}`}>
                            <Image
                                src={event.mainImageUrl}
                                alt='Event flyer'
                                fill
                            />
                        </Link>
                }
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
                            {/* <button className={styles.actions__like} onClick={() => setIsEventLiked(!isEventLiked)}>
                                <motion.span
                                    style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                                    whileTap={{ scale: 3 }}
                                    transition={{ duration: 0.5 }}>
                                    <LikeIcon isLiked={isEventLiked} />
                                </motion.span>
                            </button> */}
                            <EventLikeButton
                                eventInfo={event}
                                forEventCard
                                skipFetch={forFeaturedEvents}
                            />
                            <button
                                className={styles.actions__share}
                                onClick={() => shareEvent(`${window.location.origin + ApplicationRoutes.GeneralEvent + event.id}`)}>
                                <ShareIcon />
                            </button>
                        </div>
                        <p className={styles.restriction}>
                            {event.allowedGuestType}
                        </p>
                    </div>}
            </div>
            {
                consoleDisplay && eventHoldsToday ?
                    <Link
                        href={ApplicationRoutes.CheckIn(event.id, event.title.replace(/ /g, '-'))}
                        className="p-2 rounded-lg bg-white text-dark-grey w-full text-center">
                        Check In
                    </Link>
                    :
                    <div className={styles.actionBtnContainer}>
                        {
                            consoleDisplay && setIsDeleteConfirmationModalVisible && setSelectedEvent && !event.isArchived &&
                            <Link href={`${ApplicationRoutes.EditEvent}/${event.id}`} className={styles.noStyle}>
                                <button className={styles.editBtn}>
                                    <EditIcon />
                                </button>
                            </Link>
                        }
                        {
                            event.isArchived ?
                                <button className="p-2 bg-dark-grey-2 text-white w-full rounded-md pointer-events-none">Deleted</button> :
                                <Link href={consoleDisplay ? `${ApplicationRoutes.Event}/${event.id}` : `/event/${event.id}`}>
                                    <button className="text-sm">View details</button>
                                </Link>
                        }
                        {
                            consoleDisplay && setIsDeleteConfirmationModalVisible && setSelectedEvent && !event.isArchived &&
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
            }
        </div>
    );
}

export default EventCard;