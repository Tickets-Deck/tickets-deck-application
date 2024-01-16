import { ReactElement, FunctionComponent, useState } from "react";
import styles from "../../styles/ProfilePage.module.scss"
import { CheckIcon, CloseIcon, EditIcon } from "../SVGs/SVGicons";
import { UserCredentialsResponse } from "@/app/models/IUser";
import ComponentLoader from "../Loader/ComponentLoader";
import { useUpdateUserName } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";

interface UserNameContainerProps {
    userInformation: UserCredentialsResponse;
}

const UserNameContainer: FunctionComponent<UserNameContainerProps> = ({ userInformation }): ReactElement => {

    const updateUserName = useUpdateUserName();
    const { data: session, update } = useSession();

    const [userName, setUserName] = useState<string>('');
    const [isUserNameUpdateFieldVisible, setIsUserNameUpdateFieldVisible] = useState(false);
    const [userNameErrorMsg, setUserNameErrorMsg] = useState(false);
    const [isUpdatingUserName, setIsUpdatingUserName] = useState(false);

    async function handleUpdateUserName() {

        // Start loader
        setIsUpdatingUserName(true);

        // Validate username
        if (!userName) {
            setUserNameErrorMsg(true);
            setIsUpdatingUserName(false);
            return;
        }
        setUserNameErrorMsg(false);

        // Update username
        await updateUserName(session?.user.id as string, { username: userName })
            .then(async (response) => {
                // Update the user's profile photo in the session
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        username: response.data.username,
                    },
                })
                // console.log(response);
                setIsUserNameUpdateFieldVisible(false);
            })
            .catch((error) => {
                console.log(error);
                catchError(error);
                if(error.response.data.error == "User with specified username already exists") {
                    setUserNameErrorMsg(true);
                    setIsUpdatingUserName(false);
                    return;
                }
            })
            .finally(() => {
                // Stop loader
                setIsUpdatingUserName(false);
            })

    }

    return (
        <>
            {
                userInformation.username &&
                <p>@{userInformation.username}
                    <span onClick={() => setIsUserNameUpdateFieldVisible(true)}><EditIcon /></span>
                </p>
            }
            {!userInformation.username && !isUserNameUpdateFieldVisible && <button onClick={() => setIsUserNameUpdateFieldVisible(true)}>Add username</button>}
            {
                isUserNameUpdateFieldVisible &&
                <>
                    <div className={styles.userNameUpdateContainer}>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <button disabled={isUpdatingUserName} className={styles.cancelBtn} onClick={() => setIsUserNameUpdateFieldVisible(false)}><CloseIcon /></button>
                        <button disabled={isUpdatingUserName || !userName} className={styles.saveBtn} onClick={handleUpdateUserName}>
                            <CheckIcon />
                            {isUpdatingUserName && <ComponentLoader lightTheme isSmallLoader scale={0.8} customBackground="#8133F1" customLoaderColor="#ffffff" />}
                        </button>
                    </div>
                    {userNameErrorMsg && <span className={styles.errorMsg}>Username already taken</span>}
                </>
            }
        </>
    );
}

export default UserNameContainer;