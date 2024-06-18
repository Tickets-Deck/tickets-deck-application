import { ToastContext } from "../../extensions/toast";
import { FunctionComponent, ReactElement, useState, useContext, Dispatch, SetStateAction, useEffect, ChangeEvent } from "react";
import styles from "../../styles/TicketDelivery.module.scss";
import ModalWrapper from "./ModalWrapper";
import { CheckIcon, CloseIcon } from "../SVGs/SVGicons";
import { RetrievedITicketPricing } from "../../models/ITicketPricing";
import { emailRegex } from "../../constants/emailRegex";
import PanelWrapper from "./PanelWrapper";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";
import OrderSummarySection from "../TicketDelivery/OrderSummarySection";
import useResponsiveness from "../../hooks/useResponsiveness";
import { useCreateTicketOrder, useInitializePaystackPayment } from "@/app/api/apiClient";
import { SingleTicketOrderRequest, TicketOrderRequest } from "@/app/models/ITicketOrder";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Toggler from "../custom/Toggler";
import { toast } from "sonner";
import MobileOrderSummarySection from "../TicketDelivery/MobileOrderSummarySection";
import ComponentLoader from "../Loader/ComponentLoader";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import { Theme } from "@/app/enums/Theme";

interface TicketDeliveryProps {
    appTheme: Theme | null
    setVisibility: Dispatch<SetStateAction<boolean>>
    visibility: boolean
    eventTickets: RetrievedTicketResponse[] | undefined
    eventInfo: EventResponse | undefined
    totalPrice: number
}

enum ValidationStatus {
    Valid = 0,
    Invalid = 1,
    NotInitiated = 2,
}

