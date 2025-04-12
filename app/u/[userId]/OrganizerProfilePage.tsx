"use client";
import { ReactElement, FunctionComponent, useState, useEffect } from "react";
import { UserCredentialsResponse } from "@/app/models/IUser";
import {
  useFetchEventsByPublisherId,
  useFetchUserFollowMetrics,
  useFetchUserInformationByUserName,
  useFollowUser,
  useUnfollowUser,
} from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { Session } from "next-auth";
import { FollowsActionType, IUserFollowMetrics } from "@/app/models/IFollows";
import { useToast } from "@/app/context/ToastCardContext";
import Image from "next/image";
import Badge from "@/app/components/ui/badge";
import { Icons } from "@/app/components/ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewsTab } from "@/app/components/OrganizerProfilePage/ReviewsTab";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import UserStats from "@/app/components/OrganizerProfilePage/UserStats";
import UserPersonalInfo from "@/app/components/OrganizerProfilePage/UserPersonalInfo";
import UserCoverContainer from "@/app/components/ProfilePage/UserCoverContainer";
import UserHighlights from "@/app/components/OrganizerProfilePage/UserHighlights";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { set } from "date-fns";
import EventCard from "@/app/components/Event/EventCard";
import { EventResponse } from "@/app/models/IEvents";
import moment from "moment";

export type OrganizerEvents = {
  date: string;
  title: string;
  id: string;
};
interface UserInformationPageProps {
  identifier: string;
  session: Session | null;
  initialUserInformation: UserCredentialsResponse | null;
}

enum Tab {
  Events = "Events",
  About = "About",
  Reviews = "Reviews",
}

