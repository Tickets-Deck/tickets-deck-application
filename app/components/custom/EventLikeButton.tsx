import {
  FunctionComponent,
  ReactElement,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { Icons } from "../ui/icons";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { EventResponse } from "@/app/models/IEvents";
import {
  useFetchEventLikeStatus,
  useLikeEvent,
  useUnlikeEvent,
} from "@/app/api/apiClient";
import {
  ApplicationContext,
  ApplicationContextData,
} from "@/app/context/ApplicationContext";
import { catchError } from "@/app/constants/catchError";
import { Session } from "next-auth";

interface EventLikeButtonProps {
  eventInfo: EventResponse;
  forEventCard?: boolean;
  forEventInfo?: boolean;
  skipFetch?: boolean;
  session: Session | null;
}

const EventLikeButton: FunctionComponent<EventLikeButtonProps> = ({
  eventInfo,
  forEventCard,
  forEventInfo,
  skipFetch,
  session,
}): ReactElement => {
  const user = session?.user;

  const likeEvent = useLikeEvent();
  const unlikeEvent = useUnlikeEvent();
  const fetchEventLikeStatus = useFetchEventLikeStatus();

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  const { isUserLoginPromptVisible, toggleUserLoginPrompt } = useContext(
    ApplicationContext
  ) as ApplicationContextData;
  const [isEventLiked, setIsEventLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeEvent = useCallback(
    async (eventId: string) => {
      if (!isUserLoginPromptVisible && !session) {
        toggleUserLoginPrompt();
        return;
      }

      if (isLoading) return;
      setIsLoading(true);
      setIsEventLiked(true);

      try {
        await likeEvent(user?.token as string, user?.id as string, eventId);
      } catch (error) {
        setIsEventLiked(false);
        catchError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isUserLoginPromptVisible, session, user, likeEvent, toggleUserLoginPrompt]
  );

  const handleUnlikeEvent = useCallback(
    async (eventId: string) => {
      if (!isUserLoginPromptVisible && !session) {
        toggleUserLoginPrompt();
        return;
      }

      if (isLoading) return;
      setIsLoading(true);
      setIsEventLiked(false);

      try {
        await unlikeEvent(user?.token as string, user?.id as string, eventId);
      } catch (error) {
        setIsEventLiked(true);
        catchError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isUserLoginPromptVisible, session, user, unlikeEvent, toggleUserLoginPrompt]
  );

  const handleFetchEventLikeStatus = useCallback(
    async (eventId: string) => {
      if (!session?.user?.token) return;

      try {
        const response = await fetchEventLikeStatus(
          session.user.token,
          eventId
        );
        setIsEventLiked(response.data.status);
      } catch (error) {
        catchError(error);
      }
    },
    [session, fetchEventLikeStatus]
  );

  useEffect(() => {
    if (session && !skipFetch) {
      handleFetchEventLikeStatus(eventInfo.id);
    }
  }, [session, skipFetch, eventInfo.id, handleFetchEventLikeStatus]);

  const handleLikeAction = useCallback(() => {
    if (isEventLiked) {
      handleUnlikeEvent(eventInfo.id);
    } else {
      handleLikeEvent(eventInfo.id);
    }
  }, [isEventLiked, eventInfo.id, handleLikeEvent, handleUnlikeEvent]);

  const tooltipPosition = useMemo(
    () => (onMobile ? "top" : onDesktop ? "left" : undefined),
    [onMobile, onDesktop]
  );

  return (
    <>
      {forEventInfo && (
        <Tooltip
          position={tooltipPosition}
          tooltipText="Like event"
          action={handleLikeAction}
        >
          <div className="ml-auto w-10 h-10 min-[400px]:size-[2.5rem] rounded-full bg-white grid place-items-center relative">
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
              <Icons.Like className="size-4" isLiked={isEventLiked} />
            </motion.span>
          </div>
        </Tooltip>
      )}
      {forEventCard && (
        <button
          style={{ display: "none" }}
          className="size-[1.875rem] rounded-full grid place-items-center bg-transparent cursor-pointer hover:bg-white/20"
          onClick={handleLikeAction}
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
            <Icons.Like className="size[0.8rem]" isLiked={isEventLiked} />
          </motion.span>
        </button>
      )}
    </>
  );
};

export default EventLikeButton;
