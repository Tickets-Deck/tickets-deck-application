"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import HeroSection from "./components/Homepage/HeroSection";
import FeaturedEvents from "./components/Homepage/FeaturedEvents";
import Services from "./components/Homepage/Services";
import CreateEvent from "./components/Homepage/CreateEvent";
import {
  useFetchEvents,
  useFetchFeaturedEvents,
  useFetchTrendingEventCategories,
} from "./api/apiClient";
import { EventResponse, FeaturedEvent } from "./models/IEvents";
import BetaTestModal from "./components/Modal/BetaTestModal";
import { ImageWithPlaceholder } from "./models/IImage";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import TestimonialSection from "./components/Homepage/TestimonialSection";
import UpcomingEvents from "./components/Homepage/UpcomingEvents";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import EmailVerificationPrompt from "./components/Modal/EmailVerificationPrompt";
import { catchError } from "./constants/catchError";
import { ITrendingEventCategory } from "./models/IEventCategory";
import { Session } from "next-auth";
import RecentlyConcludedEvents from "./components/Homepage/RecentlyConcludedEvents";
import MarketplaceAnnouncement from "./components/shared/MarketplaceAnnoucement";
import {
  handleMarketplaceAnnouncementViewed,
  shouldShowMarketplaceAnnouncement,
} from "@/utils/announcementHelper";

interface HomepageProps {
  imageWithPlaceholder: ImageWithPlaceholder[];
  session: Session | null;
}

const Homepage: FunctionComponent<HomepageProps> = ({
  imageWithPlaceholder,
  session,
}): ReactElement => {
  const fetchFeaturedEvents = useFetchFeaturedEvents();
  const fetchEvents = useFetchEvents();
  const fetchTrendingEventCategories = useFetchTrendingEventCategories();
  const user = session?.user;
  const searchParams = useSearchParams();
  const authToken = searchParams.get("g-oauth-token");

  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [trendingEventCategories, setTrendingEventCategories] =
    useState<ITrendingEventCategory[]>();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isFetchingFeaturedEvents, setIsFetchingFeaturedEvents] =
    useState(true);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [
    isFetchingTrendingEventCategories,
    setIsFetchingTrendingEventCategories,
  ] = useState(true);
  const [showBetaTestModal, setShowBetaTestModal] = useState(false);
  const [
    emailVerificationPromptIsVisible,
    setEmailVerificationPromptIsVisible,
  ] = useState(false);
  const [showMarketplaceAnnouncement, setShowMarketplaceAnnouncement] =
    useState(false);

  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  const isEmailVerified =
    user && userInfo
      ? userInfo.flags.some(
          (flag) =>
            flag.flagName === "isEmailVerified" && flag.flagValue === true
        )
      : undefined;

  const handleCloseMarketplaceAnnouncement = () => {
    handleMarketplaceAnnouncementViewed();
    setShowMarketplaceAnnouncement(false);
  };

  async function handleFetchFeaturedEvents() {
    // Fetch events
    await fetchFeaturedEvents()
      .then((response) => {
        if (response) {
          setFeaturedEvents(response.data);

          // Save events to session storage
          // sessionStorage.setItem(StorageKeys.Events, JSON.stringify(response.data));
        }
      })
      .catch((error) => {})
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
          setEvents(response.data);

          // Save events to session storage
          // sessionStorage.setItem(StorageKeys.Events, JSON.stringify(response.data));
        }
      })
      .catch((err) => {
        // toasthandler?.logError('Error', 'An error occurred while fetching events.');
      })
      .finally(() => {
        // Stop loader
        setIsFetchingEvents(false);
      });
  }

  async function handleFetchTrendingEventCategories() {
    // Fetch events
    await fetchTrendingEventCategories()
      .then((response) => {
        if (response) {
          setTrendingEventCategories(response.data);
        }
      })
      .catch((err) => {
        catchError(err);
      })
      .finally(() => {
        // Stop loader
        setIsFetchingTrendingEventCategories(false);
      });
  }

  useEffect(() => {
    handleFetchFeaturedEvents();
    handleFetchEvents();
    handleFetchTrendingEventCategories();
  }, []);

  useEffect(() => {
    if (authToken) {
      const login = async () => {
        await signIn("google-oauth", {
          token: authToken,
          callbackUrl: "/",
          // redirect: false
        }).then((response) => {
          // refresh the page
          // window.location.reload();
        });
      };

      login();
    }
  }, [authToken]);

  useEffect(() => {
    if (shouldShowMarketplaceAnnouncement()) {
      setShowMarketplaceAnnouncement(true);
    }
  }, []);

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
      {/* <MarketplaceAnnouncement
        isOpen={showMarketplaceAnnouncement}
        onClose={handleCloseMarketplaceAnnouncement}
      /> */}

      {emailVerificationPromptIsVisible && (
        <EmailVerificationPrompt
          visibility={emailVerificationPromptIsVisible}
          setVisibility={setEmailVerificationPromptIsVisible}
          userId={userInfo?.id as string}
          userEmail={userInfo?.email as string}
          userName={userInfo?.firstName as string}
        />
      )}

      <div className="bg-dark-grey text-white">
        <HeroSection
          isFetchingEvents={isFetchingEvents}
          events={events}
          imageWithPlaceholder={imageWithPlaceholder}
          setEmailVerificationPromptIsVisible={
            setEmailVerificationPromptIsVisible
          }
          trendingEventCategories={trendingEventCategories}
          isEmailVerified={isEmailVerified}
        />
        <FeaturedEvents
          isFetchingEvents={isFetchingFeaturedEvents}
          featuredEvents={featuredEvents}
        />
        <RecentlyConcludedEvents />
        <Services />
        <TestimonialSection />
        <CreateEvent
          isEmailVerified={isEmailVerified}
          setEmailVerificationPromptIsVisible={
            setEmailVerificationPromptIsVisible
          }
        />
        <UpcomingEvents
          events={events}
          isEmailVerified={isEmailVerified}
          setEmailVerificationPromptIsVisible={
            setEmailVerificationPromptIsVisible
          }
          trendingEventCategories={trendingEventCategories}
        />
        {/* <MobileAppSection /> */}
      </div>
    </>
  );
};

export default Homepage;