const UserInformationPage: FunctionComponent<UserInformationPageProps> = ({
  identifier,
  session,
  initialUserInformation,
}): ReactElement => {
  const toastHandler = useToast();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const fetchUserFollowMetrics = useFetchUserFollowMetrics();
  const fetchUserInformationByUsername = useFetchUserInformationByUserName();
  const fetchPublisherEvents = useFetchEventsByPublisherId();

  const [isFetchingUserInformation, setIsFetchingUserInformation] =
    useState(true);
  const [isInteractingWithUserProfile, setIsInteractingWithUserProfile] =
    useState(false);
  const [userInformation, setUserInformation] =
    useState<UserCredentialsResponse | null>(initialUserInformation);

  const [organizerEvents, setOrganizerEvents] = useState<EventResponse[]>([]);

  const [isFollowingUser, setIsFollowingUser] = useState<boolean | null>(null);

  const upcomingEvents = organizerEvents.filter((event) =>
    moment(event.endDate).isAfter(new Date())
  );
  const pastEvents = organizerEvents.filter((event) =>
    moment(event.endDate).isBefore(new Date())
  );

  async function handleFetchUserInformation(hideLoader?: boolean) {
    // Show loading indicator
    !hideLoader && setIsFetchingUserInformation(true);

    await fetchUserInformationByUsername(identifier as string)
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        setUserInformation(response.data);
      })
      .catch((error) => {
        // console.log(error);
        catchError(error);
      })
      .finally(() => {
        setIsFetchingUserInformation(false);
      });
  }

  async function handleFetchUserFollowMetrics() {
    await fetchUserFollowMetrics(
      userInformation?.id as string,
      session?.user.id as string
    )
      .then((response) => {
        console.log("Fetched metrics: ", response.data);

        const result = response.data as IUserFollowMetrics;

        // setus

        if (result.isFollowing == true) {
          setIsFollowingUser(true);
        }
        if (result.isFollowing == false) {
          setIsFollowingUser(false);
        }
      })
      .catch((error) => {
        // console.log("Failed to fetch user follow metrics: ", error);
        catchError(error);
      });
  }

  async function handleInteractWithUser(followActionType: FollowsActionType) {
    // Spin up loader
    setIsInteractingWithUserProfile(true);

    if (followActionType == FollowsActionType.Follow) {
      await followUser(
        session?.user.id as string,
        userInformation?.id as string
      )
        .then(async () => {
          handleFetchUserFollowMetrics();

          // Refetch user information
          await handleFetchUserInformation(true);
        })
        .catch((error) => {
          catchError(error);
          toastHandler.logError("Error", "Failed to follow user");
        })
        .finally(() => {
          setIsInteractingWithUserProfile(false);
        });
    }

    if (followActionType == FollowsActionType.Unfollow) {
      await unfollowUser(
        session?.user.id as string,
        userInformation?.id as string
      )
        .then(async () => {
          handleFetchUserFollowMetrics();

          // Refetch user information
          await handleFetchUserInformation(true);
        })
        .catch((error) => {
          catchError(error);
          toastHandler.logError("Error", "Failed to follow user");
        })
        .finally(() => {
          setIsInteractingWithUserProfile(false);
        });
    }
  }

  async function handleFetchPublisherEvents() {
    await fetchPublisherEvents(userInformation?.id as string)
      .then((response) => {
        console.log("Fetched events: ", response.data);
        setOrganizerEvents(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          throw new Error(error.response.data.message);
        }
      });
  }

  useEffect(() => {
    if (userInformation) {
      handleFetchUserFollowMetrics();
    }
  }, [userInformation]);

  useEffect(() => {
    if (userInformation) handleFetchPublisherEvents();
  }, [userInformation]);

  return (
    <div className="bg-dark-grey text-white">
      {userInformation && (
        <>
          <UserCoverContainer
            userInformation={userInformation}
            handleFetchUserInformation={handleFetchUserInformation}
            forUser
          />
          <div className="sectionPadding relative">
            <UserPersonalInfo
              userInformation={userInformation}
              handleInteractWithUser={handleInteractWithUser}
              isFollowingUser={isFollowingUser}
              isInteractingWithUserProfile={isInteractingWithUserProfile}
            />

            {userInformation.stats && (
              <UserStats stats={userInformation.stats} />
            )}

            {/* Tabs */}
            <Tabs defaultValue={Tab.Events} className="mt-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value={Tab.Events}>Events</TabsTrigger>
                <TabsTrigger value={Tab.About}>About</TabsTrigger>
                <TabsTrigger value={Tab.Reviews}>Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value={Tab.Events} className="!mt-6 !space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                    {/* <button className='tertiaryButton'>View All</button> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => <EventCard event={event} />)
                    ) : (
                      <p>
                        {userInformation.firstName} does not have any upcoming
                        events yet.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold">Past Events</h2>
                    {/* <button className='tertiaryButton'>View All</button> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event) => <EventCard event={event} />)
                    ) : (
                      <p>No Events Yet</p>
                    )}
                  </div>
                </div>

                <div className="text-center py-8">
                  <p className="text-white mb-4">Looking for more events?</p>
                  <Link
                    href={ApplicationRoutes.GeneralEvents}
                    className="primaryButton mx-auto"
                  >
                    Browse All Events
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value={Tab.About} className="!mt-6 !space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    About the Organizer
                  </h3>
                  <p
                    className={
                      userInformation.bio ? "text-white" : "text-white/70"
                    }
                  >
                    {userInformation.bio ||
                      "No information provided by organizer."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <Link
                      className="flex items-center gap-[0.35rem] text-white hover:opacity-100 hover:text-primary-color-sub no-underline w-fit"
                      href={`mailto:${userInformation.email}`}
                    >
                      <Icons.Mail />
                      <span>{userInformation.email}</span>
                    </Link>
                    {userInformation.phone && (
                      <Link
                        className="flex items-center gap-[0.35rem] text-white hover:opacity-100 hover:text-primary-color-sub no-underline w-fit"
                        href={`tel:${userInformation.phone}`}
                      >
                        <Icons.Phone />
                        <span>{userInformation.phone}</span>
                      </Link>
                    )}
                    {/* <div className="flex items-center">
                                                    <Icons.User className="h-4 w-4 mr-2 text-white" />
                                                    <span>{userInformation.}</span>
                                                </div> */}
                  </div>
                </div>

                {userInformation.socialLinks && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Social Media</h3>
                    <div className="flex gap-4">
                      {userInformation.socialLinks?.twitterUrl && (
                        <Link
                          href={userInformation.socialLinks.twitterUrl}
                          className="border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary"
                        >
                          <Icons.Twitter className="size-6" />
                        </Link>
                      )}
                      {userInformation.socialLinks?.instagramUrl && (
                        <Link
                          href={userInformation.socialLinks.instagramUrl}
                          className="border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary"
                        >
                          <Icons.Instagram className="size-6" />
                        </Link>
                      )}
                      {userInformation.socialLinks?.facebookUrl && (
                        <Link
                          href={userInformation.socialLinks.facebookUrl}
                          className="border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary"
                        >
                          <Icons.Facebook className="size-6" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value={Tab.Reviews} className="!mt-6 !space-y-8">
                <ReviewsTab
                  organizerId={userInformation.id || ""}
                  organizerEvents={organizerEvents.reduce<OrganizerEvents[]>(
                    (acc, event) => {
                      acc.push({
                        id: event.id,
                        date: event.startDate,
                        title: event.title,
                      });
                      return acc;
                    },
                    []
                  )}
                  organizerName={
                    userInformation.firstName + " " + userInformation.lastName
                  }
                  session={session}
                />
              </TabsContent>
            </Tabs>

            {/* <UserHighlights userInformation={userInformation} /> */}
          </div>
        </>
      )}

      {!userInformation && isFetchingUserInformation && (
        <div className="h-[60vh] grid place-items-center">
          <ComponentLoader customLoaderColor="#fff" />
        </div>
      )}

      {!userInformation && !isFetchingUserInformation && (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <h3 className="text-2xl font-medium mb-4">User not found</h3>
          <p className="text-sm text-grey">
            Sorry, we couldn't find the user you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInformationPage;
