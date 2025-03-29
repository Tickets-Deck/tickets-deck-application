import { FunctionComponent, ReactElement, useState, Dispatch, SetStateAction, useEffect, ChangeEvent, useMemo } from "react";
import styles from "../../styles/TicketDelivery.module.scss";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import { RetrievedITicketPricing } from "../../models/ITicketPricing";
import { emailRegex } from "../../constants/emailRegex";
import PanelWrapper from "./PanelWrapper";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";
import OrderSummarySection from "../TicketDelivery/OrderSummarySection";
import useResponsiveness from "../../hooks/useResponsiveness";
import { useInitializeTicketOrder, useInitializePaystackPayment, useVerifyCouponCode } from "@/app/api/apiClient";
import { SingleTicketOrderRequest, TicketOrderRequest } from "@/app/models/ITicketOrder";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Toggler from "../custom/Toggler";
import ComponentLoader from "../Loader/ComponentLoader";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import { Theme } from "@/app/enums/Theme";
import PrimaryEmailConfirmationModal from "./PrimaryEmailConfirmationModal";
import { CustomerContactDetails } from "@/app/models/IUser";
import { CouponDetails } from "@/app/models/ICoupon";
import { ApplicationError } from "@/app/constants/applicationError";
import { StorageKeys } from "@/app/constants/storageKeys";
import { useToast } from "@/app/context/ToastCardContext";

interface TicketDeliveryProps {
    appTheme: Theme | null
    setVisibility: Dispatch<SetStateAction<boolean>>
    visibility: boolean
    eventTickets: RetrievedTicketResponse[] | undefined
    eventInfo: EventResponse | undefined
    totalPrice: number
    contactDetails: CustomerContactDetails | undefined
    isEmailVerified: boolean | undefined
}

enum ValidationStatus {
    Valid = 0,
    Invalid = 1,
    NotInitiated = 2,
}

