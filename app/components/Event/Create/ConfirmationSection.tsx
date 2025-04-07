import {
  ReactElement,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { EventRequest } from "../../../models/IEvents";
import Image from "next/image";
import moment from "moment";
import { NairaPrice } from "@/app/constants/priceFormatter";
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import { useApplicationContext } from "@/app/context/ApplicationContext";

interface ConfirmationSectionProps {
  eventRequest: EventRequest | undefined;
  setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>;
  isEventCreated: boolean;
  mainImageUrl: string | undefined;
  setEventCreationStage: React.Dispatch<
    React.SetStateAction<EventCreationStage>
  >;
}

const ConfirmationSection: FunctionComponent<ConfirmationSectionProps> = ({
  eventRequest,
  setEventRequest,
  isEventCreated,
  mainImageUrl,
  setEventCreationStage,
}): ReactElement => {
  const { eventCategories } = useApplicationContext();

  /**
   * Function to generate a random string
   * @param length is the length of the string to generate
   * @returns the generated string
   */
  function generateRandomString(length: number) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  }

  function generateEventCode() {
    const timestamp = new Date().getTime().toString(36);
    const randomString = generateRandomString(6); // Adjust the length as needed
    // const eventCode = timestamp + randomString;
    const eventCode = randomString;
    return eventCode.toUpperCase();
  }

  const [uniqueEventCode, setUniqueEventCode] = useState<string>();

  useEffect(() => {
    if (uniqueEventCode) {
      setEventRequest({
        ...(eventRequest as EventRequest),
        eventId: uniqueEventCode,
      });
    }
  }, [uniqueEventCode]);

  useEffect(() => {
    if (eventRequest?.eventId || isEventCreated) {
      return;
    }
    setUniqueEventCode(generateEventCode());
  }, [eventRequest?.eventId, isEventCreated]);

  return (
    <div>
      <div className='mb-8 [&_h3]:text-xl [&_h3]:font-normal [&_h3]:text-white'>
        {isEventCreated ? (
          <h3>Event created. Redirecting you in seconds...</h3>
        ) : (
          <h3>Please review your event's information below.</h3>
        )}
        {!isEventCreated && (
          <span className='text-sm text-white/50'>
            Event ID: {eventRequest?.eventId}
          </span>
        )}
      </div>

      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-col w-full mr-8'>
          <div className='flex gap-4 items-start flex-col mb-6 md:flex-col'>
            <div className='w-full h-[250px] rounded-lg bg-white/10 overflow-hidden relative grid place-items-center [&_img]:object-cover'>
              <Image src={mainImageUrl as string} alt='Event flyer' fill />
            </div>
            <button
              className='tertiaryButton !px-4 !py-2'
              type='button'
              onClick={() =>
                setEventCreationStage(EventCreationStage.ImageUpload)
              }
            >
              Change image
            </button>
          </div>

          <div className='flex flex-col mb-6 [&_p]:text-white'>
            <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
              <span>Title</span>
              <p className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2'>
                {eventRequest?.title}
              </p>
            </div>
            <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
              <span>Location</span>
              <p className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2 capitalize'>
                {eventRequest?.venue}
              </p>
            </div>
            <div className='flex flex-row gap-3 mb-2'>
              <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
                <span>Starting on:</span>
                <p className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2'>
                  {moment(eventRequest?.startDate).format("Do of MMM, YYYY")}
                </p>
              </div>
              <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
                <span>Time</span>
                <p className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2'>
                  {moment(eventRequest?.startDate).format("hh:mm a")}
                </p>
              </div>
            </div>
            <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
              <span>Description</span>
              <p
                className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2'
                dangerouslySetInnerHTML={{
                  __html: eventRequest?.description as string,
                }}
              />
            </div>
            <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
              <span>Category</span>
              <p className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2'>
                {
                  eventCategories?.find(
                    (category) => category.id === eventRequest?.categoryId
                  )?.name
                }
              </p>
            </div>
            <div className='flex flex-col mb-2 [&_span]:mb-1 [&_span]:text-sm [&_span]:text-text-grey'>
              <span>Visibility</span>
              <p className='text-base [&_img]:w-[200px] [&_img]:rounded-lg [&_img]:mb-2'>
                {eventRequest?.visibility}
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div>
            <div className='flex flex-row justify-between items-center mb-4'>
              <h4 className='text-lg font-normal text-white'>Tickets</h4>
              <button
                type='button'
                className='tertiaryButton !px-4 !py-2'
                onClick={() =>
                  setEventCreationStage(EventCreationStage.TicketDetails)
                }
              >
                {eventRequest?.tickets.length &&
                eventRequest?.tickets.length > 1
                  ? "Update tickets"
                  : "Update ticket"}
              </button>
            </div>
            <div className='grid grid-cols-[repeat(2,minmax(100px,1fr))] gap-4 md:gap-8'>
              {eventRequest?.tickets.map((ticket, index) => (
                <div
                  className='p-4 rounded-lg bg-container-grey flex flex-col gap-5 w-full relative overflow-hidden after:content after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-black/35 after:z-10 after:border-radius-[100%] after:scale-0.5 after:opacity-0 after:transition-all-300ms-ease'
                  key={index}
                >
                  <div className='flex flex-col gap-1'>
                    <h5 className='font-medium text-white'>{ticket.name}</h5>
                    <span className='text-sm bg-white text-black px-2 py-1 rounded w-fit'>
                      {<>{`${NairaPrice.format(ticket.price)}`}</>}
                    </span>
                  </div>
                  <div className='flex gap-4 flex-col [&_p]:text-white [&_span]:text-white'>
                    <div className='[&_p]:text-sm [&_span]:text-xs'>
                      <p>Available tickets: </p>
                      <span>{ticket.quantity}</span>
                    </div>
                    <div className='[&_p]:text-sm [&_span]:text-xs'>
                      <p>Tickets can admit: </p>
                      <span>
                        {ticket.numberOfUsers}{" "}
                        {ticket.numberOfUsers > 1 ? "persons" : "person"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.confirmationSection__uploadStatus}></div> */}
    </div>
  );
};

export default ConfirmationSection;
