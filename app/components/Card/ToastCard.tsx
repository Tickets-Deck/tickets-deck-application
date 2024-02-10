"use client"
import { CSSProperties, FunctionComponent, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useState } from "react";
// import { AiOutlineClose, AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai';
// import { CheckOutlined } from '@ant-design/icons';
import styles from '../../styles/ToastCard.module.scss';
import { CloseMenuIcon, OutlineCheckIcon, OutlineCloseIcon, OutlineInfoIcon, OutlineWarningIcon } from "../../components/SVGs/SVGicons";  
// import useResponsive from "../../hooks/useResponsiveness";
import { ToastContext } from "../../extensions/toast";
import { ToastMessageType } from "../../models/ToastMessageType";
import useResponsiveness from "@/app/hooks/useResponsiveness";

interface ToastCardProps {
    visibility: Boolean;
    messageType: ToastMessageType;
    title: string;
    description: string;
    timeout: number;
}

function SuccessCard(props: { messageTitle: string | number | boolean; messageInfo: string | number | boolean; }) {

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    //States for cards visibility
    const [visible, setVisibility] = useState(false);
    const hideCard = () => {
        setVisibility(!visible);
    }
    //Show and hide functions for the sidebar elements
    const show = () => {
        if (visible) {
            return `${styles.show}`
        } else {
            return `${styles.hide}`
        }
    }
    const hide = () => {
        if (visible) {
            return `${styles.hide}`
        } else {
            return `${styles.show}`
        }
    }
    return (
        <div className={onMobile ? `${styles.toastCard} ${styles.successCard} ${hide()}` : onDesktop ? `${styles.toastCardMobile} ${styles.successCardMobile} ${hide()}` : styles.toastCard}>
            <div className={styles.toastCard__messageType}>
                <div className={styles.indicatorSuccess}>
                    <div className={styles.indicatorSuccess__box}>
                        <OutlineCheckIcon />
                    </div>
                </div>
                <div className={styles.info}>
                    <h4 className={styles.info__title}>{props.messageTitle}</h4>
                    <p className={styles.info__description}>
                        {props.messageInfo}
                    </p>
                </div>
            </div>
            <button className={styles.closeCard} onClick={hideCard}>
                <OutlineCloseIcon />
            </button>
        </div>
    )
}

function InfoCard(props: { messageTitle: string | number | boolean; messageInfo: string | number | boolean; }) {
    //States for cards visibility
    const [visible, setVisibility] = useState(false);
    const hideCard = () => {
        setVisibility(!visible);
    }
    //Show and hide functions for the sidebar elements
    const show = () => {
        if (visible) {
            return `${styles.show}`
        } else {
            return `${styles.hide}`
        }
    }
    const hide = () => {
        if (visible) {
            return `${styles.hide}`
        } else {
            return `${styles.show}`
        }
    }
    return (
        <div className={`${styles.toastCard} ${styles.infoCard} ${hide()} `}>
            <div className={styles.toastCard__messageType}>
                <div className={styles.indicatorInfo}>
                    <div className={styles.indicatorInfo__box}>
                        <OutlineInfoIcon />
                    </div>
                </div>
                <div className={styles.info}>
                    <h4 className={styles.info__title}>{props.messageTitle} </h4>
                    <p className={styles.info__description}>
                        {props.messageInfo}
                    </p>
                </div>
            </div>
            <button className={styles.closeCard} onClick={hideCard}>
                <OutlineCloseIcon />
            </button>
        </div>

    )
}

function WarningCard(props: { messageTitle: string | number | boolean; messageInfo: string | number | boolean; }) {
    //States for cards visibility
    const [visible, setVisibility] = useState(false);
    const hideCard = () => {
        setVisibility(!visible);
    }
    //Show and hide functions for the sidebar elements
    const show = () => {
        if (visible) {
            return `${styles.show}`
        } else {
            return `${styles.hide}`
        }
    }
    const hide = () => {
        if (visible) {
            return `${styles.hide}`
        } else {
            return `${styles.show}`
        }
    }
    return (
        <div className={`${styles.toastCard} ${styles.warningCard} ${hide()} `}>
            <div className={styles.toastCard__messageType}>
                <div className={styles.indicatorWarning}>
                    <div className={styles.indicatorWarning__box}>
                        <OutlineWarningIcon />
                    </div>
                </div>
                <div className={styles.info}>
                    <h4 className={styles.info__title}>{props.messageTitle} </h4>
                    <p className={styles.info__description}>
                        {props.messageInfo}
                    </p>
                </div>
            </div>
            <button className={styles.closeCard} onClick={hideCard}>
                <OutlineCloseIcon />
            </button>
        </div>

    )
}

