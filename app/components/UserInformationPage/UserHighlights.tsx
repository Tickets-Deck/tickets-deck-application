"use client";
import { ReactElement, FunctionComponent, useState, useEffect } from "react";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useFetchEventsByPublisherId } from "@/app/api/apiClient";
import { EventResponse } from "@/app/models/IEvents";
import { catchError } from "@/app/constants/catchError";
import EventCard from "../Event/EventCard";
import ComponentLoader from "../Loader/ComponentLoader";

interface UserHighlightsProps {
  userInformation: UserCredentialsResponse;
}

const UserHighlights: FunctionComponent<UserHighlightsProps> = ({
  userInformation,
}): ReactElement => {
  const fetchUserEventsByPublisherId = useFetchEventsByPublisherId();

  const [userEvents, setUserEvents] = useState<EventResponse[]>([]);
  const [isFetchingUserEvents, setIsFetchingUserEvents] = useState(true);

  async function handleFetchUserEventsByPublisherId() {
    await fetchUserEventsByPublisherId(userInformation.id)
      .then((response) => {
        // console.log(response.data);
        // Update the state
        setUserEvents(response.data);
      })
      .catch((error) => {
        // Log the error
        // console.log(error);
        catchError(error);
      })
      .finally(() => {
        // Close the loader indicator
        setIsFetchingUserEvents(false);
      });
  }

  useEffect(() => {
    if (userInformation) {
      handleFetchUserEventsByPublisherId();
    }
  }, [userInformation]);

  return (
    <div className='mt-[3.5rem] min-h-[30vh]'>
      <h3 className='text-2xl font-medium text-center'>Recent Events</h3>
      <div className='grid [grid-template-columns:repeat(auto-fill,minmax(15rem,_1fr))] gap-4 mt-6 p-[1.25rem] md:px-[5rem] lg:px-[16%] xl:px-[10rem]'>
        {userEvents &&
          userEvents.length > 0 &&
          userEvents.map((event, index) => (
            <EventCard
              event={event}
              // mobileAndActionButtonDismiss
              key={index}
              // gridDisplay={true}
            />
          ))}
        {isFetchingUserEvents && (
          <div className='w-full h-[15vh] bg-transparent relative [grid-column:1/4] grid place-items-center'>
            <ComponentLoader customLoaderColor='#111111' />
          </div>
        )}
      </div>
      {!isFetchingUserEvents && userEvents.length === 0 && (
        <div className='flex flex-col items-center gap-1 mt-6'>
          <p className='text-sm text-grey'>No events yet</p>
        </div>
      )}
    </div>
  );
};

export default UserHighlights;
