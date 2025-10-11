import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Icons } from "../ui/icons";
import { Link as ScrollLink } from "react-scroll";
import Tooltip from "../custom/Tooltip";
import Link from "next/link";
import Image from "next/image";
import images from "@/public/images";
import moment from "moment";
import { EventResponse } from "@/app/models/IEvents";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { useApplicationContext } from "@/app/context/ApplicationContext";
import { useFetchEventViewsCount } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import EventLikeButton from "../custom/EventLikeButton";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { useToast } from "@/app/context/ToastCardContext";
import { Session } from "next-auth";
import { buildCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { eventHelpers } from "@/helpers/event";

interface EventMainInfoProps {
  eventInfo: EventResponse;
  setTicketsSelectionContainerIsVisible?: Dispatch<SetStateAction<boolean>>;
  forOrdersPage?: boolean;
  hideStatusTag?: boolean;
  hostUrl?: string;
  setIsPopupOpen: (value: SetStateAction<boolean>) => void;
  session: Session | null;
}

const EventMainInfo: FunctionComponent<EventMainInfoProps> = ({
  eventInfo,
  setTicketsSelectionContainerIsVisible,
  forOrdersPage,
  hostUrl,
  setIsPopupOpen,
  session,
}): ReactElement => {
  const toastHandler = useToast();
  const { handleRecordEventView } = useApplicationContext();
  const fetchEventViewsCount = useFetchEventViewsCount();

  const { generateSlugOrId } = eventHelpers;

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  const [eventViewsCount, setEventViewsCount] = useState<number>();

  async function shareEvent() {
    const eventUrl = `${
      window.location.origin + ApplicationRoutes.GeneralEvent + generateSlugOrId(eventInfo)
    }`;

    navigator.clipboard
      .writeText(`${eventInfo?.title} - Ticketsdeck Events: ${eventUrl}`)
      .then(() => {
        toastHandler.logSuccess(
          "Link copied!",
          `The link to ${eventInfo?.title} event has been copied.`
        );
      })
      .catch((error) => {
        toastHandler.logError(
          "We couldn't copy link",
          "Failed to copy event link. Please try again."
        );
      });
  }

  const eventLocation = eventInfo.location
    ? eventInfo.location.address +
      " " +
      eventInfo.location.city +
      ", " +
      eventInfo.location.state +
      ", " +
      eventInfo.location.country
    : eventInfo.venue;

  function addEventToGoogleCalender() {
    if (!eventInfo) {
      return;
    }
    const eventTitle = eventInfo?.title;
    const eventDate = moment(eventInfo?.startDate, "YYYY-MM-DD");
    const eventTime = moment(eventInfo?.startDate, "hh:mm a");
    const location = eventLocation;

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${eventDate}T${eventTime}%2F${eventDate}T${eventTime}&location=${encodeURIComponent(
      location
    )}`;

    window.open(googleCalendarUrl, "_blank");
  }

  async function handleFetchEventViewsCount(eventId: string) {
    await fetchEventViewsCount(eventId)
      .then((response) => {
        setEventViewsCount(response.data.viewsCount);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  // Use useEffect to fetch the event's like status when the component mounts
  useEffect(() => {
    handleRecordEventView(eventInfo.id, session?.user.id as string);
    handleFetchEventViewsCount(eventInfo.id);
  }, [session]);

  return (
    <div
      className={`flex flex-col md:flex-row items-center rounded-3xl p-6 bg-container-grey gap-4 relative min-h-[320px] ${
        forOrdersPage ? "md:flex-col" : ""
      }`}
    >
      <div
        className={`${
          forOrdersPage
            ? "w-full h-[200px]"
            : "w-full md:w-1/3 md:min-w-[30%] h-[300px]"
        } rounded-2xl overflow-hidden relative after after:bg-black after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:opacity-[0] hover:after:opacity-40 after:transition-all after:duration-300 group`}
      >
        <Image
          src={buildCloudinaryImageUrl(eventInfo.mainImageUrl)}
          alt="Event flyer"
          fill
          className="object-cover"
        />
        <button
          onClick={() => setIsPopupOpen(true)}
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 p-2 px-4 rounded-full flex flex-row gap-2 items-center bg-primary-color text-sm w-fit h-fit z-[3] hover:bg-white hover:text-primary-color group-hover:bottom-4 transition-all"
        >
          <Icons.Expand className="w-4 h-4 [&_path]:stroke-primary-color-sub" />
          Expand
        </button>
      </div>
      {/* {!hideStatusTag && <span className={styles.tag}>Latest</span>} */}
      <div className="flex items-end gap-1 w-full min-h-full h-fit">
        <div className="flex flex-col w-full gap-3">
          <h2 className="text-3xl font-semibold text-white">
            {eventInfo?.title}
          </h2>
          <div className="text-xs flex flex-row space-x-2">
            <p className="text-gray-300 text-nowrap">
              Posted on: {moment(eventInfo.createdAt).format("Do MMMM YYYY")}
            </p>
            {eventViewsCount ? (
              <>
                <span>|</span>
                <span className="flex flex-row items-center gap-1">
                  <Icons.Eye width={16} height={16} /> {eventViewsCount}
                </span>
              </>
            ) : null}
          </div>

          <Link
            href={`/u/${
              eventInfo.publisher.username ?? eventInfo.publisher.id
            }`}
            className="flex items-center gap-2 w-fit hover:opacity-75"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image
                src={eventInfo.publisher.profilePhoto || images.user_avatar}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-white text-sm font-medium capitalize">{`${eventInfo?.publisher.firstName} ${eventInfo?.publisher.lastName}`}</span>
          </Link>
          <div className="flex items-center gap-3 text-white">
            <h4>{moment(eventInfo?.startDate).format("LL")}</h4>
            <span>|</span>
            <h4>{moment(eventInfo?.startDate).format("hh:mm a")}</h4>
          </div>

          <div className="w-full">
            <p className="text-sm text-white capitalize">{eventInfo.venue}</p>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${eventInfo.venue}`}
              target="_blank"
            >
              <button className="text-gray-400 underline text-sm hover:opacity-75">
                Get directions on map
              </button>
            </Link>
          </div>
          {eventInfo.purchaseEndDate &&
          new Date(eventInfo.purchaseEndDate) > new Date() ? (
            forOrdersPage ? (
              <div className="flex gap-3 mt-2">
                <Link
                  href={`${hostUrl}/event/${eventInfo.id}`}
                  className="bg-white text-black font-medium rounded-full px-6 py-2 text-sm hover:opacity-80"
                >
                  Buy again
                </Link>
                {/* <button className={styles.reportEvent} disabled>Report event</button> */}
              </div>
            ) : (
              <div className="flex gap-3 mt-2">
                {eventInfo && eventInfo?.tickets == null ? (
                  <></>
                ) : (
                  <ScrollLink
                    to="optionalSection"
                    smooth={true}
                    duration={200}
                    offset={-100}
                    onClick={() =>
                      setTicketsSelectionContainerIsVisible &&
                      setTicketsSelectionContainerIsVisible(true)
                    }
                  >
                    <button className="bg-white text-black font-medium rounded-full px-6 py-3 text-base hover:opacity-80">
                      Get available tickets
                    </button>
                  </ScrollLink>
                )}
              </div>
            )
          ) : (
            <div className="flex flex-row mt-3 bg-yellow-300/10 border-[1.5px] border-yellow-300/80 p-2 px-4 rounded-lg w-fit">
              <p>Sale has ended</p>
            </div>
          )}
        </div>

        <div
          className={`${
            forOrdersPage ? "!w-fit" : ""
          } flex flex-col w-fit gap-3 [&_svg]:w-4 [&_svg]:h-4`}
        >
          <Tooltip
            position={onMobile ? "top" : onDesktop ? "left" : undefined}
            tooltipText="Add to calender"
          >
            <div
              className="w-10 h-10 rounded-full bg-white grid place-items-center cursor-pointer"
              onClick={addEventToGoogleCalender}
            >
              <Icons.Calender />
            </div>
          </Tooltip>
          <EventLikeButton
            eventInfo={eventInfo}
            forEventInfo
            session={session}
          />
          <Tooltip
            position={onMobile ? "top" : onDesktop ? "left" : undefined}
            tooltipText="Share event"
          >
            <div
              className="w-10 h-10 rounded-full bg-[#D5542A] grid place-items-center cursor-pointer"
              onClick={() => shareEvent()}
            >
              <Icons.Share />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default EventMainInfo;
