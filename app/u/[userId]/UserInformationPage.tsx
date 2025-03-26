"use client";
import { ReactElement, FunctionComponent, useState, useEffect } from "react";
import { UserCredentialsResponse } from "@/app/models/IUser";
import {
    useFetchUserFollowMetrics,
    useFetchUserInformationByUserName,
    useFollowUser,
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

interface UserInformationPageProps {
    identifier: string;
    session: Session | null;
    userInformation: UserCredentialsResponse | null
}

enum Tab {
    Events = 1,
    About,
    Reviews
}

const UserInformationPage: FunctionComponent<UserInformationPageProps> = ({
    identifier,
    session,
    userInformation
}): ReactElement => {
    const toastHandler = useToast();
    const followUser = useFollowUser();
    const fetchUserFollowMetrics = useFetchUserFollowMetrics();
    const fetchUserInformationByUsername = useFetchUserInformationByUserName();

    // const [userInformation, setUserInformation] =
    //     useState<UserCredentialsResponse>();
    const [isFetchingUserInformation, setIsFetchingUserInformation] =
        useState(true);
    const [isInteractingWithUserProfile, setIsInteractingWithUserProfile] =
        useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState<boolean | null>(null);
    const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Events);

    const isForUser = session?.user.id === userInformation?.id;

    async function handleFetchUserInformation(hideLoader?: boolean) {
        // Show loading indicator
        !hideLoader && setIsFetchingUserInformation(true);

        await fetchUserInformationByUsername(identifier as string)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response);
                // console.log(response.data);
                // setUserInformation(response.data);
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
                // console.log("Fetched metrics: ", response.data);

                const result = response.data as IUserFollowMetrics;

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

        await followUser(
            session?.user.id as string,
            userInformation?.id as string,
            followActionType
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

    useEffect(() => {
        if (userInformation) {
            handleFetchUserFollowMetrics();
        }
    }, [userInformation]);

    return (
        <div className='bg-dark-grey text-white'>
            {userInformation && (
                <>
                    <div className="relative h-64 md:h-80 w-full overflow-hidden">
                        <Image
                            src={userInformation.coverPhoto || "https://placehold.co/1600x800/8133F1/FFFFFF/png?text=Cover+Photo"}
                            alt="Cover"
                            width={1600}
                            height={400}
                            className="w-full h-full object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>

                    <div className="sectionPadding relative">
                        <div className="flex flex-col md:flex-row gap-6 -mt-20 md:-mt-16">
                            <div className="z-10 flex flex-col items-center md:items-start">
                                <div className="h-32 w-32 border-4 border-background relative rounded-full overflow-hidden">
                                    <Image
                                        src={userInformation.profilePhoto || `https://placehold.co/300x300/8133F1/FFFFFF/png?text=${userInformation.firstName[0]}${userInformation.lastName[0]}`}
                                        alt={userInformation.firstName}
                                        fill
                                        sizes="auto"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between w-full mt-4 md:mt-16">
                                <div className="space-y-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center gap-2">
                                        <h1 className="text-2xl md:text-3xl font-semibold capitalize">{userInformation.firstName + ' ' + userInformation.lastName}</h1>
                                        <Badge
                                            title="Organizer"
                                            className="!mb-0"
                                        />
                                    </div>
                                    {userInformation.username && <p className="text-white">@{userInformation.username}</p>}
                                </div>
                                <div className="flex justify-center md:justify-end gap-2 mt-4 md:mt-0">
                                    <button className="primaryButtonOutline h-fit">
                                        <Icons.Notification className="h-4 w-4 mr-2" />
                                        Follow
                                    </button>
                                    <button className="primaryButtonOutline h-fit">
                                        <Icons.Share className="h-4 w-4 mr-2" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start gap-8 mt-6 md:mt-8 border-b border-border/40 pb-6">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-2xl font-bold">{userInformation.stats?.eventsCount}</span>
                                <span className="text-sm text-white">Events</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-2xl font-bold">{userInformation.stats?.followersCount}</span>
                                <span className="text-sm text-white">Followers</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-2xl font-bold">{userInformation.stats?.followingCount}</span>
                                <span className="text-sm text-white">Following</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-6">
                            <div className="inline-flex h-[42px] w-full items-center justify-center rounded-md bg-container-grey p-1 text-white">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedTab(Tab.Events)}
                                    className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-normal ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${selectedTab == Tab.Events ? "bg-black text-white shadow-sm" : "hover:bg-black/50 hover:text-white"}`}>
                                    Events
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedTab(Tab.About)}
                                    className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-normal ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${selectedTab == Tab.About ? "bg-black text-white shadow-sm" : "hover:bg-black/50 hover:text-white"}`}>
                                    About
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedTab(Tab.Reviews)}
                                    className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-normal ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${selectedTab == Tab.Reviews ? "bg-black text-white shadow-sm" : "hover:bg-black/50 hover:text-white"}`}>
                                    Reviews
                                </motion.button>
                            </div>
                            <AnimatePresence mode="wait">
                                {
                                    selectedTab === Tab.Events &&
                                    <motion.div
                                        className="ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 mt-6 space-y-8"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold">Upcoming Events</h2>
                                            <button className="tertiaryButton">
                                                View All
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* <EventCard />  */}
                                        </div>

                                        <div className="text-center py-8">
                                            <p className="text-white mb-4">Looking for more events?</p>
                                            <button className="primaryButton mx-auto">Browse All Events</button>
                                        </div>
                                    </motion.div>
                                }
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {
                                    selectedTab === Tab.About &&
                                    <motion.div
                                        className="ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 mt-6 space-y-8"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">About the Organizer</h3>
                                            <p className="text-white">
                                                {userInformation.bio || "No information provided by organizer."}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <Icons.Mail className="h-4 w-4 mr-2 text-white" />
                                                    <span>{userInformation.email}</span>
                                                </div>
                                                {
                                                    userInformation.phone &&
                                                    <div className="flex items-center">
                                                        <Icons.Phone className="h-4 w-4 mr-2 text-white" />
                                                        <span>{userInformation.phone}</span>
                                                    </div>
                                                }
                                                {/* <div className="flex items-center">
                                                    <Icons.User className="h-4 w-4 mr-2 text-white" />
                                                    <span>{userInformation.}</span>
                                                </div> */}
                                            </div>
                                        </div>

                                        {
                                            userInformation.socialLinks &&
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Social Media</h3>
                                                <div className="flex gap-4">
                                                    {
                                                        userInformation.socialLinks?.twitterUrl &&
                                                        <Link
                                                            href={userInformation.socialLinks.twitterUrl}
                                                            className="border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary"
                                                        >
                                                            <Icons.Twitter className="size-6" />
                                                        </Link>
                                                    }
                                                    {
                                                        userInformation.socialLinks?.instagramUrl &&
                                                        <Link
                                                            href={userInformation.socialLinks.instagramUrl}
                                                            className="border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary"
                                                        >
                                                            <Icons.Instagram className="size-6" />
                                                        </Link>
                                                    }
                                                    {
                                                        userInformation.socialLinks?.facebookUrl &&
                                                        <Link
                                                            href={userInformation.socialLinks.facebookUrl}
                                                            className="border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary"
                                                        >
                                                            <Icons.Facebook className="size-6" />
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </motion.div>
                                }
                            </AnimatePresence>


                            <AnimatePresence mode="wait">
                                {
                                    selectedTab === Tab.Reviews && (
                                        <motion.div
                                            className="ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 mt-6 space-y-8"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}>
                                            <ReviewsTab organizerName={userInformation.firstName + ' ' + userInformation.lastName} />
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* <UserCoverContainer
                        userInformation={userInformation}
                        handleFetchUserInformation={handleFetchUserInformation}
                        forUser
                    />
                    <div className='flex flex-col relative z-[3] translate-y-[-5rem]'>
                        <UserPersonalInfo userInformation={userInformation} />
                        <UserSocials userInformation={userInformation} />
                        <UserStats userInformation={userInformation} />
                        {isForUser && session ? (
                            <Link
                                href={ApplicationRoutes.Profile}
                                className='w-fit rounded-[3.125rem] cursor-pointer text-sm py-[0.8rem] px-[1.6rem] border-none bg-white text-dark-grey flex items-center gap-2 mx-auto'
                            >
                                Update Profile
                            </Link>
                        ) : (
                            <>
                                {session && isFollowingUser !== null && (
                                    <button
                                        className='w-fit rounded-[3.125rem] cursor-pointer text-sm py-[0.8rem] px-[1.6rem] border-none bg-white text-dark-grey flex items-center gap-2 mx-auto'
                                        disabled={isInteractingWithUserProfile}
                                        onClick={() =>
                                            handleInteractWithUser(
                                                isFollowingUser
                                                    ? FollowsActionType.Unfollow
                                                    : FollowsActionType.Follow
                                            )
                                        }
                                    >
                                        {isFollowingUser ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                            </>
                        )}
                        <UserHighlights userInformation={userInformation} />
                    </div> */}
                </>
            )}
            {!userInformation && isFetchingUserInformation && (
                <div className='h-[60vh] grid place-items-center'>
                    <ComponentLoader customLoaderColor='#fff' />
                </div>
            )}
            {!userInformation && !isFetchingUserInformation && (
                <div className='h-[60vh] flex flex-col items-center justify-center'>
                    <h3 className='text-2xl font-medium mb-4'>User not found</h3>
                    <p className='text-sm text-grey'>
                        Sorry, we couldn't find the user you're looking for.
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserInformationPage;