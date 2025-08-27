import {
    ReactElement,
    FunctionComponent,
    useState,
    useEffect,
    useContext,
    MouseEvent,
} from "react";
import { useCreateNewsletterSubscriber } from "@/app/api/apiClient";
import { emailRegex } from "@/app/constants/emailRegex";
import ComponentLoader from "../Loader/ComponentLoader";
import { ApplicationError } from "@/app/constants/applicationError";
import { ToastContext } from "@/app/context/ToastCardContext";

interface SubscriptionFormSectionProps { }

enum SubscriptionMsgStatus {
    Error = 1,
    Success = 2,
}

const SubscriptionFormSection: FunctionComponent<SubscriptionFormSectionProps> = (): ReactElement => {
    const createNewsletterSubscriber = useCreateNewsletterSubscriber();
    const toastHandler = useContext(ToastContext);

    const [emailMsg, setEmailMsg] = useState<{
        value: string;
        status: SubscriptionMsgStatus | undefined;
    }>();
    const [email, setEmail] = useState<string>();

    const [loading, setLoading] = useState(false);

    async function handleCreateNewsletterSubscriber(e: MouseEvent) {
        // Prevent default behaviour
        e.preventDefault();

        if (!email) {
            setEmailMsg({
                value: "Please input your email",
                status: SubscriptionMsgStatus.Error,
            });
            return;
        }
        if (!emailRegex.test(email.trim())) {
            setEmailMsg({
                value: "Please input a valid email",
                status: SubscriptionMsgStatus.Error,
            });
            return;
        }

        setLoading(true);

        await createNewsletterSubscriber(email.trim())
            .then((response) => {
                // Display success message
                toastHandler?.logSuccess(
                    "Success",
                    "You have successfully subscribed to our newsletter"
                );
                // Set email message
                setEmailMsg({
                    value: "You have successfully subscribed to our newsletter",
                    status: SubscriptionMsgStatus.Success,
                });
                // Clear input field
                setEmail("");
            })
            .catch((error) => {
                if (error.response) {
                    if (
                        error.response.data.errorCode ==
                        ApplicationError.UserWithEmailAlreadyExists.Code
                    ) {
                        setEmailMsg({
                            value: "You have already subscribed to our mailing list.",
                            status: SubscriptionMsgStatus.Error,
                        });
                    }
                    return;
                }
                switch (error.response?.data.error) {
                    case "Email is not valid":
                        setEmailMsg({
                            value: "Please input a valid email",
                            status: SubscriptionMsgStatus.Error,
                        });
                        break;
                    case "Email already exists":
                        setEmailMsg({
                            value: "Email already exists",
                            status: SubscriptionMsgStatus.Error,
                        });
                        break;

                    default:
                        setEmailMsg({ value: "", status: undefined });
                        break;
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (emailMsg?.value) {
            setTimeout(() => {
                setEmailMsg({ value: "", status: undefined });
            }, 5000);
        }
    }, [emailMsg]);

    return (
        <>
            <form
                className='flex items-center w-full sm:w-fit gap-2 sm:gap-0 bg-transparent sm:bg-white flex-col sm:flex-row sm:rounded-3xl overflow-hidden'
                onSubmit={() => { }}
            >
                <input
                    type='text'
                    name='email'
                    placeholder='Enter your email address'
                    autoComplete='off'
                    className='placeholder:text-grey-3 bg-white w-full sm:bg-transparent text-dark-grey border-none outline-none rounded-3xl py-[0.85rem] px-[0.625rem] pl-4'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailMsg({ value: "", status: undefined });
                    }}
                />
                <button
                    type='submit'
                    className='primaryButton justify-center !min-w-[8.75rem] !py-3 px-6 !w-full h-full md:!w-auto mr-[2px] whitespace-nowrap !rounded-3xl !text-base'
                    disabled={loading ? true : false}
                    style={loading ? { cursor: "not-allowed" } : {}}
                    onClick={(e) => handleCreateNewsletterSubscriber(e)}
                >
                    <p className='text-base'>Subscribe Now</p>
                    {loading && (
                        <ComponentLoader
                            lightTheme
                            isSmallLoader
                            customBackground='#8133F1'
                            customLoaderColor='#ffffff'
                        />
                    )}
                </button>
            </form>
            {emailMsg && (
                <span
                    style={{ paddingTop: "5px" }}
                    className={`${emailMsg.status === SubscriptionMsgStatus.Success
                            ? "text-success-color"
                            : "text-[#eb485b]"
                        } text-xs text-[#eb485b] flex items-center gap-0.5 `}
                >
                    {emailMsg.value}
                </span>
            )}
        </>
    );
};

export default SubscriptionFormSection;
