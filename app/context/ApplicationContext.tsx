import { FunctionComponent, ReactNode, createContext, useState } from "react";
import { UserCredentialsResponse } from "../models/IUser";
import { useFetchUserInformation } from "../api/apiClient";
import { catchError } from "../constants/catchError";
import { useSession } from "next-auth/react";


// Define the type for the context data
export type ApplicationContextData = {
    isFetchingUserProfile: boolean;
    userProfileInformation: UserCredentialsResponse | null;
    fetchUserProfileInformation: () => void;
    displayToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
    isUserLoginPromptVisible: boolean;
    toggleUserLoginPrompt: () => void;
};

// Create a context with the specified data type
const ApplicationContext = createContext<ApplicationContextData | undefined>(undefined);

// Create a provider component that takes children as props
type AppProviderProps = {
    children: ReactNode;
};

const AppProvider: FunctionComponent<AppProviderProps> = ({ children }) => {

    const fetchUserInformation = useFetchUserInformation();
    const { data: session } = useSession();

    // Define state for customer data
    const [userProfileInformation, setUserProfileInformation] = useState<UserCredentialsResponse | null>(null);
    const [isFetchingUserProfileInformation, setIsFetchingUserProfileInformation] = useState(false);

    // Define state for displaying login prompt
    const [showUserLoginPrompt, setShowUserLoginPrompt] = useState(false);

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

    // Define the values you want to share
    const sharedData: ApplicationContextData = {
        isFetchingUserProfile: isFetchingUserProfileInformation,
        userProfileInformation,
        fetchUserProfileInformation: handleFetchUserInformation,
        displayToast,
        isUserLoginPromptVisible: showUserLoginPrompt,
        toggleUserLoginPrompt: () => setShowUserLoginPrompt(!showUserLoginPrompt)
    };

    return (
        <ApplicationContext.Provider value={sharedData}>
            {children}
        </ApplicationContext.Provider>
    );
};

export { AppProvider, ApplicationContext };
