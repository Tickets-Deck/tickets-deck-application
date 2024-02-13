import { ToastContext } from "../../extensions/toast";
import { FunctionComponent, ReactElement, useState, useContext, Dispatch, SetStateAction, useEffect, ChangeEvent } from "react";
import styles from "../../styles/TicketDelivery.module.scss";
import ModalWrapper from "./ModalWrapper";
import Image from "next/image";
import images from "../../../public/images";
import { CheckIcon, CloseIcon } from "../SVGs/SVGicons";
import { ITicketPricing, RetrievedITicketPricing } from "../../models/ITicketPricing";
import { emailRegex } from "../../constants/emailRegex";
import PanelWrapper from "./PanelWrapper";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";
import OrderSummarySection from "../TicketDelivery/OrderSummarySection";
import useResponsiveness from "../../hooks/useResponsiveness";
import { useCreateTicketOrder, useInitializePaystackPayment } from "@/app/api/apiClient";
import { SingleTicketOrderRequest, TicketOrderRequest } from "@/app/models/ITicketOrder";
import { useSelector } from "react-redux";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface TicketDeliveryProps {
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
    { visibility, setVisibility, eventTickets, eventInfo, totalPrice }): ReactElement => {

    const createTicketOrder = useCreateTicketOrder();
    const initializePaystackPayment = useInitializePaystackPayment();

    const toastHandler = useContext(ToastContext);

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    // useEffect(() => {
    //     console.log(eventTickets);
    // }, [eventTickets]);

    const userInformation = useSelector((state: UserCredentialsResponse) => state);

    const [ticketPricings, setTicketPricings] = useState<RetrievedITicketPricing[]>([]);
    // const [ticketsTotalPrice, setTicketsTotalPrice] = useState<number>(0);

    const [isValidating, setIsValidating] = useState(false);
    const [canCodeBeValidated, setCanCodeBeValidated] = useState(false);
    const [codeValidationStatus, setCodeValidationStatus] = useState<ValidationStatus>(ValidationStatus.NotInitiated);
    const [couponCodeValue, setCouponCodeValue] = useState<string>();

    const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);

    const [showErrorMessages, setShowErrorMessages] = useState(false);

    const [primaryEmail, setPrimaryEmail] = useState<string>();

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

        validateFields();

        const collatedTicketOrderRequests: SingleTicketOrderRequest[] = ticketPricings.map((ticketPricing) => {
            console.log(ticketPricing.ticketType, ticketPricing.emailId);
            return {
                ticketId: ticketPricing.ticketId,
                price: parseInt(ticketPricing.price.total),
                associatedEmail: formValues[`${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`],
                contactEmail: primaryEmail ?? userInformation.email,
            }
        });

        const ticketOrder: TicketOrderRequest = {
            eventId: eventInfo?.eventId as string,
            tickets: collatedTicketOrderRequests,
            contactEmail: primaryEmail ?? userInformation.email,
            userId: 'rndomUserId',
        };

        console.log({ ticketOrder });

        try {
            // Start processing order
            setIsProcessingOrder(true);

            const response = await createTicketOrder(ticketOrder);

            console.log("Ticket order response: ", response);

            if (response) {
                const paymentInit = await initializePaystackPayment({ ticketOrderId: response.data.id, callbackUrl: `${window.location.origin}/verify-payment` });

                console.log({ paymentInit });

                if (paymentInit) {
                    window.location.href = paymentInit.data.data.authorization_url;
                }
            }
        } catch (error) {
            // Stop processing order
            setIsProcessingOrder(false);
            // Log the error
            console.log("Error creating ticket order: ", error);
        }
    }

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
    }

    /**
     * Function to unset primary email
     * @param email is the selected email
     */
    function unsetPrimaryEmail() {
        setPrimaryEmail(undefined);
    }

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

    return (
        <>
            {onDesktop &&
                <ModalWrapper disallowOverlayFunction visibility={visibility} setVisibility={setVisibility} styles={{ backgroundColor: 'transparent', color: '#fff' }}>
                    <div className={styles.ticketDeliveryContainer}>
                        <div className={styles.lhs}>
                            <div className={styles.top}>
                                <h3>Ticket Delivery Details</h3>
                                <p>Enter the email addresses of all attendees. <br />Each ticket will be sent to the respective email addresses provided.</p>
                                <span>Note: All tickets will also be sent to the selected primary email.</span>
                            </div>
                            <div className={styles.ticketsEmailForms}>
                                {
                                    ticketPricings.map((ticketPricing, index) =>
                                        <div className={styles.ticketFormFieldContainer} key={index}>
                                            <label htmlFor={`${ticketPricing.ticketType}${ticketPricing.ticketId}`}>
                                                {ticketPricing.selectedTickets > 1 && convertNumberToText(ticketPricing.emailId)}&nbsp;
                                                <span className={styles.ticketType}>{ticketPricing.ticketType}</span> ticket
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter email"
                                                name={`${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`}
                                                onChange={onFormValueChanged} />
                                            <div className={styles.ticketFormFieldContainer__selectionArea}>
                                                {/* {!primaryEmail &&
                                        <button onClick={() => updatePrimaryEmail(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`])}>
                                            Set as primary email
                                        </button>} */}
                                                {primaryEmail && primaryEmail == formValues[`${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`] &&
                                                    <div className={styles.selectedEmail}>
                                                        <button>Selected as primary email</button>
                                                        <span onClick={unsetPrimaryEmail}>Remove</span>
                                                    </div>}
                                                {!primaryEmail && <button onClick={() => updatePrimaryEmail(formValues[`${ticketPricing.ticketType.replace(/\s+/g, '_').toLowerCase()}${ticketPricing.selectedTickets > 1 ? ticketPricing.emailId : ''}`])}>
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
                                        <input type="text" value={couponCodeValue} maxLength={10}
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
                                <p>{ticketPricings.length} tickets selected</p>
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
                        {/* <button><CloseIcon /> Close</button> */}
                        <div className={styles.lhs}>
                            <div className={styles.top}>
                                <h3>Ticket Delivery Details</h3>
                                <p>Enter the email addresses of all attendees. <br />Each ticket will be sent to the respective email addresses provided.</p>
                                <span>Note: All tickets will also be sent to the selected primary email.</span>
                            </div>
                            <div className={styles.ticketsEmailForms}>
                                {ticketPricings.map((ticketPricing, index) =>
                                    <div className={styles.ticketFormFieldContainer} key={index}>
                                        <label htmlFor={`${ticketPricing.ticketType}${ticketPricing.ticketId}`}>{convertNumberToText(parseInt(ticketPricing.ticketId))} <span className={styles.ticketType}>{ticketPricing.ticketType}</span> ticket</label>
                                        <input
                                            type="text"
                                            placeholder="Enter email"
                                            name={`${ticketPricing.ticketType}${ticketPricing.ticketId}`}
                                            onChange={onFormValueChanged} />
                                        <div className={styles.ticketFormFieldContainer__selectionArea}>
                                            {/* {!primaryEmail &&
                                        <button onClick={() => updatePrimaryEmail(formValues[`${ticketPricing.ticketType}${ticketPricing.ticketId}`])}>
                                            Set as primary email
                                        </button>} */}
                                            {primaryEmail && primaryEmail == formValues[`${ticketPricing.ticketType}${ticketPricing.emailId}`] &&
                                                <div className={styles.selectedEmail}>
                                                    <button>Selected as primary email</button>
                                                    <span onClick={unsetPrimaryEmail}>Remove</span>
                                                </div>}
                                            {!primaryEmail && <button onClick={() => updatePrimaryEmail(formValues[`${ticketPricing.ticketType}${ticketPricing.emailId}`])}>
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
                                        <input type="text" value={couponCodeValue} maxLength={10}
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
                            {onMobile && orderSummaryVisible &&
                                <>
                                    <div className={styles.eventImage}>
                                        <Image src={images.event_flyer} alt="Flyer" />
                                    </div>
                                    <h3>Order summary</h3>
                                    <div className={styles.summaryInfo}>
                                        <div className={styles.summaryInfo__ticket}>
                                            <span>3 x Regular</span>
                                            <span className={styles.value}>&#8358;{(9000).toLocaleString()}</span>
                                        </div>
                                        <div className={styles.summaryInfo__ticket}>
                                            <span>3 x Premium</span>
                                            <span className={styles.value}>&#8358;{(12000).toLocaleString()}</span>
                                        </div>
                                        <div className={styles.summaryInfo__subs}>
                                            <span>Subtotal</span>
                                            <span className={styles.value}>&#8358;{(21000).toLocaleString()}</span>
                                        </div>
                                        <div className={styles.summaryInfo__subs}>
                                            <span>Discount (5% off)</span>
                                            <span className={styles.value}>-&nbsp;&#8358;{(1050).toLocaleString()}</span>
                                        </div>
                                        <div className={styles.summaryInfo__subs}>
                                            <span>Total</span>
                                            <span className={styles.value}>&#8358;{(19950).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </>}
                            <div className={styles.actionButtons}>
                                <button onClick={() => setVisibility(false)}>Cancel</button>
                                <button onClick={() => validateFields()}>Pay now</button>
                            </div>
                        </div>
                    </div>
                </PanelWrapper>
            }
        </>
    );
}

export default TicketDelivery;