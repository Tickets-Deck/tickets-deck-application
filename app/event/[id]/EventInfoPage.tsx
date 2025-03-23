"use client";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import images from "../../../public/images";
import moment from "moment";
import TicketDelivery from "../../components/Modal/TicketDelivery";
import SkeletonEventInfo from "../../components/Skeletons/SkeletonEventInfo";
import { EventResponse } from "@/app/models/IEvents";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { useFetchEventById, useFetchEventsByTags } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import TicketsSelectionContainer from "@/app/components/Event/TicketsSelection";
import TicketsFetchErrorContainer from "@/app/components/Event/TicketsFetchError";
import useResponsiveness from "../../hooks/useResponsiveness";
import EventMainInfo from "@/app/components/Event/EventInfo";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import ContactDetailsModal from "@/app/components/Modal/ContactDetailsModal";
import { CustomerContactDetails } from "@/app/models/IUser";
import { useApplicationContext } from "@/app/context/ApplicationContext";
import { ToastContext } from "@/app/context/ToastCardContext";
import { ImagePopup } from "@/app/components/custom/ImagePopup";
import { useSession } from "next-auth/react";
import { selectUserFlags } from "@/app/redux/features/user/userSlice";
import { FlagOptions } from "@/app/enums/UserFlag";

interface EventDetailsPageProps {
  params: { id: string };
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EventDetailsPage: FunctionComponent<EventDetailsPageProps> = ({
  params,
}): ReactElement => {
  const router = useRouter();
  const appTheme = useSelector((state: RootState) => state.theme.appTheme);
  const { data: session } = useSession();
  const user = session?.user;

  const userFlags = useSelector(selectUserFlags);
  const isEmailVerified = user && userFlags?.[FlagOptions.isEmailVerified];

  const id = params.id;

  const fetchEventInfo = useFetchEventById();
  const toasthandler = useContext(ToastContext);
  const { handleFetchTransactionFee } = useApplicationContext();

  const [eventInfo, setEventInfo] = useState<EventResponse>();
  const [eventTickets, setEventTickets] = useState<RetrievedTicketResponse[]>();
  const [contactDetails, setContactDetails] =
    useState<CustomerContactDetails>();

  const [loader, setLoader] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [
    ticketsSelectionContainerIsVisible,
    setTicketsSelectionContainerIsVisible,
  ] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ticketDeliveryModalIsVisible, setTicketDeliveryModalIsVisible] =
    useState(false);
  const [contactDetailsModalIsVisible, setContactDetailsModalIsVisible] =
    useState(false);

  const eventLocation =
    eventInfo?.location?.address +
    " " +
    eventInfo?.location?.city +
    ", " +
    eventInfo?.location?.state +
    ", " +
    eventInfo?.location?.country;