const TicketDelivery: FunctionComponent<TicketDeliveryProps> = (
    { appTheme, visibility, setVisibility, eventTickets,
        eventInfo, totalPrice, contactDetails, isEmailVerified }): ReactElement => {

    const createTicketOrder = useInitializeTicketOrder();
    const initializePaystackPayment = useInitializePaystackPayment();
    const verifyCoupon = useVerifyCouponCode();
    const toastHandler = useToast();

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const userInfo = useSelector((state: RootState) => state.userCredentials.userInfo);

    const [ticketPricings, setTicketPricings] = useState<RetrievedITicketPricing[]>([]);
    const [emailVerificationPromptIsVisible, setEmailVerificationPromptIsVisible] = useState(false);
    const [suggestPrimaryEmailModal, setSuggestPrimaryEmailModal] = useState(false);
    const [suggestedPrimaryEmail, setSuggestedPrimaryEmail] = useState<string>('');
    const [autoTriggerTicketOrderCreation, setAutoTriggerTicketOrderCreation] = useState(false);

    const [isValidating, setIsValidating] = useState(false);
    const [canCodeBeValidated, setCanCodeBeValidated] = useState(false);
    const [codeValidationStatus, setCodeValidationStatus] = useState<ValidationStatus>(ValidationStatus.NotInitiated);
    const [couponCodeValue, setCouponCodeValue] = useState<string>();
    const [couponDetails, setCouponDetails] = useState<CouponDetails>();
    const [organizerAmount, setOrganizerAmount] = useState<number>();

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

        // If there are no event tickets, stop the execution
        if (!eventTickets) {
            return;
        }

        // For each ticket, if it is selected, add it to the selected tickets
        for (const ticket of eventTickets) {
            if (ticket.isSelected && ticket.selectedTickets > 0) {

                const ticketPrice = ticket.price * ticket.selectedTickets;
                totalPrice += ticketPrice;

                for (let i = 0; i < ticket.selectedTickets; i++) {
                    selectedTickets.push({
                        emailId: emailIndex,
                        ticketId: ticket.id,
                        ticketType: ticket.name,
                        selectedTickets: ticket.selectedTickets,
                        price: {
                            currency: eventInfo?.currency || 'NGN',
                            total: ticket.price.toString(),
                        },
                        hasEmail: userInfo ? primaryEmail || userEmailIsPrimaryEmail ? true : false : false,
                    });
                    emailIndex++;
                }
            }
        }

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

    /**
     * Function to get the formatted form value
     * @param ticketPricing is the ticket pricing object
     * @returns the formatted form value
     */
    const formattedFormValue = (ticketPricing: RetrievedITicketPricing): string =>
        formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)];

    function validateFields() {

        // Find the ticket pricing with an email
        ticketPricings.find((ticketPricing) => ticketPricing.hasEmail);

        // Validate the fields
        for (const ticketPricing of ticketPricings) {
            const formattedValue = formattedFormValue(ticketPricing);

            // If the formatted value is empty, skip the iteration
            if (!formattedValue) {
                continue;
            }

            // If the formatted value is not an email...
            if (formattedValue.length > 0 && !emailRegex.test(formattedValue)) {
                ticketPricing.hasEmail = false;
                setShowErrorMessages(true);
            }
        }

        // If all fields are valid...
        const allFieldsAreValid = ticketPricings.every(ticketPricing => formattedFormValue(ticketPricing) && formattedFormValue(ticketPricing).length > 0 ? emailRegex.test(formattedFormValue(ticketPricing)) : true);

        if (allFieldsAreValid) {
            // Hide error messages
            setShowErrorMessages(false);
        }

        return allFieldsAreValid;
    };

    /**
     * Function to handle ticket order creation
     */
    async function handleTicketOrderCreation() {

        // Validate the fields
        if (!validateFields()) {
            return;
        }

        const collatedTicketOrderRequests: SingleTicketOrderRequest[] = ticketPricings.map((ticketPricing) => {

            return {
                ticketId: ticketPricing.ticketId,
                price: parseInt(ticketPricing.price.total),
                associatedEmail: formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)]?.toLocaleLowerCase(),
                contactEmail: primaryEmail ?? (userEmailIsPrimaryEmail ? userInfo?.email as string : ""),
            }
        });

        // if the user is not logged in, and has not filled in any email, show the suggest primary email modal
        if (!userInfo && collatedTicketOrderRequests.every(ticketOrder => !ticketOrder.associatedEmail)) {
            toastHandler.logError("Email address not filled", "Please input an email address for at least one ticket.");
            return;
        }

        // if we get here, it means the user is logged in, and has not filled in any email or the user is not logged in, and has filled in at least one email

        const ticketOrder: TicketOrderRequest = {
            eventId: eventInfo?.id as string,
            tickets: collatedTicketOrderRequests,
            contactEmail: primaryEmail ?? (userEmailIsPrimaryEmail ? userInfo?.email as string : ""),
            userId: userInfo?.id as string,
            contactFirstName: contactDetails?.firstName,
            contactLastName: contactDetails?.lastName,
            contactPhone: contactDetails?.phone,
            couponCode: couponCodeValue,
        };

        // if the contact email is not filled in...
        if (ticketOrder.contactEmail === undefined || ticketOrder.contactEmail.length < 1) {
            // get the first ticket order with an email
            const firstTicketOrderWithEmail = collatedTicketOrderRequests.find(ticketOrder => ticketOrder.associatedEmail);
            setSuggestedPrimaryEmail(firstTicketOrderWithEmail?.associatedEmail as string);
            setSuggestPrimaryEmailModal(true);
            return;
        }

        // If the user's email is not verified, show the email verification prompt
        // if (userInfo && !isEmailVerified) {
        //     if (!emailVerificationPromptIsVisible) {
        //         setEmailVerificationPromptIsVisible(true);
        //     }
        //     return;
        // }

        try {
            // Start processing order
            setIsProcessingOrder(true);

            // Create the ticket order
            const response = await createTicketOrder(ticketOrder);

            // If the total price is zero, route to the order page
            if (totalPrice === 0) {

                if (response) {
                    // Stop processing order
                    setIsProcessingOrder(false);

                    // Show success message
                    toastHandler.logSuccess("Success", "Order successfully processed. You will receive your tickets shortly.");

                    // Hide the modal
                    setVisibility(false);

                    // Route to the order page
                    if (response.data.id) {
                        window.location.href = `${window.location.origin}/order/${response.data.id}`
                    }
                }
                return;
            }

            // at this point, we will update the ticket order 

            // If we get here, it means the total price is not zero
            if (response) {
                // Initialize payment
                const paymentInit = await initializePaystackPayment(
                    {
                        ticketOrderId: response.data.id,
                        callbackUrl: `${window.location.origin}/verify-payment`,
                        socketId: localStorage.getItem(StorageKeys.ClientSessionWS) as string,
                        organizerAmount: organizerAmount as number
                    });

                if (paymentInit) {
                    // Route to the payment authorization URL
                    window.location.href = paymentInit.data.authorization_url;
                }
            }
        }
        catch (error: any) {
            // Stop processing order
            setIsProcessingOrder(false);
            if (error?.response) {
                if (error.response.data.errorCode == ApplicationError.PaymentInitializationFailed.Code) {
                    toastHandler.logError("We could not begin your transaction", "Please check your internet connection and try again.");
                    return;
                }
                if (error.response.data.errorCode == ApplicationError.InvalidCouponExpirationDate.Code) {
                    toastHandler.logError("Error", "This coupon code has expired. Please get a new code, and try again");
                    return;
                }
                if (error.response.data.errorCode == ApplicationError.InvalidCouponDiscount.Code) {
                    toastHandler.logError("Error", "Invalid coupon code. Please confirm code, and try again");
                    return;
                }
            }
            // Show error message
            toastHandler.logError("Error", "An error occurred while processing your order. Please try again.");
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
            setPrimaryEmail(email.toLocaleLowerCase());
            return;
        }
    };

    /**
     * Function to set the primary email based on suggestion and trigger order creation
     */
    function suggestedPrimaryEmailAndCreateOrder(email: string) {
        setPrimaryEmail(email?.toLocaleLowerCase());
        setAutoTriggerTicketOrderCreation(true);
        setSuggestPrimaryEmailModal(false);
    };

    /**
     * Function to unset primary email
     * @param email is the selected email
     */
    function resetPrimaryEmail() {
        // Unset the primary email
        setPrimaryEmail(undefined);
        // If userinfo is available, set the user email as primary email
        if (userInfo) {
            setUserEmailIsPrimaryEmail(true);
        }
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

        // Using the name, find the corresponding ticketPricing
        const ticketPricing = ticketPricings.find((ticketPricing) => ticketPricing.emailId == getTicketEmailIdFromName(name));

        // If the ticket pricing is not found, stop the execution  
        if (!ticketPricing) {
            return;
        }

        // If the ticket pricing email is the current primary email...
        if (primaryEmail == value) {
            resetPrimaryEmail();
        }

        // // If the field is empty...
        // if (value.length == 0) {
        //     setFormValues({ ...formValues, [name]: isCheck ? checked : value });
        //     return;
        // } 
        ticketPricing.hasEmail = true;

        // Update the form value
        setFormValues({ ...formValues, [name]: isCheck ? checked : value });
    };

    async function handleCheckCoupon() {
        // show loader
        setIsValidating(true);

        // reset coupon details
        setCouponDetails(undefined);

        // check coupon code
        await verifyCoupon(eventInfo?.eventId as string, couponCodeValue as string)
            .then((response) => {
                if (response.data) {
                    setCouponDetails(response.data);
                    // setCodeValidationStatus(ValidationStatus.Valid);
                    toastHandler.logSuccess("Success", "Coupon code applied successfully");
                } else {
                    // setCodeValidationStatus(ValidationStatus.Invalid);
                    toastHandler.logError("Error", "Invalid coupon code. Please confirm code, and try again");
                }
            })
            .catch((error) => {
                if (error.response.data.errorCode == ApplicationError.InvalidCouponExpirationDate.Code) {
                    toastHandler.logError("Error", "This coupon code has expired. Please get a new code, and try again");
                    return;
                }
                // setCodeValidationStatus(ValidationStatus.Invalid);
                toastHandler.logError("Error", "Invalid coupon code. Please confirm code, and try again");
            })
            .finally(() => {
                setIsValidating(false);
            });
    }

    /**
     * Function to get the email input's name for each selected ticket
     * @param ticketType is the ticket's type
     * @param selectedTickets is the number of selected tickets
     * @param emailId is the email Id of the ticket pricing
     * @returns the formatted string
     */
    function getInputName(ticketType: string, selectedTickets: number, emailId: number) {
        return `${ticketType.replace(/\s+/g, '_').toLowerCase()}_${emailId}`
    };

    /**
     * Function to get the selected ticket's email id from the ticket's name
     * @param name is the name of the ticket
     * @returns the email id of the ticket
     */
    function getTicketEmailIdFromName(name: string): number {
        // return Number(name.split(/(\d+)/).filter(Boolean)[1]);

        const numbers = name.match(/\d+/g); // Find all numbers in the string
        const lastNumber = numbers ? numbers[numbers.length - 1] : null; // Get the last number
        return Number(lastNumber);
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

    useEffect(() => {
        // Find the ticket pricing which is the primary email
        const selectedPrimaryEmail = ticketPricings.find((ticketPricing) => ticketPricing.hasEmail && formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)] === primaryEmail);

        // If the selected primary email is not found, reset the primary email
        if (!selectedPrimaryEmail) {
            resetPrimaryEmail();
        }

    }, [formValues, ticketPricings, primaryEmail]);

    useEffect(() => {
        if (primaryEmail) {
            setUserEmailIsPrimaryEmail(false);
        } else if (userInfo) {
            setUserEmailIsPrimaryEmail(true);
        }
    }, [primaryEmail]);

    useMemo(() => userEmailIsPrimaryEmail && setPrimaryEmail(undefined), [userEmailIsPrimaryEmail]);

    // run the ticket order creation function when the autoTriggerTicketOrderCreation state is set to true
    useEffect(() => {
        if (autoTriggerTicketOrderCreation) {
            handleTicketOrderCreation();
            setAutoTriggerTicketOrderCreation(false);
        }
    }, [autoTriggerTicketOrderCreation]);

    return (
        <>
            {onDesktop &&
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
                                        // mainColor='77b255'
                                        // disabledColor='dadada'
                                        // togglerIndicatorColor='ffffff'
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
                                                        <span onClick={resetPrimaryEmail}>Remove</span>
                                                    </div>}
                                                {
                                                    !primaryEmail &&
                                                    <button onClick={() => updatePrimaryEmail(formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)])}>
                                                        Set as primary email
                                                    </button>
                                                }
                                            </div>
                                            {
                                                (!primaryEmail || !userEmailIsPrimaryEmail) && <>
                                                    {showErrorMessages && !ticketPricing.hasEmail && <span className={styles.errorMsg}>Input correct email</span>}
                                                </>
                                            }
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
                                            name="couponCode"
                                            id="coupon"
                                            value={couponCodeValue}
                                            maxLength={10}
                                            onChange={(e) => {
                                                setCouponCodeValue(e.target.value.trim())
                                                setCouponDetails(undefined)
                                                setCodeValidationStatus(ValidationStatus.NotInitiated)
                                            }} placeholder="Enter coupon code" />
                                        <button className={canCodeBeValidated ? styles.active : ''} style={isValidating ? { opacity: 0.5, pointerEvents: 'none', backgroundColor: '#111111' } : {}} onClick={() => handleCheckCoupon()}>{isValidating ? 'Checking...' : 'Apply'}</button>
                                    </div>
                                    {codeValidationStatus === ValidationStatus.Valid && <span id={styles.valid}><Icons.Check /> Valid code</span>}
                                    {codeValidationStatus === ValidationStatus.Invalid && <span id={styles.invalid}><Icons.Close /> Invalid code. Please verify code, and try again</span>}
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
                            couponDetails={couponDetails}
                            setOrganizerAmount={setOrganizerAmount}
                        />
                    </div>
                </ModalWrapper>
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
                                        // mainColor='77b255'
                                        // disabledColor='dadada'
                                        // togglerIndicatorColor='ffffff'
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
                                                    <span onClick={resetPrimaryEmail}>Remove</span>
                                                </div>}
                                            {!primaryEmail && <button onClick={() => updatePrimaryEmail(formValues[getInputName(ticketPricing.ticketType, ticketPricing.selectedTickets, ticketPricing.emailId)])}>
                                                Set as primary email
                                            </button>}
                                        </div>
                                        {(!primaryEmail || !userEmailIsPrimaryEmail) && <>
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
                                            name="couponCode"
                                            value={couponCodeValue}
                                            maxLength={10}
                                            onChange={(e) => {
                                                setCouponCodeValue(e.target.value.trim())
                                                setCouponDetails(undefined)
                                                setCodeValidationStatus(ValidationStatus.NotInitiated)
                                            }} placeholder="Enter coupon code" />
                                        <button className={canCodeBeValidated ? styles.active : ''} style={isValidating ? { opacity: 0.5, pointerEvents: 'none', backgroundColor: '#111111' } : {}} onClick={() => handleCheckCoupon()}>{isValidating ? 'Checking...' : 'Apply'}</button>
                                    </div>
                                    {codeValidationStatus === ValidationStatus.Valid && <span id={styles.valid}><Icons.Check /> Valid code</span>}
                                    {codeValidationStatus === ValidationStatus.Invalid && <span id={styles.invalid}><Icons.Close /> Invalid code. Please verify code, and try again</span>}
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
                                <OrderSummarySection
                                    eventTickets={eventTickets}
                                    totalPrice={totalPrice}
                                    setVisibility={setVisibility}
                                    handleTicketOrderCreation={handleTicketOrderCreation}
                                    isProcessingOrder={isProcessingOrder}
                                    eventInfo={eventInfo}
                                    couponDetails={couponDetails}
                                    setOrganizerAmount={setOrganizerAmount}
                                    hideActionButtons={true}
                                />
                                // <MobileOrderSummarySection
                                //     eventInfo={eventInfo}
                                //     eventTickets={eventTickets}
                                //     totalPrice={totalPrice}
                                //     couponDetails={couponDetails}
                                //     setOrganizerAmount={setOrganizerAmount}
                                // />
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
                    userId={userInfo?.id as string}
                />
            }
            <PrimaryEmailConfirmationModal
                visibility={suggestPrimaryEmailModal}
                setVisibility={setSuggestPrimaryEmailModal}
                // email={ticketPricings[0]?.hasEmail ? formValues[getInputName(ticketPricings[0].ticketType, ticketPricings[0].selectedTickets, ticketPricings[0].emailId)] : ''}
                // email={
                //     formValues[getInputName(ticketPricings.find((ticketPricing) => ticketPricing.hasEmail)?.ticketType as string, 
                //         ticketPricings.find((ticketPricing) => ticketPricing.hasEmail)?.selectedTickets as number, 
                //         ticketPricings.find((ticketPricing) => ticketPricing.hasEmail)?.emailId as number)]
                // }
                email={suggestedPrimaryEmail}
                suggestedPrimaryEmailAndCreateOrder={suggestedPrimaryEmailAndCreateOrder}
            />
        </>
    );
}

export default TicketDelivery;