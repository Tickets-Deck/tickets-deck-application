"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import HeroSection from "./components/Homepage/HeroSection";
import FeaturedEvents from "./components/Homepage/FeaturedEvents";
import Services from "./components/Homepage/Services";
import CreateEvent from "./components/Homepage/CreateEvent";
import { useFetchEvents, useFetchFeaturedEvents } from "./api/apiClient";
import { EventResponse } from "./models/IEvents";
import BetaTestModal from "./components/Modal/BetaTestModal";
import { ImageWithPlaceholder } from "./models/IImage";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import TestimonialSection from "./components/Homepage/TestimonialSection";
import UpcomingEvents from "./components/Homepage/UpcomingEvents";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import EmailVerificationPrompt from "./components/Modal/EmailVerificationPrompt";

interface HomepageProps {
    imageWithPlaceholder: ImageWithPlaceholder[];
}

const Homepage: FunctionComponent<HomepageProps> = ({
    imageWithPlaceholder,
}): ReactElement => {
    const fetchFeaturedEvents = useFetchFeaturedEvents();
    const fetchEvents = useFetchEvents();
    const searchParams = useSearchParams();
    const authToken = searchParams.get('g-oauth-token');

    const [featuredEvents, setFeaturedEvents] = useState<EventResponse[]>([]);
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [isFetchingFeaturedEvents, setIsFetchingFeaturedEvents] =
        useState(true);
    const [isFetchingEvents, setIsFetchingEvents] = useState(true);
    const [showBetaTestModal, setShowBetaTestModal] = useState(false);
    const [emailVerificationPromptIsVisible, setEmailVerificationPromptIsVisible] = useState(false);

    const userInfo = useSelector(
        (state: RootState) => state.userCredentials.userInfo
    );

    // function retrieveEventsFromDb() {
    //     const _retrievedEvents = sessionStorage.getItem(StorageKeys.Events);

    //     if (!_retrievedEvents || _retrievedEvents === 'undefined') {
    //         return;
    //     }

    //     const retrievedEvents = JSON.parse(_retrievedEvents);

    //     return retrievedEvents;
    // }

    async function handleFetchFeaturedEvents() {
        // Fetch events
        await fetchFeaturedEvents()
            .then((response) => {
                if (response) {
                    // console.log(response.data);
                    setFeaturedEvents(response.data);

                    // Save events to session storage
                    // sessionStorage.setItem(StorageKeys.Events, JSON.stringify(response.data));
                }
            })
            .catch((err) => {
                console.log(err);
                // toasthandler?.logError('Error', 'An error occurred while fetching events.');
            })
            .finally(() => {
                // Stop loader
                setIsFetchingFeaturedEvents(false);
            });
    }

    async function handleFetchEvents() {
        // Fetch events
        await fetchEvents()
            .then((response) => {
                if (response) {
                    // console.log(response.data);
                    setEvents(response.data);

                    // Save events to session storage
                    // sessionStorage.setItem(StorageKeys.Events, JSON.stringify(response.data));
                }
            })
            .catch((err) => {
                console.log(err);
                // toasthandler?.logError('Error', 'An error occurred while fetching events.');
            })
            .finally(() => {
                // Stop loader
                setIsFetchingEvents(false);
            });
    }

    function showEmailVerificationAlert() {
        // Check for the email verification status if the user is logged in.
        if (userInfo && !userInfo.emailVerified) {
            // toast.error("Please verify your email address to continue.");
            setEmailVerificationPromptIsVisible(true);
            return;
        }
    }

    useEffect(() => {
        handleFetchFeaturedEvents();
        handleFetchEvents();
    }, []);

    useEffect(() => {
        if (authToken) {
            const login = async () => {
                await signIn('google-oauth', {
                    token: authToken,
                    callbackUrl: '/',
                    // redirect: false
                })
                    .then((response) => {
                        console.log("🚀 ~ .then ~ response:", response)
                        // refresh the page  
                        // window.location.reload();
                    })
            }

            login();
        }
    }, [authToken]);

    // Show beta test modal after 5 seconds, and only once
    // useEffect(() => {
    //     // Check if beta test modal has been viewed
    //     const viewed = localStorage.getItem(StorageKeys.BetaTestModalViewed);

    //     // If it has been viewed, stop execution
    //     if (viewed) {
    //         return;
    //     }

    //     // Show beta test modal after 5 seconds
    //     const timer = setTimeout(() => {
    //         setShowBetaTestModal(true);

    //         // Save to local storage
    //         localStorage.setItem(StorageKeys.BetaTestModalViewed, 'true');
    //     }, 5000);

    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <>
            <BetaTestModal
                forGeneralMessage
                visibility={showBetaTestModal}
                setVisibility={setShowBetaTestModal}
            />

            {emailVerificationPromptIsVisible && (
                <EmailVerificationPrompt
                    visibility={emailVerificationPromptIsVisible}
                    setVisibility={setEmailVerificationPromptIsVisible}
                    userEmail={userInfo?.email as string}
                    userName={userInfo?.firstName as string}
                />
            )}

            <div className='bg-dark-grey text-white'>
                <HeroSection
                    isFetchingEvents={isFetchingEvents}
                    events={events}
                    imageWithPlaceholder={imageWithPlaceholder}
                    userInfo={userInfo}
                    showEmailVerificationAlert={showEmailVerificationAlert}
                />
                <FeaturedEvents
                    isFetchingEvents={isFetchingFeaturedEvents}
                    featuredEvents={featuredEvents}
                />
                <Services />
                <TestimonialSection />
                <CreateEvent />
                <UpcomingEvents
                    events={events}
                    emailVerificationPromptIsVisible={emailVerificationPromptIsVisible}
                    setEmailVerificationPromptIsVisible={setEmailVerificationPromptIsVisible}
                    userInfo={userInfo}
                    showEmailVerificationAlert={showEmailVerificationAlert}
                />
                {/* <MobileAppSection /> */}
            </div>
        </>
    );
};

export default Homepage;
