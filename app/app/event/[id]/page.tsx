"use client";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
  useContext,
} from "react";
import styles from "../../../styles/EventDetails.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import images from "../../../../public/images";
import {
  CalenderIcon,
  HeartIcon,
  ShareIcon,
} from "../../../components/SVGs/SVGicons";
import Tooltip from "../../../components/custom/Tooltip";
import { ToastContext } from "../../../extensions/toast";
import moment from "moment";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import SkeletonEventInfo from "../../../components/Skeletons/SkeletonEventInfo";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";
import { useFetchEventById } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { StorageKeys } from "@/app/constants/storageKeys";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { toast } from "sonner";

interface EventDetailsProps {
  params: { id: string };
}

const EventDetails: FunctionComponent<EventDetailsProps> = ({
  params,
}): ReactElement => {
  const router = useRouter();

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  const id = params.id;

  const fetchEventInfo = useFetchEventById();
  const toasthandler = useContext(ToastContext);

  const [eventInfo, setEventInfo] = useState<EventResponse>();
  const [eventTicketTypes, setEventTicketTypes] =
    useState<RetrievedTicketResponse[]>();
  // const [selectedEventTicketTypes, setSelectedEventTicketTypes] = useState<RetrievedTicketType[]>();
  const [loader, setLoader] = useState(false);
  const [totalSelectedTicketsCount, setTotalSelectedTicketsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [
    ticketsSelectionContainerIsVisible,
    setTicketsSelectionContainerIsVisible,
  ] = useState(false);

  const [ticketDeliveryModalIsVisible, setTicketDeliveryModalIsVisible] =
    useState(false);

  const eventLocation =
    eventInfo?.location?.address +
    " " +
    eventInfo?.location?.city +
    ", " +
    eventInfo?.location?.state +
    ", " +
    eventInfo?.location?.country;

  // useEffect hook to set total selected tickets count
  useEffect(() => {
    /**
     * the reduce function iterates through each ticket in the eventTicketTypes array and adds up the selectedTickets count for each ticket.
     * The 0 passed as the second argument to reduce initializes the total variable to 0.
     */
    setTotalSelectedTicketsCount(
      eventTicketTypes?.reduce(
        (total, ticket) => total + ticket.selectedTickets,
        0
      ) as number
    );
  }, [eventTicketTypes]);

  // useEffect hook to set total price
  useEffect(() => {
    // Filter through event ticket types availableParallelism, then check for only the selected tickets
    const selectedTickets = eventTicketTypes?.filter(
      (ticket) => ticket.isSelected
    );
    // iterates through each ticket in the selected tickets array and adds up the multiplication of the ticket price and the selected tickets count for each ticket.
    setTotalPrice(
      selectedTickets?.reduce(
        (total, ticket) => total + ticket.price * ticket.selectedTickets,
        0
      ) as number
    );
  }, [eventTicketTypes]);

  function shareEvent() {
    const eventUrl = `${
      window.location.origin + ApplicationRoutes.GeneralEvent + eventInfo?.id
    }`;

    navigator.clipboard
      .writeText(`${eventInfo?.title} - Ticketsdeck Events: ${eventUrl}`)
      .then(() => {
        toast.success(`The link to ${eventInfo?.title} has been copied.`);
      })
      .catch((error) => {
        toast.error("Failed to copy event link. Please try again.");
      });
  }

  function addEventToGoogleCalender() {
    if (!eventInfo) {
      return;
    }
    const eventTitle = eventInfo?.title;
    const eventDate = moment(eventInfo.date).format("YYYY-MM-DD"); // Use the actual event date
    // const eventTime = moment(eventInfo?.eventDateTime).format('HH:MM');      // Use the actual event time
    const eventTime = moment(eventInfo.time); // Use the actual event time
    const location = eventLocation;

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${eventDate}T${eventTime}%2F${eventDate}T${eventTime}&location=${encodeURIComponent(
      location
    )}`;

    window.open(googleCalendarUrl, "_blank");
  }

  function incrementTicket(selectedTicketType: RetrievedTicketResponse) {
    const updatedTicketsCount = eventTicketTypes?.map((ticketType) => {
      if (ticketType === selectedTicketType) {
        return {
          ...ticketType,
          selectedTickets: ticketType.selectedTickets + 1,
          isSelected: true,
        };
      }
      return ticketType;
    });
    setEventTicketTypes(updatedTicketsCount);
  }
  function decrementTicket(selectedTicketType: RetrievedTicketResponse) {
    const updatedTicketsCount = eventTicketTypes?.map((ticketType) => {
      if (ticketType === selectedTicketType) {
        if (selectedTicketType.selectedTickets == 1) {
          return {
            ...ticketType,
            selectedTickets: ticketType.selectedTickets - 1,
            isSelected: false,
          };
        }
        return {
          ...ticketType,
          selectedTickets: ticketType.selectedTickets - 1,
          isSelected: true,
        };
      }
      return ticketType;
    });
    setEventTicketTypes(updatedTicketsCount);
  }

  function retrieveNewlyCreatedEvent() {
    // Fetch the newly created event from  session storage
    const event = sessionStorage.getItem(StorageKeys.NewlyCreatedEvent);

    // Parse the event from string to object
    const newEvent = JSON.parse(event!);

    // Return the new event
    return newEvent;
  }

  async function handleFetchEventInfo() {
    // console.log('Fetching event info...');

    // Set running flag
    setLoader(true);

    // Retrieve the event info
    const retrievedEvent = retrieveNewlyCreatedEvent();

    // Check if the ID of the retrieved event is the same as the ID in the URL
    if (retrievedEvent && retrievedEvent.id == id) {
      // Update the event results
      setEventInfo(retrievedEvent);

      // Unset running flag
      setLoader(false);

      // Stop execution
      return;
    }

    // If we get here, it means the event is not the newly created event
    await fetchEventInfo(id)
      .then((response) => {
        // Log the result
        // console.log('Result:', response.data);

        // Set the event results
        let _eventInfo = response.data;

        if (!_eventInfo) {
          // Route to event not-found page
          router.push(`/event/not-found`);
        }

        // Update the event results
        setEventInfo(_eventInfo);
      })
      .catch((error) => {
        // Display the error
        toasthandler?.logError(
          "Error fetching results",
          "We encountered an error while fetchng event offers. Please try again."
        );

        catchError(error);

        // Unset running flag
        setLoader(false);
      });
  }

  useEffect(() => {
    // Clear previous info
    setEventInfo(undefined);
    setEventTicketTypes(undefined);
    setTicketsSelectionContainerIsVisible(false);

    if (params && params.id) {
      console.log("Fetching info based on Event ID:", id);
      handleFetchEventInfo();
    } else {
      // Route to flight not-found page
      router.push(`/event/not-found`);
    }
  }, [params]);

  useEffect(() => {
    if (eventInfo && eventInfo.tickets !== null) {
      const updatedTicketTypes = eventInfo.tickets.map((ticket) => ({
        ...ticket,
        isSelected: false,
        selectedTickets: 0,
      }));
      setEventTicketTypes(updatedTicketTypes);
      console.log(eventTicketTypes);
    }
  }, [eventInfo]);

  return (
    <div className='text-white bg-dark-grey'>
      <section className='relative flex flex-col gap-3 pb-12 w-full'>
        <div className='absolute size-full'>
          <video
            className='size-full object-cover object-bottom after:bg-white after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:opacity-[0.5] after:bg-[linear-gradient(180deg,#8133f1 0%,#6315d3_100%)]'
            autoPlay
            loop
            muted
            playsInline
            src='https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4'
          />
        </div>
        <div className='sectionPadding !py-6 !w-full min-[550px]:!w-[70%] z-[2] relative flec flex-col gap-3'>
          <span className='rounded-lg py-1 px-2 bg-[rgba(255,255,255,0.1)] flex items-center gap-1 w-fit text-xs'>
            Time to grab those tickets!{" "}
            <span className='bg-transparent border-none p-0 size-4'>
              <Image src={images.woman_dancing} alt='Woman dancing' />
            </span>
          </span>
          <h2 className='font-medium text-[30px] sm:text-[35px] leading-none'>
            Event Information
          </h2>
        </div>
      </section>
      {eventInfo ? (
        <section className='sectionPadding z-[2] relative flex flex-col gap-0 sm:translate-y-9 translate-y-16 !pb-10'>
          <div className='flex items-center rounded-[1.5rem] bg-container-grey gap-4 relative min-h-[320px] h-fit p-4 min-[400px]:p-0 max-[550px]:flex-col'>
            <div className='[&_img]:object-cover h-[180px] min-[350px]:w-full min-[550px]:w-[30%] min-[550px]:min-h-[100%] min-[550px]:h-[300px] rounded-2xl overflow-hidden inline-flex'>
              <Image src={eventInfo.mainImageUrl} alt='Event flyer' fill />
            </div>
            {/* <span className={styles.tag}>Latest</span> */}
            <div className='flex flex-col min-[400px]:flex-row gap-1 items-end w-full min-h-full h-fit'>
              <div className='w-full order-2 min-[400px]:order-1 flex flex-col gap-[0.85rem]'>
                <h2 className='min-[400px]:text-[30px] text-[20px] font-semibold leading-none'>
                  {eventInfo?.title}
                </h2>
                <p className='text-purple-grey text-xs'>
                  Posted on:{" "}
                  {moment(eventInfo?.createdAt).format("Do MMMM YYYY")}
                </p>
                <div className='flex items-center gap-[0.35rem] w-fit hover:opacity-65'>
                  <div className='size-8 min-[400px]:size-10 relative rounded-full overflow-hidden'>
                    <Image
                      className='size-full object-cover'
                      src={eventInfo.user.profilePhoto ?? images.user_avatar}
                      alt='Avatar'
                      fill
                    />
                  </div>
                  <div className='text-white font-medium text-sm min-[400px]:text-base'>{`${eventInfo.user.firstName} ${eventInfo.user.lastName}`}</div>
                </div>
                <div className='flex items-center gap-3'>
                  <h4 className='font-medium text-white'>
                    {moment(eventInfo?.date).format("MMM. Do YYYY")}
                  </h4>
                  <h4 className='font-medium text-white'>{eventInfo.time}</h4>
                </div>
                {/* <div className={styles.location}>
                                    <p>{eventInfo?.location.blockNumber + ' ' + eventInfo?.location.street + ' ' + eventInfo?.location.city + ', ' + eventInfo?.location.state + ', ' + eventInfo?.location.country}</p>
                                    <Link href={`https://www.google.com/maps/search/?api=1&query=${eventInfo?.location.blockNumber},+${eventInfo?.location.street},+${eventInfo?.location.city}+${eventInfo?.location.state}+${eventInfo?.location.country}`} target='_blank'>
                                        <button>Get directions on map</button>
                                    </Link>
                                </div> */}
                <div className='w-full'>
                  <p className='text-sm text-white'>{eventInfo.venue}</p>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${eventInfo.venue}`}
                    target='_blank'
                  >
                    <button className='text-purple-grey underline bg-transparent border-none outline-none cursor-pointer hover:opacity-80'>
                      Get directions on map
                    </button>
                  </Link>
                </div>
                <div className='flex gap-3 mt-[0.8rem] flex-col min-[550px]:flex-row'>
                  {
                    eventInfo && eventInfo?.tickets == null ? (
                      <>
                        <div className=''>
                          <span className='text-purple-grey'>
                            Ticket price:
                          </span>
                          {/* <h2>&#8358;{eventInfo?.ticket.amount.toLocaleString()}</h2> */}
                        </div>
                        <button className='primaryButton !text-sm min-[400px]:!text-lg !font-medium !text-black !rounded-[2.5rem] !bg-white'>
                          Purchase your ticket(s)
                        </button>
                      </>
                    ) : (
                      <></>
                    )
                    // <ScrollLink
                    //     to="optionalSection"
                    //     smooth={true}
                    //     duration={200}
                    //     offset={-100}
                    //     onClick={() => { }}>
                    //     <button>Edit event information</button>
                    // </ScrollLink>
                  }
                </div>
              </div>
              <div className='w-full mb-2 gap-2 flex-row min-[400px]:flex-col min-[400px]:w-[8%] flex min-[400px]:gap-[0.85rem] '>
                <Tooltip tooltipText='Add to calender'>
                  <div
                    className='ml-auto size-8 min-[400px]:size-10 [&_svg]:size-4 rounded-full bg-white grid place-items-center relative'
                    onClick={() => addEventToGoogleCalender()}
                  >
                    <CalenderIcon />
                  </div>
                </Tooltip>
                <Tooltip tooltipText='Like event'>
                  <div className='ml-auto size-8 min-[400px]:size-10 [&_svg]:size-4 rounded-full bg-white grid place-items-center relative'>
                    <HeartIcon />
                  </div>
                </Tooltip>
                <Tooltip tooltipText='Share event'>
                  <div
                    className='ml-auto size-8 min-[400px]:size-10 [&_svg]:size-4 rounded-full bg-white grid place-items-center relative'
                    style={{ backgroundColor: "#D5542A" }}
                    onClick={() => shareEvent()}
                  >
                    <ShareIcon />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div>
            {ticketsSelectionContainerIsVisible &&
              eventTicketTypes &&
              eventTicketTypes.length > 0 && (
                <div
                  className='rounded-2xl bg-[linear-gradient(180deg,_rgba(49,49,49,0)_4.17%_#313131_100%)] w-full min-[550px]:w-[70%] pt-8 min-[550px]:pt-10 px-6 pb-[2.5px]'
                  id='optionalSection'
                >
                  <div className='flex flex-col items-center gap-0.5 mb-6 text-center [&_p]:text-purple-grey'>
                    <h3 className='text-lg font-medium text-white'>
                      Select the tickets you would like to get, and the number
                      for each.
                    </h3>
                    <p>By the way, you can select multiple ticket types.</p>
                  </div>
                  <div className='flex flex-col min-[550px]:grid [grid-template-columns:_repeat(auto-fill,_minmax(calc(50%-1.25rem),_1fr))]'>
                    {eventTicketTypes?.map((ticketType, index) => {
                      return (
                        <div
                          className={`flex flex-col gap-2 bg-primary-color-sub/10 p-5 rounded-lg border-[0.2rem] border-transparent ${
                            ticketType.selectedTickets > 0
                              ? "border-primary-color-sub/20"
                              : ""
                          }`}
                          key={index}
                        >
                          <div className='flex items-center justify-between'>
                            <p>{ticketType.name}</p>
                            <h4 className='font-medium'>
                              &#8358;{ticketType.price.toLocaleString()}
                            </h4>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span
                              className='size-[1.875rem] rounded bg-primary-color-sub/10 cursor-pointer grid place-items-center hover:bg-primary-color-sub/40'
                              onClick={() => {
                                ticketType.selectedTickets > 0 &&
                                  decrementTicket(ticketType);
                              }}
                            >
                              -
                            </span>
                            <p>
                              {ticketType.selectedTickets}{" "}
                              {ticketType.selectedTickets > 1
                                ? "tickets"
                                : "ticket"}
                            </p>
                            <span onClick={() => incrementTicket(ticketType)}>
                              +
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className='flex flex-col gap-2 items-start min-[550px]:items-end min-[550px]:gap-0 min-[550px]:items-end justify-between my-4'>
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-sm font-light text-purple-grey'>
                        {totalSelectedTicketsCount}{" "}
                        {totalSelectedTicketsCount > 1 ? "tickets" : "ticket"}{" "}
                        selected
                      </p>
                      <div className='flex items-center gap-[0.625rem]'>
                        <p className='text-primary-color-sub-50'>
                          Total Price:
                        </p>
                        <h1 className='text-2xl font-medium'>
                          &#8358;{totalPrice?.toLocaleString()}
                        </h1>
                      </div>
                    </div>
                    <button
                      className='max-[550px]:!w-full max-[550px]:!justify-center primaryButton !rounded-10 !bg-white !text-black !font-medium !text-lg'
                      onClick={() => setTicketDeliveryModalIsVisible(true)}
                    >
                      Purchase{" "}
                      {totalSelectedTicketsCount > 1 ? "tickets" : "ticket"}
                    </button>
                  </div>
                </div>
              )}
            {ticketsSelectionContainerIsVisible &&
              (!eventTicketTypes || eventTicketTypes?.length == 0) && (
                <div className='rounded-2xl bg-[linear-gradient(180deg,_rgba(49,49,49,0)_4.17%_#313131_100%)] w-full min-[550px]:w-[70%] pt-8 min-[550px]:pt-10 px-6 pb-[2.5px]'>
                  <div className='flex flex-col items-center gap-0.5 mb-6 text-center [&_p]:text-purple-grey'>
                    <h3 className='text-lg font-medium text-white'>Oops!</h3>
                    {/* <p>By the way, you can select multiple ticket types.</p> */}
                  </div>
                  <div className='flex flex-col w-full min-[550px]:w-[60%] mx-auto text-center pb-10'>
                    <div className='size-[6.5rem] my-6'>
                      <Image src={images.sad_face} alt='Sad face' />
                    </div>
                    <h4 className='text-[20px] text-purple-grey mb-2'>
                      We encountered an issue, while trying to get the available
                      tickets.
                    </h4>
                    <p className='text-base'>
                      Please{" "}
                      <span
                        className='underline cursor-pointer hover:text-purple-grey'
                        onClick={() => router.refresh()}
                      >
                        reload
                      </span>{" "}
                      the page, and keep your fingers crossed while try our best
                      again.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </section>
      ) : (
        <SkeletonEventInfo forConsole />
      )}
      {/* <EventsGroup title='Similar Events' subText='Dear superstar, below is a list of all events available at the moment.' eventsData={events} /> */}
    </div>
  );
};

export default EventDetails;