function ErrorCard(props: { messageTitle: string | number | boolean; messageInfo: string | number | boolean; }) {
    //States for cards visibility
    const [visible, setVisibility] = useState(false);
    const hideCard = () => {
        setVisibility(!visible);
    }
    //Show and hide functions for the sidebar elements
    const show = () => {
        if (visible) {
            return `${styles.show}`
        } else {
            return `${styles.hide}`
        }
    }
    const hide = () => {
        if (visible) {
            return `${styles.hide}`
        } else {
            return `${styles.show}`
        }
    }
    return (
        <div className={`${styles.toastCard} ${styles.dangerCard} ${hide()} `}>
            <div className={styles.toastCard__messageType}>
                <div className={styles.indicatorDanger}>
                    <div className={styles.indicatorDanger__box}>
                        <OutlineCloseIcon />
                    </div>
                </div>
                <div className={styles.info}>
                    <h4 className={styles.info__title}>{props.messageTitle}  </h4>
                    <p className={styles.info__description}>
                        {props.messageInfo}
                    </p>
                </div>
            </div>
            <button className={styles.closeCard} onClick={hideCard}>
                <OutlineCloseIcon />
            </button>
        </div>

    )
}

const ToastCard: FunctionComponent<ToastCardProps> = ({ messageType, description, title, visibility, timeout }): ReactElement => {

    // Fetch the toast context
    const toastHandler = useContext(ToastContext);

    /**
     * Closes the toast
     */
    function closeToast() {
        toastHandler?.closeToast();
    }

    useEffect(() => {
        let closeTimeout = setTimeout(() => {

            // Close the toast
            toastHandler?.closeToast();

        }, timeout);

        return () => {
            clearTimeout(closeTimeout);
        };
    }, [visibility]);

    // set style accoroding to message type 
    function setCardStyle() {
        if (messageType == ToastMessageType.Success) {
            return `${styles.successCard}`
        }
        if (messageType == ToastMessageType.Info) {
            return `${styles.infoCard}`
        }
        if (messageType == ToastMessageType.Warning) {
            return `${styles.warningCard}`
        }
        if (messageType == ToastMessageType.Error) {
            return `${styles.dangerCard}`
        }
    }
    function indicatorType() {
        if (messageType == ToastMessageType.Success) {
            return `${styles.indicatorsuccess}`
        }
        if (messageType == ToastMessageType.Info) {
            return `${styles.indicatorinfo}`
        }
        if (messageType == ToastMessageType.Warning) {
            return `${styles.indicatorwarning}`
        }
        if (messageType == ToastMessageType.Error) {
            return `${styles.indicatordanger}`
        }
    }
    function indicatorTitle() {
        if (messageType == ToastMessageType.Success) {
            return `${styles.titlesuccess}`
        }
        if (messageType == ToastMessageType.Info) {
            return `${styles.titleinfo}`
        }
        if (messageType == ToastMessageType.Warning) {
            return `${styles.titlewarning}`
        }
        if (messageType == ToastMessageType.Error) {
            return `${styles.titledanger}`
        }
    }
    function loaderSpan() {
        if (messageType == ToastMessageType.Success) {
            return `${styles.spansuccess}`
        }
        if (messageType == ToastMessageType.Info) {
            return `${styles.spaninfo}`
        }
        if (messageType == ToastMessageType.Warning) {
            return `${styles.spanwarning}`
        }
        if (messageType == ToastMessageType.Error) {
            return `${styles.spandanger}`
        }
    }
    function indicatorBox() {
        if (messageType == ToastMessageType.Success) {
            return `${styles.indicatorsuccess__box}`
        }
        if (messageType == ToastMessageType.Info) {
            return `${styles.indicatorinfo__box}`
        }
        if (messageType == ToastMessageType.Warning) {
            return `${styles.indicatorwarning__box}` 
        }
        if (messageType == ToastMessageType.Error) {
            return `${styles.indicatordanger__box}`
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={`${styles.toastCard} ${setCardStyle()} ${visibility ? styles.show : styles.hide}`}>
                    <div className={styles.toastCard__messageType}>
                        <div className={`${indicatorType()}`}>
                            <div className={`${indicatorBox()}`}>
                                {messageType == ToastMessageType.Success && <OutlineCheckIcon />}
                                {messageType == ToastMessageType.Info && <OutlineInfoIcon />}
                                {messageType == ToastMessageType.Warning && <OutlineWarningIcon />}
                                {messageType == ToastMessageType.Error && <OutlineCloseIcon />}
                            </div>
                        </div>
                        <div className={styles.info}>
                            <h4 className={`${styles.info__title} ${indicatorTitle()}`}>{title}</h4>
                            <p className={styles.info__description}>
                                {description}
                            </p>
                        </div>
                    </div>
                    <button className={styles.closeCard} onClick={closeToast}>
                        <CloseMenuIcon />
                    </button>
                    <span className={`${loaderSpan()}`} style={{'--loader-timer': `${timeout}ms`} as CSSProperties}></span> 
                </div>
            </div>
        </>
    );
}

export default ToastCard;