  const isPurchaseStartDateInFuture = eventInfo
    ? new Date(eventInfo?.purchaseStartDate) > new Date()
    : false;
  const [timeLeftTillPurchaseStarts, setTimeLeftTillPurchaseStarts] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isPurchaseStartDateInFuture) {
      // const interval = setInterval(() => {
      //     const daysLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'days');
      //     const hoursLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'hours');
      //     const minutesLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'minutes');
      //     const secondsLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'seconds');

      //     if (daysLeft > 0) {
      //         setTimeLeftTillPurchaseStarts(`${daysLeft} days, ${hoursLeft} hrs, ${minutesLeft} mins, ${(secondsLeft / 1000) % 60} secs`);
      //         return;
      //     }
      //     if (hoursLeft > 0) {
      //         setTimeLeftTillPurchaseStarts(`${hoursLeft} hrs, ${minutesLeft % 60} mins, ${(secondsLeft / 1000) % 60} secs`);
      //         return;
      //     }
      //     // if (minutesLeft > 0) {
      //     //     setTimeLeftTillPurchaseStarts(`${minutesLeft} mins, ${secondsLeft} secs`);
      //     //     return;
      //     // }
      //     // setTimeLeftTillPurchaseStarts(`${secondsLeft} secs`);
      // }, 1000);

      // return () => clearInterval(interval);
      setTimeLeftTillPurchaseStarts(
        moment(eventInfo?.purchaseStartDate).fromNow()
      );
    }
  }, [timeLeftTillPurchaseStarts, eventInfo]);

  // useEffect hook to set total price
  useEffect(() => {
    // Filter through event ticket types availableParallelism, then check for only the selected tickets
    const selectedTickets = eventTickets?.filter((ticket) => ticket.isSelected);
    // iterates through each ticket in the selected tickets array and adds up the multiplication of the ticket price and the selected tickets count for each ticket.
    setTotalPrice(
      selectedTickets?.reduce(
        (total, ticket) => total + ticket.price * ticket.selectedTickets,
        0
      ) as number
    );
  }, [eventTickets]);

  async function handleFetchEventInfo() {
    // Set running flag
    setLoader(true);

    await fetchEventInfo(id)
      .then((response) => {
        // Log the result
        console.log("Event: ", response.data);

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
        // if(error.response.data.error === "Event not found") {
        //     // Route to event not-found page
        //     router.push(`/event/not-found`);
        // }

        // Display the error
        toasthandler?.logError(
          "Error fetching results",
          "We encountered an error while fetchng event offers. Please try again."
        );

        catchError(error);
        console.log("Error fetching info: ", error);

        // Unset running flag
        setLoader(false);
      });
  }

  // async function handleFetchSimilarEvents() {
  //     try {
  //         await fetchEventsByTags(eventInfo?.tags ?? [], eventInfo?.eventId as string)
  //             .then((response) => {
  //                 // Log the result
  //                 console.log('Result:', response.data);

  //                 // Set the event results
  //                 setEvents(response.data);
  //             })
  //             .catch((error) => {

  //                 // Display the error
  //                 toasthandler?.logError(
  //                     'Error fetching results',
  //                     'We encountered an error while fetchng event offers. Please try again.'
  //                 );

  //                 catchError(error);
  //             })
  //             .finally(() => {
  //                 setIsFetchingSimilarEvents(false);
  //             });
  //     } catch (error) {
  //         console.error('Error fetching data:', error);
  //     }
  // };

  useEffect(() => {
    // Clear previous info
    setEventInfo(undefined);
    setEventTickets(undefined);
    setTicketsSelectionContainerIsVisible(false);

    if (id) {
      handleFetchTransactionFee(id);
      handleFetchEventInfo();
    }
  }, [id]);

  // useEffect(() => {
  //     if(eventInfo) {
  //         handleFetchSimilarEvents();
  //     }
  // }, [eventInfo]);

  useEffect(() => {
    if (eventInfo && eventInfo.tickets !== null) {
      const updatedTicketTypes = eventInfo.tickets.map((ticket) => ({
        ...ticket,
        isSelected: false,
        selectedTickets: 0,
      }));
      setEventTickets(updatedTicketTypes);
      // console.log(eventTickets);
    }
  }, [eventInfo]);

  return (
    <>
      <ContactDetailsModal
        visibility={contactDetailsModalIsVisible}
        setVisibility={setContactDetailsModalIsVisible}
        setTicketDeliveryModalIsVisible={setTicketDeliveryModalIsVisible}
        setContactDetails={setContactDetails}
        contactDetails={contactDetails}
      />
      <TicketDelivery
        appTheme={appTheme}
        visibility={ticketDeliveryModalIsVisible}
        setVisibility={setTicketDeliveryModalIsVisible}
        eventTickets={eventTickets}
        eventInfo={eventInfo}
        totalPrice={totalPrice}
        contactDetails={contactDetails}
        isEmailVerified={isEmailVerified}
      />
      {eventInfo && (
        <ImagePopup
          imageUrl={eventInfo.mainImageUrl}
          alt={eventInfo.title}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      <div className='text-white bg-dark-grey'>
        {eventInfo?.purchaseEndDate &&
        new Date(eventInfo?.purchaseEndDate) < new Date() ? (
          <section className='relative flex flex-col gap-3 pb-12 w-full'>
            <div className='absolute size-full after:bg-white after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:opacity-50 after:bg-[linear-gradient(180deg,#8133f1_0%,#6315d3_100%)]'>
              <video
                className='size-full object-cover object-bottom'
                autoPlay
                loop
                muted
                playsInline
                onLoadStart={(e) => (e.currentTarget.playbackRate = 0.05)}
                onLoadedData={(e) => (e.currentTarget.playbackRate = 0.05)}
                onPlay={(e) => (e.currentTarget.playbackRate = 0.05)}
                src='https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4'
              />
            </div>
            <div
              className={
                "px-5 md:px-[5rem] lg:px-[16%] xl:px-[10rem] py-6 w-full lg:w-[70%] z-[2] relative flex flex-col gap-3"
              }
            >
              <span className='rounded-[0.5rem] py-1 px-2 flex items-center bg-white/10 gap-1 w-fit text-sm'>
                Ouch! Seems like you missed this event.
                <span className='size-4 bg-transparent p-0'>
                  <Image src={images.sad_face} alt='Sad face' />
                </span>
              </span>
              <h2 className='font-medium text-[30px] sm:text-[35px] leading-[1]'>
                Event Information
              </h2>
            </div>
          </section>
        ) : (
          <section className='relative flex flex-col gap-3 pb-12 w-full'>
            <div className='absolute size-full after:bg-white after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:opacity-50 after:bg-[linear-gradient(180deg,#8133f1_0%,#6315d3_100%)]'>
              <video
                className='size-full object-cover object-bottom'
                autoPlay
                loop
                muted
                playsInline
                src='https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4'
              />
            </div>
            <div
              className={
                "px-5 md:px-[5rem] lg:px-[16%] xl:px-[10rem] py-6 w-full lg:w-[70%] z-[2] relative flex flex-col gap-3"
              }
            >
              <span className='rounded-[0.5rem] py-1 px-2 flex items-center bg-white/10 gap-1 w-fit text-sm'>
                Time to grab those tickets!
                <span className='size-4 bg-transparent p-0'>
                  <Image src={images.woman_dancing} alt='Woman dancing' />
                </span>
              </span>
              <h2>Event Information</h2>
            </div>
          </section>
        )}

        {eventInfo ? (
          <section className='px-5 md:px-[5rem] lg:px-[16%] xl:px-[10rem] z-[2] relative flex flex-col translate-y-[-4rem] sm:translate-y-[-2.25rem] pb-10'>
            <EventMainInfo
              eventInfo={eventInfo}
              setTicketsSelectionContainerIsVisible={
                setTicketsSelectionContainerIsVisible
              }
              addEventToGoogleCalender={addEventToGoogleCalender}
              setIsPopupOpen={setIsPopupOpen}
            />
            <div
              className='rounded-[1rem] bg-[linear-gradient(180deg,_rgba(49,49,49,0)_4.17%,_#313131_100%)] w-full pt-8 px-6 pb-[2.5px] sm:pt-10  sm:w-[80%]'
              id='optionalSection'
            >
              {ticketsSelectionContainerIsVisible &&
                eventTickets &&
                eventTickets.length > 0 && (
                  <TicketsSelectionContainer
                    appTheme={appTheme}
                    eventTickets={eventTickets}
                    setEventTickets={setEventTickets}
                    totalPrice={totalPrice}
                    setContactDetailsModalIsVisible={
                      setContactDetailsModalIsVisible
                    }
                    setTicketDeliveryModalIsVisible={
                      setTicketDeliveryModalIsVisible
                    }
                    setTicketsSelectionContainerIsVisible={
                      setTicketsSelectionContainerIsVisible
                    }
                    timeLeftTillPurchaseStarts={timeLeftTillPurchaseStarts}
                  />
                )}
              {ticketsSelectionContainerIsVisible &&
                (!eventTickets || eventTickets?.length == 0) && (
                  <TicketsFetchErrorContainer />
                )}
            </div>
            {!ticketsSelectionContainerIsVisible && (
              <>
                <div className='mt-8 px-5'>
                  <h3 className='text-2xl font-medium text-gray-400 mb-2'>
                    More details about event
                  </h3>
                  <p
                    className={`'text-sm text-gray-200' [&_img]:w-[200px] [&_img]:rounded-[1em] [&_img]:mb-6`}
                    dangerouslySetInnerHTML={{
                      __html: eventInfo.description,
                    }}
                  />
                </div>
                {/* <div className="mt-8 px-5">
                                    <h3 className='text-2xl font-medium text-gray-400 mb-2'>Event Highlights</h3>
                                </div> */}
              </>
            )}
          </section>
        ) : (
          <SkeletonEventInfo />
        )}

        {/* <EventsGroup
                    title='Similar Events'
                    subText='Dear superstar, below is a list of all events available at the moment.'
                    eventsData={events}
                    isFetchingEvents={isFetchingSimilarEvents}
                /> */}
      </div>
    </>
  );
};

export default EventDetailsPage;
