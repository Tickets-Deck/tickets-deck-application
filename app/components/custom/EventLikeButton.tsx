import { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { LikeIcon } from "../SVGs/SVGicons";
import eventInfoStyles from "@/app/styles/EventInfo.module.scss";
import eventCardStyles from "@/app/styles/EventCard.module.scss";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { EventFavoriteAction, EventResponse } from "@/app/models/IEvents";
import { useSession } from "next-auth/react";
import { useFetchEventLikeStatus, useLikeEvent } from "@/app/api/apiClient";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";
import { catchError } from "@/app/constants/catchError";

interface EventLikeButtonProps {
    eventInfo: EventResponse
    forEventCard?: boolean
    forEventInfo?: boolean
}

const EventLikeButton: FunctionComponent<EventLikeButtonProps> = ({ eventInfo, forEventCard, forEventInfo }): ReactElement => {

    const { data: session } = useSession();
    const likeEvent = useLikeEvent();
    const fetchEventLikeStatus = useFetchEventLikeStatus();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const { isUserLoginPromptVisible, toggleUserLoginPrompt } = useContext(ApplicationContext) as ApplicationContextData;
    const [isEventLiked, setIsEventLiked] = useState(false);

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
        <>
            {
                forEventInfo &&
                <Tooltip
                    position={onMobile ? "top" : onDesktop ? "left" : undefined}
                    tooltipText='Like event' 
                    action={() => handleUpdateUserFavouriteEvents(eventInfo.id, isEventLiked ? EventFavoriteAction.Unlike : EventFavoriteAction.Like)}>
                    <div className={eventInfoStyles.actionButton}>
                        <motion.span
                            style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                            whileTap={{ scale: 2.5 }}
                            transition={{ duration: 0.35 }}>
                            <LikeIcon isLiked={isEventLiked} />
                        </motion.span>
                    </div>
                </Tooltip>
            }
            {
                forEventCard &&
                <button className={eventCardStyles.actions__like} onClick={() => handleUpdateUserFavouriteEvents(eventInfo.id, isEventLiked ? EventFavoriteAction.Unlike : EventFavoriteAction.Like)}>
                    <motion.span
                        style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                        whileTap={{ scale: 3 }}
                        transition={{ duration: 0.5 }}>
                        <LikeIcon isLiked={isEventLiked} />
                    </motion.span>
                </button>
            }
        </>
    );
}

export default EventLikeButton;