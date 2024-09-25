import { FunctionComponent, ReactNode, createContext, useEffect, useState } from "react";
import { UserCredentialsResponse } from "../models/IUser";
import { useFetchBankList, useFetchTransactionFee, useFetchUserInformation } from "../api/apiClient";
import { catchError } from "../constants/catchError";
import { useSession } from "next-auth/react";
import { Bank } from "../models/IBankAccount";
import { StorageKeys } from "../constants/storageKeys";
import { TransactionFeeResponse } from "../models/ITransactionFee";


// Define the type for the context data
export type ApplicationContextData = {
    isFetchingUserProfile: boolean;
    userProfileInformation: UserCredentialsResponse | null;
    fetchUserProfileInformation: () => void;
    displayToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
    isUserLoginPromptVisible: boolean;
    toggleUserLoginPrompt: () => void;
    bankList: Bank[];
    transactionFees: TransactionFeeResponse[] | undefined;
};

// Create a context with the specified data type
const ApplicationContext = createContext<ApplicationContextData | undefined>(undefined);

// Create a provider component that takes children as props
type AppProviderProps = {
    children: ReactNode;
};

const AppProvider: FunctionComponent<AppProviderProps> = ({ children }) => {

    const fetchUserInformation = useFetchUserInformation();
    const fetchBankList = useFetchBankList();
    const fetchTransactionFee = useFetchTransactionFee();

    const { data: session } = useSession();

    // Define state for customer data
    const [userProfileInformation, setUserProfileInformation] = useState<UserCredentialsResponse | null>(null);
    const [isFetchingUserProfileInformation, setIsFetchingUserProfileInformation] = useState(false);

    // Define state for bank list
    const [bankList, setBankList] = useState<Bank[]>([]);

    // Define state for displaying login prompt
    const [showUserLoginPrompt, setShowUserLoginPrompt] = useState(false);

    const [transactionFees, setTransactionFees] = useState<TransactionFeeResponse[]>();

    // Define function to display toast
    const displayToast = (message: string, type: "success" | "error" | "info" | "warning") => {
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
            })

    };

    async function handleFetchBankList() {

        // Retrieve the bank list from Storage
        const bankListFromStorage = localStorage.getItem(StorageKeys.BankLists);

        // If the bank list is in storage, set it to the state
        if (bankListFromStorage && bankListFromStorage !== null && bankListFromStorage.length > 0) {
            setBankList(JSON.parse(bankListFromStorage));
            return;
        }

        // Fetch the bank list
        await fetchBankList()
            .then((response) => {
                // save the bank list to local storage
                localStorage.setItem(StorageKeys.BankLists, JSON.stringify(response.data));
                setBankList(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
    };

    /**
     * Function to fetch transaction fee percentage
     */
    async function handleFetchTransactionFee() {
        if (transactionFees) {
            return;
        }
        await fetchTransactionFee()
            .then((response) => {
                // console.log("🚀 ~ .then fee ~ response:", response)
                setTransactionFees(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
    }

    useEffect(() => {
        if (bankList.length === 0) {
            handleFetchBankList();
        }
    }, []);
    useEffect(() => {
        if (!transactionFees) {
            handleFetchTransactionFee();
        }
    }, [transactionFees]);

    // Define the values you want to share
    const sharedData: ApplicationContextData = {
        isFetchingUserProfile: isFetchingUserProfileInformation,
        userProfileInformation,
        fetchUserProfileInformation: handleFetchUserInformation,
        displayToast,
        isUserLoginPromptVisible: showUserLoginPrompt,
        toggleUserLoginPrompt: () => setShowUserLoginPrompt(!showUserLoginPrompt),
        bankList,
        transactionFees
    };

    return (
        <ApplicationContext.Provider value={sharedData}>
            {children}
        </ApplicationContext.Provider>
    );
};

export { AppProvider, ApplicationContext };
