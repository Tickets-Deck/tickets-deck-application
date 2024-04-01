import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useState } from "react";
import styles from "../../styles/ProfilePage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface AccountSettingsFormContainerProps {
    userInformation: UserCredentialsResponse | undefined;
    retrievedUserInformation: UserCredentialsResponse | undefined;
    setRetrievedUserInformation: Dispatch<SetStateAction<UserCredentialsResponse | undefined>>
    isFormFieldsEditable: boolean
    emailErrorMsg: boolean
    setTriggerInfoUpdate: Dispatch<SetStateAction<boolean>>
}

const AccountSettingsFormContainer: FunctionComponent<AccountSettingsFormContainerProps> = (
    { userInformation, retrievedUserInformation, setRetrievedUserInformation,
        isFormFieldsEditable, emailErrorMsg, setTriggerInfoUpdate }): ReactElement => {

    const [isFacebookUrlValid, setIsFacebookUrlValid] = useState<boolean>();
    const [isTwitterUrlValid, setIsTwitterUrlValid] = useState<boolean>();
    const [isInstagramUrlValid, setIsInstagramUrlValid] = useState<boolean>();

    /**
     * Function to handle creating an event for the key down event on the input fields
     * @param e is the event object
     */
    function createEventKeyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        // Check if user pressed the shift + enter keys
        // if (e.keyCode === 13 && e.shiftKey) {
        //     console.log('Shift + Enter pressed');
        //     return;
        // }
        if (e.keyCode === 13 && e.ctrlKey) {
            setTriggerInfoUpdate(true);
        }
    };

    /**
     * Function to validate a facebook url
    @summary ^: Asserts the start of the string.
    @summary (https?:\/\/)?: Matches the protocol part of the URL (e.g., "http://" or "https://"), where:
        http or https is matched literally.
        s? indicates that the "s" is optional, allowing for both "http" and "https".
        :\/\/ matches the colon and two forward slashes, which are part of the URL structure.
        (...)? makes the entire protocol part optional, so the URL can start with or without "http://" or "https://".

    @summary (www\.)?: Matches the "www." subdomain part of the URL, where:
        www is matched literally.
        \. matches the period, which is escaped with a backslash to treat it as a literal period.
        (...)? makes the "www." part optional, allowing for URLs with or without the "www." subdomain.

    @summary facebook.com\/: Matches the domain part of the URL, specifically "facebook.com/", where:
        facebook.com is matched literally.
        \/ matches the forward slash, which is part of the URL structure.

    @summary [a-zA-Z0-9(\.\?)?]: Matches the rest of the URL path, where:
        [...] defines a character set to match any single character within the set.
        a-zA-Z0-9 matches any alphabetic character (upper or lower case) or digit, allowing for alphanumeric characters in the path.
        (\.\?)? matches the dot (escaped with \.) and the question mark, which are optional in the URL path.
        (...)? makes the entire pattern optional, allowing for URLs with or without additional characters after the domain.
     * @param url is the url to be validated
     * @returns true if the url is valid, false otherwise
     */
    function validateFacebookUrl(url: string): boolean {
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
        return facebookRegex.test(url);
    }

    function validateTwitterUrl(url: string): boolean {
        const twitterRegex = /^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9_]+\/?$/;
        return twitterRegex.test(url);
    }

    function validateInstagramUrl(url: string): boolean {
        const instagramRegex = /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9_]+\/?$/;
        return instagramRegex.test(url);
    }

    return (
        <div className={styles.accountSettingsFormContainer}>
            <div className={styles.formRow}>
                <div className={styles.formField}>
                    <label htmlFor="firstname">First name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={retrievedUserInformation?.firstName}
                        // defaultValue={userInformation?.firstName}
                        placeholder="Enter first name"
                        onChange={(e) => { setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, firstName: e.target.value }) }}
                        disabled={!isFormFieldsEditable}
                        onKeyDown={(e) => createEventKeyDownHandler(e)}
                    />
                    {/* {true && <span className={styles.errorMsg}>Please enter your first name</span>} */}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="lastname">Last name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={retrievedUserInformation?.lastName}
                        // defaultValue={userInformation?.lastName}
                        placeholder="Enter last name"
                        onChange={(e) => { setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, lastName: e.target.value }) }}
                        disabled={!isFormFieldsEditable}
                        onKeyDown={(e) => createEventKeyDownHandler(e)}
                    />
                    {/* {true && <span className={styles.errorMsg}>Please enter your last name</span>} */}
                </div>
            </div>
            <div className={styles.formRow}>
                <div className={styles.formField}>
                    <label htmlFor="firstname">Email address</label>
                    <input
                        type="email"
                        name="email"
                        value={retrievedUserInformation?.email}
                        // defaultValue={userInformation?.email}
                        placeholder="Enter email address"
                        onChange={(e) => { setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, email: e.target.value }) }}
                        disabled={!isFormFieldsEditable}
                        onKeyDown={(e) => createEventKeyDownHandler(e)}
                    />
                    {emailErrorMsg && <span className={styles.errorMsg}>Email address already exists</span>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="phone">Phone number</label>
                    <input
                        type="text"
                        name="phone"
                        value={retrievedUserInformation?.phone}
                        placeholder="Enter phone number"
                        onChange={(e) => {
                            // if(phoneNumberRegex.test(e.target.value) != true) {
                            //     return;
                            // }
                            // if(!Number(e.target.value)) {
                            //     return;
                            // }
                            // if(!isNaN(Number(e.currentTarget.value))) {
                            //     return; 
                            // }
                            setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, phone: e.target.value })
                        }}
                        onKeyDown={(e) => createEventKeyDownHandler(e)}
                        disabled={!isFormFieldsEditable}
                    />
                    {/* {true && <span className={styles.errorMsg}>Please enter your last name</span>} */}
                </div>
            </div>
            <br />
            <div className={styles.formRow}>
                <div className={styles.formField}>
                    <label htmlFor="facebookUrl">Facebook Url</label>
                    <input
                        type="text"
                        name="facebookUrl"
                        value={retrievedUserInformation?.facebookUrl}
                        placeholder="Enter link to your Facebook profile"
                        onChange={(e) => {
                            setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, facebookUrl: e.target.value })
                        }}
                        onKeyUp={(e) => {
                            if (e.currentTarget.value === '') {
                                setIsFacebookUrlValid(true);
                                return;
                            }
                            if (!validateFacebookUrl(e.currentTarget.value)) {
                                setIsFacebookUrlValid(false);
                                return;
                            }
                            setIsFacebookUrlValid(true);
                        }}
                        disabled={!isFormFieldsEditable}
                        onKeyDown={(e) => createEventKeyDownHandler(e)}
                    />
                    {isFacebookUrlValid === false && <span className={styles.errorMsg}>Please input a valid facebook url</span>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="twitterUrl">Twitter Url</label>
                    <input
                        type="text"
                        name="twitterUrl"
                        value={retrievedUserInformation?.twitterUrl}
                        placeholder="Enter link to your Twitter profile"
                        onChange={(e) => {
                            setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, twitterUrl: e.target.value })
                        }}
                        onKeyUp={(e) => {
                            if (e.currentTarget.value === '') {
                                setIsTwitterUrlValid(true);
                                return;
                            }
                            if (!validateTwitterUrl(e.currentTarget.value)) {
                                setIsTwitterUrlValid(false);
                                return;
                            }
                            setIsTwitterUrlValid(true);
                        }}
                        disabled={!isFormFieldsEditable}
                        onKeyDown={(e) => createEventKeyDownHandler(e)}
                    />
                    {(isTwitterUrlValid === false) && <span className={styles.errorMsg}>Please input a valid twitter url</span>}
                </div>
            </div>
            <div className={styles.formField}>
                <label htmlFor="instagramUrl">Instagram Url</label>
                <input
                    type="text"
                    name="instagramUrl"
                    value={retrievedUserInformation?.instagramUrl}
                    placeholder="Enter link to your Instagram profile"
                    onChange={(e) => {
                        setRetrievedUserInformation({ ...retrievedUserInformation as UserCredentialsResponse, instagramUrl: e.target.value })
                    }}
                    onKeyUp={(e) => {
                        if (e.currentTarget.value === '') {
                            setIsInstagramUrlValid(true);
                            return;
                        }
                        if (!validateInstagramUrl(e.currentTarget.value)) {
                            setIsInstagramUrlValid(false);
                            return;
                        }
                        setIsInstagramUrlValid(true);
                    }}
                    disabled={!isFormFieldsEditable}
                    onKeyDown={(e) => createEventKeyDownHandler(e)}
                />
                {(isInstagramUrlValid === false) && <span className={styles.errorMsg}>Please input a valid instagram url</span>}
            </div>
        </div>
    );
}

export default AccountSettingsFormContainer;