const TicketDelivery: FunctionComponent<TicketDeliveryProps> = (
    { appTheme, visibility, setVisibility, eventTickets, eventInfo, totalPrice }): ReactElement => {

    const createTicketOrder = useCreateTicketOrder();
    const initializePaystackPayment = useInitializePaystackPayment();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    // useEffect(() => {
    //     console.log(eventTickets);
    // }, [eventTickets]);

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);

    // useEffect(() => {
    //     alert("user profile information" + JSON.stringify(userProfileInformation));
    // }, [userProfileInformation]);
    // useEffect(() => {
    //     alert("user info" + JSON.stringify(userInfo));
    // }, [userInfo]);

    // console.log("🚀 ~ userInfo:", userInfo)

    const [ticketPricings, setTicketPricings] = useState<RetrievedITicketPricing[]>([]);
    // const [ticketsTotalPrice, setTicketsTotalPrice] = useState<number>(0);
    const [emailVerificationPromptIsVisible, setEmailVerificationPromptIsVisible] = useState(false);

    const [isValidating, setIsValidating] = useState(false);
    const [canCodeBeValidated, setCanCodeBeValidated] = useState(false);
    const [codeValidationStatus, setCodeValidationStatus] = useState<ValidationStatus>(ValidationStatus.NotInitiated);
    const [couponCodeValue, setCouponCodeValue] = useState<string>();

    const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);

    const [showErrorMessages, setShowErrorMessages] = useState(false);

    const [primaryEmail, setPrimaryEmail] = useState<string>();
    const [userEmailIsPrimaryEmail, setUserEmailIsPrimaryEmail] = useState(true);

    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    // Ticket details form values
    const [formValues, setFormValues] = useState<any>({});

    /**
     * Function to generate each ticket
     */
    function getSelectedTickets() {

        // Initialize selected tickets
        const selectedTickets: RetrievedITicketPricing[] = [];

        // Initialize email index
        let emailIndex = 1;

        // Initialize total price
        let totalPrice = 0;

        // Map through the event tickets
        eventTickets?.forEach((ticket) => {
            // If the ticket is selected and the selected tickets are more than 0
            if (ticket.isSelected && ticket.selectedTickets > 0) {
                // Map through using the count
                for (let i = 0; i < ticket.selectedTickets; i++) {
                    // Update the total price
                    totalPrice += ticket.price;

                    // Update the array
                    selectedTickets.push({
                        emailId: emailIndex++,
                        ticketId: ticket.id,
                        ticketType: ticket.name,
                        selectedTickets: ticket.selectedTickets,
                        price: {
                            currency: eventInfo?.currency || 'NGN',
                            total: ticket.price.toString(),
                        },
                        hasEmail: false
                    });
                }

                // Reset the email index
                emailIndex = 1;
            }
        })

        // Update the state after the iteration is complete
        setTicketPricings(selectedTickets);
    };

    function convertNumberToText(number: number) {
        switch (number) {
            case 1:
                return 'First';
            case 2:
                return 'Second';
            case 3:
                return 'Third';
            case 4:
                return 'Fourth';
            case 5:
                return 'Fifth';
            case 6:
                return 'Sixth';
            case 7:
                return 'Seventh';
            case 8:
                return 'Eighth';
            case 9:
                return 'Ninth';
            default:
                return '';
        }
    };

    function validateFields() {
        ticketPricings.map((ticketPricing) => {
            // console.log(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]?.length > 0);
            // console.log(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]);
            if (ticketPricing.hasEmail && formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]?.length > 0) {
                setShowErrorMessages(false);
            } else {
                setShowErrorMessages(true);
            }
        });
    };

    // console.log("ticketPricings: ", ticketPricings);

    /**
     * Function to handle ticket order creation
     */
    async function handleTicketOrderCreation() {

        // Validate the fields
        validateFields();

        const collatedTicketOrderRequests: SingleTicketOrderRequest[] = ticketPricings.map((ticketPricing) => {
            // console.log(ticketPricing.ticketType, ticketPricing.emailId);

            return {
                ticketId: ticketPricing.ticketId,
                price: parseInt(ticketPricing.price.total),
                associatedEmail: formValues[`${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`],
                contactEmail: primaryEmail ?? (userEmailIsPrimaryEmail ? userInfo?.email as string : ""),
            }
        });

        const ticketOrder: TicketOrderRequest = {
            eventId: eventInfo?.eventId as string,
            tickets: collatedTicketOrderRequests,
            // contactEmail: primaryEmail ?? userInfo?.email as string,
            contactEmail: primaryEmail ?? (userEmailIsPrimaryEmail ? userInfo?.email as string : ""),
            userId: userInfo?.id as string,
        };

        if (ticketOrder.contactEmail === undefined || ticketOrder.contactEmail.length < 1) {
            toast.error("Please select a primary email address to continue.");
            return;
        }

        // Check for the email verification status if the user is logged in.
        if (userInfo && !userInfo.emailVerified) {
            // toast.error("Please verify your email address to continue.");
            setEmailVerificationPromptIsVisible(true);
            return;
        }

        try {
            // Start processing order
            setIsProcessingOrder(true);

            // If the total price is zero, only create the ticket order
            if (totalPrice === 0) {
                const response = await createTicketOrder(ticketOrder);

                // console.log("Ticket order response: ", response);

                // Stop processing order
                setIsProcessingOrder(false);

                if (response) {
                    toast.success("Order successfully processed. You will receive your tickets shortly.");
                    setVisibility(false);

                    if (response.data.id) {
                        window.location.href = `${window.location.origin}/order/${response.data.id}`
                    }
                }
                return;
            }

            const response = await createTicketOrder(ticketOrder);

            // console.log("Ticket order response: ", response);

            if (response) {
                const paymentInit = await initializePaystackPayment({ ticketOrderId: response.data.id, callbackUrl: `${window.location.origin}/verify-payment` });

                // console.log({ paymentInit });

                if (paymentInit) {
                    window.location.href = paymentInit.data.authorization_url;
                }
            }
        } catch (error) {
            // Stop processing order
            setIsProcessingOrder(false);
            // Log the error
            // console.log("Error creating ticket order: ", error);
            // Show error message
            toast.error("An error occurred while processing your order. Please try again.");
        }
    };

    const updateHasEmail = (ticketType: string, ticketId: string) => {
        setTicketPricings(prevTicketPricings => {
            return prevTicketPricings.map(pricing => {
                if (pricing.ticketType === ticketType && pricing.ticketId === ticketId) {
                    return {
                        ...pricing,
                        hasEmail: true, // Update the hasEmail property
                    };
                }
                return pricing;
            });
        });
    };

    /**
     * Function to set primary email
     * @param email is the selected email
     */
    function updatePrimaryEmail(email: string) {
        if (emailRegex.test(email)) {
            setPrimaryEmail(email);
            return;
        }
    };

    /**
     * Function to unset primary email
     * @param email is the selected email
     */
    function unsetPrimaryEmail() {
        setPrimaryEmail(undefined);
    };

    /**
     * Set input fields value on change
     * @param e is the sender of the event
     */
    function onFormValueChanged(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

        // Set the form name and value by destructuring
        const { name, value, checked } = e.target as HTMLInputElement;

        // Set the flag indicating if type is checkbox
        const isCheck = e.target.type === 'checkbox';

        ticketPricings?.forEach((ticketPricing) => {

            // If the ticket pricing email is the current primary email...
            if (primaryEmail == formValues[`${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`]) {
                unsetPrimaryEmail();
            }

            // If a ticket pricing was changed...
            if (name !== `${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`) {
                return;
            }

            if (value.length == 0) {
                // Update the form value
                setFormValues({ ...formValues, [name]: isCheck ? checked : value });
                // Update the ticket pricing hasEmail property
                ticketPricing.hasEmail = false;
                return;
            }
            if (value.length > 0 && !emailRegex.test(value)) {
                ticketPricing.hasEmail = false;
                // Update the form value
                setFormValues({ ...formValues, [name]: isCheck ? checked : value });
                return;
            }
            if (value.length > 0 && emailRegex.test(value)) {
                ticketPricing.hasEmail = true;
                // Update the form value
                setFormValues({ ...formValues, [name]: isCheck ? checked : value });
                return;
            }
        });

    };

    const validCoupons = ['SMARTFUS34', 'DE2CCERO03', 'LKJNDUipl3', 'uIMLP34NpY', 'Simlex'];

    function checkCoupon() {
        if (couponCodeValue === undefined || couponCodeValue.length < 1) {
            return;
        }

        if (couponCodeValue?.length > 4) {
            setIsValidating(true);

            setTimeout(() => {
                // if (validCoupons.find((anyCouponCode) => anyCouponCode == couponCodeValue)) {
                if (validCoupons.includes(couponCodeValue as string)) {
                    setCodeValidationStatus(ValidationStatus.Valid);
                    setIsValidating(false);
                } else {
                    setCodeValidationStatus(ValidationStatus.Invalid);
                    setIsValidating(false);
                }
            }, 3000);
        }
    };

    /**
     * Function to get the email input's name for each selected ticket
     * @param ticketType is the ticket's type
     * @param selectedTickets is the number of selected tickets
     * @param emailId is the email Id of the ticket pricing
     * @returns the formatted string
     */
    function getInputName(ticketType: string, selectedTickets: number, emailId: number) {
        return `${ticketType.replace(/\s+/g, '_').toLowerCase()}${selectedTickets > 1 ? emailId : ''}`
    }

    useEffect(() => {
        if (couponCodeValue && couponCodeValue?.length > 4) {
            setCanCodeBeValidated(true);
        } else {
            setCanCodeBeValidated(false);
        }
    }, [couponCodeValue]);

    useEffect(() => {
        if (visibility && eventTickets?.find((ticket) => ticket.selectedTickets > 0)) {
            getSelectedTickets();
        }
    }, [eventTickets, visibility]);

    // useEffect(() => {
    //     ticketPricings.map((ticketPricing) => {
    //         console.log(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]);
    //         console.log(primaryEmail);

    //         if (primaryEmail == formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]) {
    //             console.log(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]?.length)
    //             if (formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]?.length == 0) {
    //                 console.log('value changed!');
    //                 unsetPrimaryEmail()
    //             }
    //         }
    //     })
    // }, [formValues, ticketPricings]);

    useEffect(() => {
        ticketPricings.map((ticketPricing) => {
            const previousEmail = formValues[`${ticketPricing.ticketType}${ticketPricing.emailId}`];
            // console.log({ previousEmail });
            // console.log(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`]);
            // console.log({ primaryEmail });

            if (previousEmail !== undefined && previousEmail === primaryEmail) {
                if (previousEmail.length === 0 || '') {
                    console.log('Email value changed!');
                    unsetPrimaryEmail();
                }
            }
        })
    }, [formValues, ticketPricings, primaryEmail]);

    useEffect(() => {
        if (primaryEmail) {
            setUserEmailIsPrimaryEmail(false);
        } else if (userInfo) {
            setUserEmailIsPrimaryEmail(true);
        }
    }, [primaryEmail])

    return (
        <>
            {onDesktop &&
                <>
                    <ModalWrapper disallowOverlayFunction visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff' }}>
                        <div className={appTheme === Theme.Light ? styles.ticketDeliveryContainerLightTheme : styles.ticketDeliveryContainer}>
                            <div className={styles.lhs}>
                                <div className={styles.top}>
                                    <h3>Ticket Delivery Details</h3>
                                    <p>Enter the email addresses of all attendees. <br />Each ticket will be sent to the respective email addresses provided.</p>
                                    <span>Note: All tickets will also be sent to the selected primary email.</span>
                                </div>
                                {
                                    userInfo &&
                                    <div className={styles.toggleSection}>
                                        <p>Use My Email as Primary Email</p>
                                        <Toggler
                                            mainColor='77b255'
                                            disabledColor='dadada'
                                            togglerIndicatorColor='ffffff'
                                            setCheckboxValue={setUserEmailIsPrimaryEmail}
                                            checkboxValue={userEmailIsPrimaryEmail} />
                                    </div>
                                }
                                <div className={styles.ticketsEmailForms}>
                                    {
                                        ticketPricings.map((ticketPricing, index) =>
                                            <div className={styles.ticketFormFieldContainer} key={index}>
                                                <label htmlFor={`${ticketPricing.ticketType}${ticketPricing.ticketId}`}>
                                                    {ticketPricing.selectedTickets > 1 && convertNumberToText(ticketPricing.emailId)}&nbsp;
                                                    <span className={styles.ticketType}>{ticketPricing.ticketType}</span> ticket
                                                </label>
                                                <input
                                                    tabIndex={1}
                                                    type="text"
                                                    placeholder="Enter email"
                                                    name={getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)}
                                                    onChange={onFormValueChanged} />
                                                <div className={styles.ticketFormFieldContainer__selectionArea}>
                                                    {/* {!primaryEmail &&
                                        <button onClick={() => updatePrimaryEmail(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`])}>
                                            Set as primary email
                                        </button>} */}
                                                    {primaryEmail && primaryEmail == formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)] &&
                                                        <div className={styles.selectedEmail}>
                                                            <button>Selected as primary email</button>
                                                            <span onClick={unsetPrimaryEmail}>Remove</span>
                                                        </div>}
                                                    {!primaryEmail && <button onClick={() => updatePrimaryEmail(formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)])}>
                                                        Set as primary email
                                                    </button>}
                                                </div>
                                                {!primaryEmail && <>
                                                    {showErrorMessages && !ticketPricing.hasEmail && <span className={styles.errorMsg}>Input correct email</span>}
                                                </>}
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={styles.ticketCouponArea}>
                                    <label htmlFor="coupon">Do you have any coupon code?</label>
                                    <div className={styles.ticketCouponInputFieldContainer}>
                                        <div className={styles.inputContainer}>
                                            <input
                                                tabIndex={1}
                                                type="text"
                                                id="coupon"
                                                value={couponCodeValue}
                                                maxLength={10}
                                                onChange={(e) => {
                                                    setCouponCodeValue(e.target.value.trim())
                                                    setCodeValidationStatus(ValidationStatus.NotInitiated)
                                                }} placeholder="Enter coupon code" />
                                            <button className={canCodeBeValidated ? styles.active : ''} style={isValidating ? { opacity: 0.5, pointerEvents: 'none', backgroundColor: '#111111' } : {}} onClick={() => checkCoupon()}>{isValidating ? 'Checking...' : 'Apply'}</button>
                                        </div>
                                        {codeValidationStatus === ValidationStatus.Valid && <span id={styles.valid}><CheckIcon /> Valid code</span>}
                                        {codeValidationStatus === ValidationStatus.Invalid && <span id={styles.invalid}><CloseIcon /> Invalid code. Please verify code, and try again</span>}
                                    </div>
                                </div>
                                <div className={styles.bottomArea}>
                                    <p>{ticketPricings.length} {ticketPricings.length > 1 ? 'tickets' : 'ticket'} selected</p>
                                    <span>
                                        <span>Total Price</span>
                                        <span className={styles.amount}>&#8358;<span>{totalPrice?.toLocaleString()}</span></span>
                                    </span>
                                </div>
                            </div>
                            <OrderSummarySection
                                eventTickets={eventTickets}
                                totalPrice={totalPrice}
                                setVisibility={setVisibility}
                                handleTicketOrderCreation={handleTicketOrderCreation}
                                isProcessingOrder={isProcessingOrder}
                                eventInfo={eventInfo}
                            />
                        </div>
                    </ModalWrapper>
                </>
            }
            {
                onMobile &&
                <PanelWrapper
                    visibility={visibility}
                    setVisibility={setVisibility}
                    styles={
                        {
                            height: '100%',
                            top: '0',
                            borderRadius: '0',
                            paddingTop: '48px',
                            paddingBottom: '72px',
                            position: 'fixed',
                            width: '100%'
                        }}>
                    <div className={styles.ticketDeliveryContainer}>
                        <div className={styles.lhs}>
                            <div className={styles.top}>
                                <h3>Ticket Delivery Details</h3>
                                <p>Enter the email addresses of all attendees. <br />Each ticket will be sent to the respective email addresses provided.</p>
                                <span>Note: All tickets will also be sent to the selected primary email.</span>
                            </div>
                            {
                                userInfo &&
                                <div className={styles.toggleSection}>
                                    <p>Use My Email as Primary Email</p>
                                    <Toggler
                                        mainColor='77b255'
                                        disabledColor='dadada'
                                        togglerIndicatorColor='ffffff'
                                        setCheckboxValue={setUserEmailIsPrimaryEmail}
                                        checkboxValue={userEmailIsPrimaryEmail} />
                                </div>
                            }
                            <div className={styles.ticketsEmailForms}>
                                {ticketPricings.map((ticketPricing, index) =>
                                    <div className={styles.ticketFormFieldContainer} key={index}>
                                        <label htmlFor={`${ticketPricing.ticketType}${ticketPricing.ticketId}`}>
                                            {ticketPricing.selectedTickets > 1 && convertNumberToText(ticketPricing.emailId)}&nbsp;
                                            <span className={styles.ticketType}>{ticketPricing.ticketType}</span> ticket
                                        </label>
                                        <input
                                            type="text"
                                            // tabIndex={1}
                                            placeholder="Enter email"
                                            name={getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)}
                                            onChange={onFormValueChanged} />
                                        <div className={styles.ticketFormFieldContainer__selectionArea}>
                                            {primaryEmail && primaryEmail == formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)] &&
                                                <div className={styles.selectedEmail}>
                                                    <button>Selected as primary email</button>
                                                    <span onClick={unsetPrimaryEmail}>Remove</span>
                                                </div>}
                                            {!primaryEmail && <button onClick={() => updatePrimaryEmail(formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)])}>
                                                Set as primary email
                                            </button>}
                                        </div>
                                        {!primaryEmail && <>
                                            {showErrorMessages && !ticketPricing.hasEmail && <span className={styles.errorMsg}>Input correct email</span>}
                                        </>}
                                    </div>
                                )}
                            </div>
                            <div className={styles.ticketCouponArea}>
                                <label htmlFor="coupon">Do you have any coupon code?</label>
                                <div className={styles.ticketCouponInputFieldContainer}>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="coupon"
                                            value={couponCodeValue}
                                            maxLength={10}
                                            onChange={(e) => {
                                                setCouponCodeValue(e.target.value.trim())
                                                setCodeValidationStatus(ValidationStatus.NotInitiated)
                                            }} placeholder="Enter coupon code" />
                                        <button className={canCodeBeValidated ? styles.active : ''} style={isValidating ? { opacity: 0.5, pointerEvents: 'none', backgroundColor: '#111111' } : {}} onClick={() => checkCoupon()}>{isValidating ? 'Checking...' : 'Apply'}</button>
                                    </div>
                                    {codeValidationStatus === ValidationStatus.Valid && <span id={styles.valid}><CheckIcon /> Valid code</span>}
                                    {codeValidationStatus === ValidationStatus.Invalid && <span id={styles.invalid}><CloseIcon /> Invalid code. Please verify code, and try again</span>}
                                </div>
                            </div>
                            <div className={styles.viewOrderSummaryBtn}>
                                {orderSummaryVisible ? <button onClick={() => setOrderSummaryVisible(false)}>Close Order Summary</button> :
                                    <button onClick={() => setOrderSummaryVisible(true)}>View Order Summary</button>}
                            </div>
                        </div>
                        <div className={styles.rhs}>
                            {
                                onMobile && orderSummaryVisible &&
                                <MobileOrderSummarySection
                                    eventInfo={eventInfo}
                                    eventTickets={eventTickets}
                                    totalPrice={totalPrice}
                                />
                            }
                            <div className={styles.actionButtons}>
                                <button onClick={() => setVisibility(false)}>Cancel</button>
                                <button onClick={() => handleTicketOrderCreation()} disabled={isProcessingOrder} tabIndex={1}>
                                    Pay now
                                    {isProcessingOrder && <ComponentLoader isSmallLoader customBackground="#fff" customLoaderColor="#111111" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </PanelWrapper>
            }

            {
                emailVerificationPromptIsVisible &&
                <EmailVerificationPrompt
                    visibility={emailVerificationPromptIsVisible}
                    setVisibility={setEmailVerificationPromptIsVisible}
                    userEmail={userInfo?.email as string}
                    userName={userInfo?.firstName as string}
                />
            }
        </>
    );
}

export default TicketDelivery;