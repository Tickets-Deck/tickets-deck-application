import { CSSProperties, Dispatch, FunctionComponent, ReactElement, SetStateAction, useContext, useEffect, useState } from "react";
import { CalenderIcon, HeartIcon, LikeIcon, ShareIcon } from "../SVGs/SVGicons";
import styles from "@/app/styles/EventInfo.module.scss";
import { Link as ScrollLink } from 'react-scroll';
import Tooltip from "../custom/Tooltip";
import Link from "next/link";
import Image from "next/image";
import images from "@/public/images";
import moment from "moment";
import { EventFavoriteAction, EventResponse } from "@/app/models/IEvents";
import { Theme } from "@/app/enums/Theme";
import { motion } from "framer-motion";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";
import { useSession } from "next-auth/react";
import { useFetchEventLikeStatus, useLikeEvent } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import EventLikeButton from "../custom/EventLikeButton";

interface EventMainInfoProps {
    appTheme: Theme | null
    eventInfo: EventResponse
    setTicketsSelectionContainerIsVisible?: Dispatch<SetStateAction<boolean>>
    addEventToGoogleCalender?: () => void
    forOrdersPage?: boolean
    hideStatusTag?: boolean
    hostUrl?: string
}

const EventMainInfo: FunctionComponent<EventMainInfoProps> = (
    { appTheme, eventInfo, setTicketsSelectionContainerIsVisible, addEventToGoogleCalender,
        forOrdersPage, hideStatusTag, hostUrl }): ReactElement => {

    const { data: session } = useSession();
    const likeEvent = useLikeEvent();
    const fetchEventLikeStatus = useFetchEventLikeStatus();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const { isUserLoginPromptVisible, toggleUserLoginPrompt } = useContext(ApplicationContext) as ApplicationContextData;

    const [isEventLiked, setIsEventLiked] = useState(false);

    function shareEvent() {
        const eventURL = window.location.href;
        // const tempInput = document.createElement("input");
        // document.body.appendChild(tempInput);
        // tempInput.value = eventURL;
        // tempInput.select();
        // document.execCommand("copy");
        // document.body.removeChild(tempInput);
        try {
            navigator.clipboard.writeText(eventURL);
            // alert("Event link copied to clipboard!");
            // toasthandler?.logSuccess('Event link copied.', `The link to ${eventInfo?.title} has been copied.`)
        } catch (error) {
            console.error("Copying to clipboard failed:", error);
        }
    };
    function shareEventMobile() {
        // const eventURL = window.location.href;
        if (navigator.share) {
            navigator.share({
                // title: "Check out this event!",
                title: `${eventInfo?.title} - Ticketsdeck Events`,
                text: "I found this amazing event. You should check it out!",
                url: `${window.location.pathname}/event/${eventInfo.id}`
            })
                .then(() => console.log("Shared successfully"))
                .catch(error => console.log("Sharing failed:", error));
        } else {
            console.log("Web Share API not supported");
        }
    };

    async function handleUpdateUserFavouriteEvents(eventId: string, action: string = EventFavoriteAction.Like) {

        // Check if user is logged in and prompt user to login if not
        if (!isUserLoginPromptVisible && !session) {
            toggleUserLoginPrompt();
            return;
        }

        // Update the event's like status
        setIsEventLiked(!isEventLiked);

        await likeEvent(session?.user.id as string, eventId, action)
            .then((response) => {
                // console.log("🚀 ~ .then ~ response:", response)
            })
            .catch((error) => {
                catchError(error);
                // Revert the event's like status
                setIsEventLiked(!isEventLiked);
            })
    };

    async function handleFetchEventLikeStatus(eventId: string) {
        await fetchEventLikeStatus(session?.user.id as string, eventId)
            .then((response) => {
                // console.log("🚀 ~ .then ~ response:", response)
                setIsEventLiked(response.data.userLikedEvent);
            })
            .catch((error) => {
                catchError(error);
            })
    };

    // Use useEffect to fetch the event's like status when the component mounts
    useEffect(() => {
        if (session) {
            handleFetchEventLikeStatus(eventInfo.id);
        }
    }, [session]);

    return (
        <div className={`${appTheme === Theme.Light ? styles.mainSectionLightTheme : styles.mainSection} ${forOrdersPage ? styles.opMainSection : ''}`}>
            <div className={forOrdersPage ? styles.eventImageForOrderPage : styles.eventImage}>
                <Image src={eventInfo.mainImageUrl} alt='Event flyer' fill sizes="auto" />
            </div>
            {/* {!hideStatusTag && <span className={styles.tag}>Latest</span>} */}
            <div className={styles.eventDetails}>
                <div className={styles.leftInfo}>
                    <h2 className={styles.title}>{eventInfo?.title}</h2>
                    <p className={styles.datePosted}>Posted on: {moment(eventInfo.createdAt).format('Do MMMM YYYY')}</p>
                    <Link className={styles.publisherInfo} href={`/u/${eventInfo.user.username ?? eventInfo.user.id}`}>
                        <div className={styles.publisherInfo__image}>
                            <Image src={eventInfo.user.profilePhoto ?? images.user_avatar} alt='Avatar' fill sizes="auto" />
                        </div>
                        <div className={styles.publisherInfo__name}>{`${eventInfo?.user.firstName} ${eventInfo?.user.lastName}`}</div>
                    </Link>
                    <div className={styles.dateTime}>
                        <h4>{moment(eventInfo?.date).format("MMM. Do YYYY")}</h4>
                        |
                        <h4>{eventInfo.time}</h4>
                    </div>
                    {/* <div className={styles.location}>
                        <p>{eventInfo?.location.blockNumber + ' ' + eventInfo?.location.street + ' ' + eventInfo?.location.city + ', ' + eventInfo?.location.state + ', ' + eventInfo?.location.country}</p>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${eventInfo?.location.blockNumber},+${eventInfo?.location.street},+${eventInfo?.location.city}+${eventInfo?.location.state}+${eventInfo?.location.country}`} target='_blank'>
                            <button>Get directions on map</button>
                        </Link>
                    </div> */}
                    <div className={styles.location}>
                        <p>{eventInfo.venue}</p>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${eventInfo.venue}`} target='_blank'>
                            <button>Get directions on map</button>
                        </Link>
                    </div>
                    {
                        forOrdersPage ?
                            <div className={styles.bottomArea}>
                                <Link href={`${hostUrl}/event/${eventInfo.id}`} className={styles.rePurchaseBtn}>
                                    Buy again
                                </Link>
                                {/* <button className={styles.reportEvent} disabled>Report event</button> */}
                            </div>
                            :
                            <div className={styles.bottomArea}>
                                {eventInfo && eventInfo?.tickets == null ?
                                    <>
                                        <div className={styles.priceArea}>
                                            <span>Ticket price:</span>
                                            {/* <h2>&#8358;{eventInfo?.ticketPrice.amount.toLocaleString()}</h2> */}
                                        </div>
                                        <button>Purchase your ticket(s)</button>
                                    </>
                                    :
                                    <ScrollLink
                                        to="optionalSection"
                                        smooth={true}
                                        duration={200}
                                        offset={-100}
                                        onClick={() => setTicketsSelectionContainerIsVisible && setTicketsSelectionContainerIsVisible(true)}>
                                        <button>Get available tickets</button>
                                    </ScrollLink>
                                }
                            </div>
                    }
                </div>
                <div className={forOrdersPage ? styles.actionButtonsForOrderPage : styles.actionButtons}>
                    <Tooltip
                        position={onMobile ? "top" : onDesktop ? "left" : undefined}
                        tooltipText='Add to calender'>
                        <div className={styles.actionButton} onClick={() => addEventToGoogleCalender && addEventToGoogleCalender()}>
                            <CalenderIcon />
                        </div>
                    </Tooltip>
                    {/* <Tooltip
                        position={onMobile ? "top" : onDesktop ? "left" : undefined}
                        tooltipText='Like event' action={() => handleUpdateUserFavouriteEvents(eventInfo.id, isEventLiked ? EventFavoriteAction.Unlike : EventFavoriteAction.Like)}>
                        <div className={styles.actionButton}>
                            <motion.span
                                style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                                whileTap={{ scale: 2.5 }}
                                transition={{ duration: 0.35 }}>
                                <LikeIcon isLiked={isEventLiked} />
                            </motion.span>
                        </div>
                    </Tooltip> */}
                    <EventLikeButton eventInfo={eventInfo} forEventInfo />
                    <Tooltip
                        position={onMobile ? "top" : onDesktop ? "left" : undefined}
                        tooltipText='Share event'>
                        <div
                            className={styles.actionButton}
                            style={{ backgroundColor: '#D5542A' }}
                            onClick={() => {
                                shareEventMobile()
                            }}>
                            <ShareIcon />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default EventMainInfo;