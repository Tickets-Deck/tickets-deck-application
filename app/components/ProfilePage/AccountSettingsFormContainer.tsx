import { ReactElement, FunctionComponent, Dispatch, SetStateAction } from "react";
import styles from "../../styles/ProfilePage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { phoneNumberRegex } from "@/app/constants/emailRegex";

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
                        onKeyDown={(e) => {
                            // Check if user pressed the shift + enter keys
                            // if (e.keyCode === 13 && e.shiftKey) {
                            //     console.log('Shift + Enter pressed');
                            //     return;
                            // }
                            // Check if user pressed the ctrl + enter keys
                            if (e.keyCode === 13 && e.ctrlKey) {
                                setTriggerInfoUpdate(true);
                                return;
                            }
                        }}
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
                        onKeyDown={(e) => {
                            // Check if user pressed the ctrl + enter keys
                            if (e.keyCode === 13 && e.ctrlKey) {
                                setTriggerInfoUpdate(true);
                                return;
                            }
                        }}
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
                        onKeyDown={(e) => {
                            // Check if user pressed the ctrl + enter keys
                            if (e.keyCode === 13 && e.ctrlKey) {
                                setTriggerInfoUpdate(true);
                                return;
                            }
                        }}
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
                        onKeyDown={(e) => {
                            // Check if user pressed the ctrl + enter keys
                            if (e.keyCode === 13 && e.ctrlKey) {
                                setTriggerInfoUpdate(true);
                                return;
                            }
                        }}
                        disabled={!isFormFieldsEditable}
                    />
                    {/* {true && <span className={styles.errorMsg}>Please enter your last name</span>} */}
                </div>
            </div>
        </div>
    );
}

export default AccountSettingsFormContainer;