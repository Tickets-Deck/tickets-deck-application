import { ReactElement, FunctionComponent, useState, useEffect, useContext, MouseEvent } from "react";
import styles from "../../styles/Footer.module.scss";
import { useCreateNewsletterSubscriber } from "@/app/api/apiClient";
import { ToastContext } from "@/app/extensions/toast";
import { emailRegex } from "@/app/constants/emailRegex";
import ComponentLoader from "../Loader/ComponentLoader";


interface SubscriptionFormSectionProps {

}


enum SubscriptionMsgStatus {
    Error = 1,
    Success = 2
}

const SubscriptionFormSection: FunctionComponent<SubscriptionFormSectionProps> = (): ReactElement => {

    const createNewsletterSubscriber = useCreateNewsletterSubscriber();
    const toastHandler = useContext(ToastContext);

    const [emailMsg, setEmailMsg] = useState<{ value: string, status: SubscriptionMsgStatus | undefined }>();
    const [email, setEmail] = useState<string>();

    const [loading, setLoading] = useState(false);

    async function handleCreateNewsletterSubscriber(e: MouseEvent) {

        // Prevent default behaviour
        e.preventDefault();

        if (!email) {
            setEmailMsg({ value: 'Please input your email', status: SubscriptionMsgStatus.Error });
            return;
        }
        if (!emailRegex.test(email.trim())) {
            setEmailMsg({ value: 'Please input a valid email', status: SubscriptionMsgStatus.Error });
            return;
        }

        setLoading(true);

        await createNewsletterSubscriber(email.trim())
            .then((response) => {
                console.log(response);
                // Display success message
                toastHandler?.logSuccess('Success', 'You have successfully subscribed to our newsletter');
                setEmailMsg({ value: 'You have successfully subscribed to our newsletter', status: SubscriptionMsgStatus.Success });
                // Clear input field
                setEmail('');
            })
            .catch((error) => {
                console.log(error);
                switch (error.response?.data.error) {
                    case "Email is not valid":
                        setEmailMsg({ value: 'Please input a valid email', status: SubscriptionMsgStatus.Error });
                        break;
                    case "Email already exists":
                        setEmailMsg({ value: 'Email already exists', status: SubscriptionMsgStatus.Error });
                        break;

                    default:
                        setEmailMsg({ value: "", status: undefined });
                        break;
                }
            })
            .finally(() => {
                setLoading(false);
            })
    };

    useEffect(() => {
        if (emailMsg?.value) {
            setTimeout(() => {
                setEmailMsg({ value: '', status: undefined });
            }, 5000);
        }
    }, [emailMsg]);

    return (
        <>
            <form className={styles.content__subscribeArea} onSubmit={() => { }}>
                <input type='text'
                    name='email'
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value)
                        setEmailMsg({ value: '', status: undefined });
                    }} />
                <button
                    type='submit'
                    disabled={loading ? true : false}
                    style={loading ? { cursor: 'not-allowed' } : {}}
                    onClick={(e) => handleCreateNewsletterSubscriber(e)}>
                    Subscribe Now
                    {loading && <ComponentLoader lightTheme isSmallLoader customBackground="#8133F1" customLoaderColor="#ffffff" />}
                </button>
            </form>
            {emailMsg &&
                <span
                    style={{ paddingTop: '5px' }}
                    className={emailMsg.status === SubscriptionMsgStatus.Success ? styles.successMsg : styles.errorMsg}>
                    {emailMsg.value}
                </span>
            }
        </>
    );
}

export default SubscriptionFormSection;