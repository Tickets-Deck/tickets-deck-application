"use client";
import { useFetchUserFavoriteEvents } from "@/app/api/apiClient";
import EventCard from "@/app/components/Event/EventCard";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { catchError } from "@/app/constants/catchError";
import { EventResponse } from "@/app/models/IEvents";
import { sectionPadding } from "@/app/styles/styles";
import { useSession } from "next-auth/react";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";

interface FavouriteEventsPageProps {}

const FavouriteEventsPage: FunctionComponent<
  FavouriteEventsPageProps
> = (): ReactElement => {
  const fetchUserFavoriteEvents = useFetchUserFavoriteEvents();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [isFetchingFavouriteEvents, setIsFetchingFavouriteEvents] =
    useState(true);
  const [favouriteEvents, setFavouriteEvents] = useState<
    EventResponse[] | undefined
  >(undefined);

  /**
   * Function to fetch the user's favourite events
   */
  const handleFetchUserFavoriteEvents = async () => {
    await fetchUserFavoriteEvents(user?.token as string, user?.id as string)
      .then((response) => {
        setFavouriteEvents(response.data);
      })
      .catch((error) => {
        catchError(error);
      })
      .finally(() => {
        setIsFetchingFavouriteEvents(false);
      });
  };

  useEffect(() => {
    if (status == "authenticated") {
      handleFetchUserFavoriteEvents();
    }
  }, [status]);

  return (
    <main
      className={`${sectionPadding} flex-col gap-8 py-16 bg-dark-grey text-white flex md:flow-row items-start relative min-h-[calc(100vh_-_56px)]`}
    >
      <div className='flex flex-col items-start justify-between w-full'>
        <h1 className='text-xl font-medium md:text-3xl'>Favourite Events</h1>
        <p className='text-text-grey text-sm'>
          You can view all your favourite events here.
        </p>
      </div>

      <div className='flex flex-col w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {!isFetchingFavouriteEvents &&
            favouriteEvents &&
            favouriteEvents?.length > 0 &&
            favouriteEvents.map((event, index) => (
              <EventCard event={event} key={index} />
            ))}
        </div>
        {isFetchingFavouriteEvents && (
          <div className='grid place-items-center min-w-full min-h-[50vh]'>
            <ComponentLoader customLoaderColor='#fff' />
          </div>
        )}
        {!isFetchingFavouriteEvents &&
          favouriteEvents &&
          favouriteEvents?.length == 0 && (
            <div className='grid place-items-center'>
              <br />
              <br />
              <p className='text-white/80'>
                You have not liked any events yet.
              </p>
            </div>
          )}
        {!isFetchingFavouriteEvents && !favouriteEvents && (
          <div className='grid place-items-center'>
            <br />
            <br />
            <p className='text-white/80 text-center'>
              An error occurred while fetching your favourite events.
              <br />
              Please try again later.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default FavouriteEventsPage;
