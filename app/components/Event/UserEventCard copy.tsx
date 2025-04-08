import Link from "next/link";
import {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import { Icons } from "../ui/icons";
import Image from "next/image";
import moment from "moment";
import { EventResponse } from "@/app/models/IEvents";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import EventLikeButton from "../custom/EventLikeButton";
import { useToast } from "@/app/context/ToastCardContext";

interface EventCardProps {
  event: EventResponse;
  mobileAndActionButtonDismiss?: boolean;
  consoleDisplay?: boolean;
  gridDisplay?: boolean;
  setIsDeleteConfirmationModalVisible?: Dispatch<SetStateAction<boolean>>;
  setSelectedEvent?: Dispatch<SetStateAction<EventResponse | undefined>>;
  forFeaturedEvents?: boolean;
}

const EventCard: FunctionComponent<EventCardProps> = ({
  event,
  mobileAndActionButtonDismiss,
  consoleDisplay,
  gridDisplay,
  setIsDeleteConfirmationModalVisible,
  setSelectedEvent,
  forFeaturedEvents,
}): ReactElement => {
  const toastHandler = useToast();

  function shareEvent(eventUrl: string) {
    navigator.clipboard
      .writeText(`${event.title} - Ticketsdeck Events: ${eventUrl}`)
      .then(() => {
        toastHandler.logSuccess(
          "Success",
          `The link to ${event.title} has been copied.`
        );
      })
      .catch((error) => {
        toastHandler.logError(
          "Error",
          "Failed to copy event link. Please try again."
        );
      });
  }

  let eventDate = new Date(event.startDate);
  const currentDate = new Date();

  const eventHoldsToday =
    eventDate.getDate() === currentDate.getDate() &&
    eventDate.getMonth() === currentDate.getMonth() &&
    eventDate.getFullYear() === currentDate.getFullYear();

  return (
    <div
      className={`
          flex flex-col relative w-full overflow-x-auto snap-center md:w-full px-[10px] pt-[20px] pb-[10px] rounded-xl min-[520px]:overflow-hidden h-[300px] max-h-full bg-dark-grey-2
        ${gridDisplay ? "max-w-none" : ""}`}
      style={mobileAndActionButtonDismiss ? { minWidth: "auto" } : {}}
    >
      {/* <div className={styles.backgroundImage}>
                <Image src={images.ticketbg} alt='Ticket background' />
            </div> */}
      {/* <span className={styles.event__tag}>Latest</span> */}
      <div className="z-[2] h-32 w-full rounded-xl overflow-hidden mb-2 relative after:bg-[linear-gradient(180deg,_rgba(0,0,0,0)_4.17%,_rgba(#000,_0.2)_100%)] after:size-full after:top-0 after:left-0 after:absolute after:opacity-100 after:pointer-events-none hover:after:opacity-0 [&_img]:hover:scale-110 hover:brightness-110">
        {event.isArchived ? (
          <Image src={event.mainImageUrl} alt="Event flyer" fill />
        ) : (
          <Link
            className="size-full"
            href={
              consoleDisplay ? `/app/event/${event.id}` : `/event/${event.id}`
            }
          >
            <Image
              src={event.mainImageUrl}
              alt="Event flyer"
              fill
              className="object-cover transition-all"
            />
          </Link>
        )}
      </div>
      {/* <span className={styles.hLine}>
                <HorizontalLineIcon />
            </span> */}
      <div className="flex items-start z-[2]">
        <div className="basis-[85%] w-[76%] flex flex-col gap-1">
          <h3 className="text-left max-w-full whitespace-nowrap text-ellipsis overflow-hidden text-base font-Mona-Sans-Wide font-medium w-fit">
            {event.title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-sm text-white/80 font-medium">
              {moment(event.startDate).format("MMM DD")}
            </span>
            <span className="size-[0.188rem] bg-white rounded-full block"></span>
            <span className="text-sm text-white/80 opacity-80">
              {moment(event.startDate).format("hh:mm a")}
            </span>
          </div>
          <div className="inline-flex items-center gap-0.5 w-full">
            <Icons.LocationPin className="w-4 min-w-4 h-4" />
            <p className="text-sm font-light max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
              {event.venue}
            </p>
            {/* <p>{event.location.blockNumber + ' ' + event.location.city + ', ' + event.location.state + ', ' + event.location.country}</p> */}
          </div>
        </div>
        {(!mobileAndActionButtonDismiss || consoleDisplay) && (
          <div className="basis-[15%] flex flex-col items-end justify-between h-full">
            <div className="flex gap-[0.45rem]">
              {/* <button className={styles.actions__like} onClick={() => setIsEventLiked(!isEventLiked)}>
                                <motion.span
                                    style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                                    whileTap={{ scale: 3 }}
                                    transition={{ duration: 0.5 }}>
                                    <LikeIcon isLiked={isEventLiked} />
                                </motion.span>
                            </button> */}
              {/* <EventLikeButton
                eventInfo={event}
                forEventCard
                skipFetch={forFeaturedEvents}
              /> */}
              <button
                className="size-[1.875rem] rounded-full grid place-items-center cursor-pointer bg-[#d5542a] hover:bg-[darken(#d5542a,_amount:10%)]"
                onClick={() =>
                  shareEvent(
                    `${
                      window.location.origin +
                      ApplicationRoutes.GeneralEvent +
                      event.id
                    }`
                  )
                }
              >
                <Icons.Share className="size-[0.8rem]" />
              </button>
            </div>
            <p className="text-xs text-grey-3">{event.allowedGuestType}</p>
          </div>
        )}
      </div>
      {consoleDisplay && eventHoldsToday ? (
        <Link
          href={ApplicationRoutes.CheckIn(
            event.id,
            event.title.replace(/ /g, "-")
          )}
          className="p-2 rounded-lg bg-white text-dark-grey w-full text-center"
        >
          Check In
        </Link>
      ) : (
        <div className="flex gap-1 mt-auto">
          {consoleDisplay &&
            setIsDeleteConfirmationModalVisible &&
            setSelectedEvent &&
            !event.isArchived && (
              <Link
                href={`${ApplicationRoutes.EditEvent}/${event.id}`}
                //   className={styles.noStyle}
              >
                <button className="w-12 min-w-12 bg-white rounded-lg cursor-pointer scale-90 grid place-items-center hover:bg-[darken(#fff,_amount:10%)] [&_svg_path]:fill-primary-color">
                  <Icons.Edit />
                </button>
              </Link>
            )}
          {event.isArchived ? (
            <button className="p-2 bg-dark-grey-2 text-white w-full rounded-md pointer-events-none">
              Deleted
            </button>
          ) : (
            <Link
              className="z-[2] primaryButton !w-full justify-center hover:bg-white [&_button]:hover:text-primary-color transition-all"
              href={
                consoleDisplay
                  ? `${ApplicationRoutes.Event}/${event.id}`
                  : `/event/${event.id}`
              }
            >
              <button className="text-sm cursor-pointer bg-transparent text-white border-none outline-none mt-auto">
                View details
              </button>
            </Link>
          )}
          {consoleDisplay &&
            setIsDeleteConfirmationModalVisible &&
            setSelectedEvent &&
            !event.isArchived && (
              <button
                className="w-12 min-w-12 bg-failed-color rounded-lg cursor-pointer scale-90 grid place-items-center hover:bg-[darken(#dc143c,_amount:10%)] [&_svg_path]:fill-white"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsDeleteConfirmationModalVisible(true);
                }}
              >
                <Icons.Delete />
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
