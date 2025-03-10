import {
    FunctionComponent,
    ReactElement,
    useContext,
    useEffect,
    useState,
} from "react";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { Icons } from "../ui/icons";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { EventResponse } from "@/app/models/IEvents";
import { useSession } from "next-auth/react";
import { useFetchEventLikeStatus, useLikeEvent, useUnlikeEvent } from "@/app/api/apiClient";
import { ApplicationContext, ApplicationContextData } from "@/app/context/ApplicationContext";
import { catchError } from "@/app/constants/catchError";

interface EventLikeButtonProps {
    eventInfo: EventResponse;
    forEventCard?: boolean;
    forEventInfo?: boolean;
    skipFetch?: boolean;
}

const EventLikeButton: FunctionComponent<EventLikeButtonProps> = ({
    eventInfo,
    forEventCard,
    forEventInfo,
    skipFetch,
}): ReactElement => {
    const { data: session } = useSession();
    const user = session?.user;

    const likeEvent = useLikeEvent();
    const unlikeEvent = useUnlikeEvent();
    const fetchEventLikeStatus = useFetchEventLikeStatus();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof isMobile == "boolean" && isMobile;
    const onDesktop = typeof isMobile == "boolean" && !isMobile;

    const { isUserLoginPromptVisible, toggleUserLoginPrompt } = useContext(ApplicationContext) as ApplicationContextData;
    const [isEventLiked, setIsEventLiked] = useState(false);

    async function handleLikeEvent(eventId: string) {
        // Check if user is logged in and prompt user to login if not
        if (!isUserLoginPromptVisible && !session) {
            toggleUserLoginPrompt();
            return;
        }

        // Update the event's like status
        setIsEventLiked(!isEventLiked);

        await likeEvent(user?.token as string, user?.id as string, eventId)
            .then(() => { })
            .catch((error) => {
                catchError(error);
                // Revert the event's like status
                setIsEventLiked(!isEventLiked);
            });
    }

    async function handleUnlikeEvent(eventId: string) {
        // Check if user is logged in and prompt user to login if not
        if (!isUserLoginPromptVisible && !session) {
            toggleUserLoginPrompt();
            return;
        }

        // Update the event's like status
        setIsEventLiked(!isEventLiked);

        await unlikeEvent(session?.user.token as string, user?.id as string, eventId)
            .then((response) => {
                console.log("🚀 ~ .then ~ like event response:", response)
            })
            .catch((error) => {
                console.log("🚀 ~ handleUnlikeEvent ~ error:", error)
                catchError(error);
                // Revert the event's like status
                setIsEventLiked(!isEventLiked);
            });
    }

    async function handleFetchEventLikeStatus(eventId: string) {
        await fetchEventLikeStatus(session?.user.token as string, eventId)
            .then((response) => {
                setIsEventLiked(response.data.status);
            })
            .catch((error) => {
                catchError(error);
            });
    }

    // Use useEffect to fetch the event's like status when the component mounts
    useEffect(() => {
        if (session && !skipFetch) {
            handleFetchEventLikeStatus(eventInfo.id);
        }
    }, [session, skipFetch]);

    return (
        <>
            {forEventInfo && (
                <Tooltip
                    position={onMobile ? "top" : onDesktop ? "left" : undefined}
                    tooltipText='Like event'
                    action={() => isEventLiked ? handleLikeEvent(eventInfo.id) : handleUnlikeEvent(eventInfo.id)}
                >
                    <div className='ml-auto size-8 min-[400px]:size-[2.5rem] rounded-full bg-white grid place-items-center relative'>
                        <motion.span
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                            }}
                            whileTap={{ scale: 2.5 }}
                            transition={{ duration: 0.35 }}
                        >
                            <Icons.Like className='size-4' isLiked={isEventLiked} />
                        </motion.span>
                    </div>
                </Tooltip>
            )}
            {forEventCard && (
                <button
                    style={{ display: "none" }}
                    className='size-[1.875rem] rounded-full grid place-items-center bg-transparent cursor-pointer hover:bg-white/20'
                    onClick={() => isEventLiked ? handleLikeEvent(eventInfo.id) : handleUnlikeEvent(eventInfo.id)}
                >
                    <motion.span
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                        }}
                        whileTap={{ scale: 3 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Icons.Like className='size[0.8rem]' isLiked={isEventLiked} />
                    </motion.span>
                </button>
            )}
        </>
    );
};

export default EventLikeButton;
