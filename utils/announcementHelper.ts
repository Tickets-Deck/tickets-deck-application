import { StorageKeys } from "@/app/constants/storageKeys";

const ANNOUNCEMENT_DURATION_DAYS = 10;

/**
 * Checks if the marketplace announcement modal should be shown.
 * - The user should see it once a day for 10 days.
 * @returns {boolean} - True if the modal should be shown, false otherwise.
 */
export const shouldShowMarketplaceAnnouncement = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const timesViewed = parseInt(
    localStorage.getItem(StorageKeys.MrktNewsViewed) || "0",
    10
  );
  const lastViewedTimestamp = localStorage.getItem(
    StorageKeys.MrktNewsLastViewed
  );

  // Don't show if viewed 10 or more times
  if (timesViewed >= ANNOUNCEMENT_DURATION_DAYS) {
    return false;
  }

  // If never viewed, show it
  if (!lastViewedTimestamp) {
    return true;
  }

  const oneDayInMillis = 24 * 60 * 60 * 1000;
  const lastViewedDate = new Date(parseInt(lastViewedTimestamp, 10));
  const now = new Date();

  // Show if it has been more than 24 hours since the last view
  return now.getTime() - lastViewedDate.getTime() > oneDayInMillis;
};

/**
 * Updates localStorage when the marketplace announcement is viewed.
 * - Increments the view count.
 * - Sets the last viewed timestamp to now.
 */
export const handleMarketplaceAnnouncementViewed = () => {
  if (typeof window === "undefined") return;
  const timesViewed = parseInt(localStorage.getItem(StorageKeys.MrktNewsViewed) || "0", 10);
  localStorage.setItem(StorageKeys.MrktNewsViewed, (timesViewed + 1).toString());
  localStorage.setItem(StorageKeys.MrktNewsLastViewed, Date.now().toString());
};
