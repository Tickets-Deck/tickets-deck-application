import {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserCredentialsResponse } from "../models/IUser";
import {
  useFetchBankList,
  useFetchEventCategories,
  useFetchEventViewsAnalytics,
  useFetchEventViewsCount,
  useFetchTransactionFee,
  useFetchUserInformation,
  useRecordEventView,
} from "../api/apiClient";
import { catchError } from "../constants/catchError";
import { useSession } from "next-auth/react";
import { Bank } from "../models/IBankAccount";
import { StorageKeys } from "../constants/storageKeys";
import { TransactionFeeResponse } from "../models/ITransactionFee";
import { IEventCategory } from "../models/IEventCategory";

// Define the type for the context data
export type ApplicationContextData = {
  isFetchingUserProfile: boolean;
  userProfileInformation: UserCredentialsResponse | null;
  fetchUserProfileInformation: () => void;
  displayToast: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
  isUserLoginPromptVisible: boolean;
  toggleUserLoginPrompt: () => void;
  bankList: Bank[];
  transactionFee: TransactionFeeResponse | undefined;
  handleFetchTransactionFee: (eventId: string) => Promise<void>;
  eventCategories: IEventCategory[] | undefined;
  handleRecordEventView: (eventId: string, userId?: string) => Promise<void>;
  handleFetchEventCategories: () => Promise<void>;
};

// Create a context with the specified data type
const ApplicationContext = createContext<ApplicationContextData | undefined>(
  undefined
);

// Create a provider component that takes children as props
type AppProviderProps = {
  children: ReactNode;
};

const AppProvider: FunctionComponent<AppProviderProps> = ({ children }) => {
  const fetchUserInformation = useFetchUserInformation();
  const fetchBankList = useFetchBankList();
  const fetchEventCategories = useFetchEventCategories();
  const fetchTransactionFee = useFetchTransactionFee();
  const recordEventView = useRecordEventView();
  const fetchEventViewsAnalytics = useFetchEventViewsAnalytics();
  const fetchEventViewsCount = useFetchEventViewsCount();

  const { data: session } = useSession();

  // Define state for customer data
  const [eventCategories, setEventCategories] = useState<IEventCategory[]>();
  const [userProfileInformation, setUserProfileInformation] =
    useState<UserCredentialsResponse | null>(null);
  const [
    isFetchingUserProfileInformation,
    setIsFetchingUserProfileInformation,
  ] = useState(false);

  // Define state for bank list
  const [bankList, setBankList] = useState<Bank[]>([]);

  // Define state for displaying login prompt
  const [showUserLoginPrompt, setShowUserLoginPrompt] = useState(false);

  const [transactionFee, setTransactionFee] =
    useState<TransactionFeeResponse>();

  // Define function to display toast
  const displayToast = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    alert(message);
  };

  /**
   * Function to fetch user's profile information
   */
  const handleFetchUserInformation = async () => {
    // Set loader to true
    setIsFetchingUserProfileInformation(true);

    // Retrieve customer
    await fetchUserInformation(session?.user.id as string)
      .then((response) => {
        // console.log("response data: ", response.data);
        alert("response data: " + JSON.stringify(response.data));

        // Set the result
        setUserProfileInformation(response.data);
      })
      .catch((error) => {
        // Set customer to null
        setUserProfileInformation(null);

        // Log the error
        alert("Error fetching customer data: " + error);
        // console.error("Error fetching customer data:", error);

        catchError(error);
      })
      .finally(() => {
        // Stop the loader
        setIsFetchingUserProfileInformation(false);
      });
  };

  async function handleFetchBankList() {
    // Retrieve the bank list from Storage
    const bankListFromStorage = localStorage.getItem(StorageKeys.BankLists);

    // If the bank list is in storage, set it to the state
    if (
      bankListFromStorage &&
      bankListFromStorage !== null &&
      bankListFromStorage.length > 0
    ) {
      setBankList(JSON.parse(bankListFromStorage));
      return;
    }

    // Fetch the bank list
    await fetchBankList()
      .then((response) => {
        // save the bank list to local storage
        localStorage.setItem(
          StorageKeys.BankLists,
          JSON.stringify(response.data)
        );
        setBankList(response.data);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  async function handleFetchEventCategories() {
    // Fetch the bank list
    await fetchEventCategories()
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        setEventCategories(response.data);
      })
      .catch((error) => {
        console.log("🚀 ~ .then ~ error:", error);
        catchError(error);
      });
  }

  /**
   * Function to fetch transaction fee percentage
   * @param eventId The event's ID
   */
  async function handleFetchTransactionFee(eventId: string) {
    if (transactionFee) {
      return;
    }
    await fetchTransactionFee(eventId)
      .then((response) => {
        setTransactionFee(response.data);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  async function handleRecordEventView(eventId: string, userId?: string) {
    await recordEventView(eventId, userId)
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  async function handleFetchEventViewsAnalytics(eventId: string) {
    await fetchEventViewsAnalytics(eventId)
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  useEffect(() => {
    if (bankList.length === 0) {
      handleFetchBankList();
    }
  }, []);

  useEffect(() => {
    if (!eventCategories) {
      handleFetchEventCategories();
    }
  }, [eventCategories]);

  // Define the values you want to share
  const sharedData: ApplicationContextData = {
    isFetchingUserProfile: isFetchingUserProfileInformation,
    userProfileInformation,
    fetchUserProfileInformation: handleFetchUserInformation,
    displayToast,
    isUserLoginPromptVisible: showUserLoginPrompt,
    toggleUserLoginPrompt: () => setShowUserLoginPrompt(!showUserLoginPrompt),
    bankList,
    transactionFee,
    handleFetchTransactionFee,
    eventCategories,
    handleRecordEventView,
    handleFetchEventCategories
  };

  return (
    <ApplicationContext.Provider value={sharedData}>
      {children}
    </ApplicationContext.Provider>
  );
};

export { AppProvider, ApplicationContext };

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplicationContext must be used within an AppProvider");
  }
  return context;
};
