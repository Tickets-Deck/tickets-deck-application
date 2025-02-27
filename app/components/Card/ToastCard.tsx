import { CSSProperties, FunctionComponent, ReactElement, useContext, useEffect } from "react";
import { Icons } from "../ui/icons";
import { ToastContext } from "@/app/context/ToastCardContext";
import { indicatorColor } from "@/app/styles/styles";
import { ToastMessageType } from "@/app/enums/ToastMessageType";


interface ToastCardProps {
    visibility: boolean;
    messageType: ToastMessageType;
    title: string;
    description: string;
    timeout: number;
    position: string;
}

const ToastCard: FunctionComponent<ToastCardProps> = ({ messageType, description, title, visibility, timeout, position }): ReactElement => {

    // Fetch the toast context
    const toastHandler = useContext(ToastContext);

    /**
     * Closes the toast
     */
    function closeToast() {
        toastHandler?.closeToast();
    }

    useEffect(() => {
        const closeTimeout = setTimeout(() => {

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
            return {
                closeBtnHover: "hover:bg-green-500/20"
            }
        }
        if (messageType == ToastMessageType.Info) {
            return {
                closeBtnHover: "hover:bg-blue-500/20"
            }
        }
        if (messageType == ToastMessageType.Warning) {
            return {
                closeBtnHover: "hover:bg-yellow-500/20"
            }
        }
        if (messageType == ToastMessageType.Error) {
            return {
                closeBtnHover: "hover:bg-red-500/20"
            }
        }
    }
    function indicatorType() {
        if (messageType == ToastMessageType.Success) {
            return `${indicatorColor}`
        }
        if (messageType == ToastMessageType.Info) {
            return `${indicatorColor}`
        }
        if (messageType == ToastMessageType.Warning) {
            return `${indicatorColor}`
        }
        if (messageType == ToastMessageType.Error) {
            return `${indicatorColor}`
        }
    }
    function indicatorTitle() {
        if (messageType == ToastMessageType.Success) {
            return `text-successColor`
        }
        if (messageType == ToastMessageType.Info) {
            return `text-info`
        }
        if (messageType == ToastMessageType.Warning) {
            return `text-warning`
        }
        if (messageType == ToastMessageType.Error) {
            return `text-danger`
        }
    }
    function loaderSpan() {
        if (messageType == ToastMessageType.Success) {
            return `bg-successColor`
        }
        if (messageType == ToastMessageType.Info) {
            return `bg-info`
        }
        if (messageType == ToastMessageType.Warning) {
            return `bg-warning`
        }
        if (messageType == ToastMessageType.Error) {
            return `bg-danger`
        }
    }
    function indicatorBox() {
        if (messageType == ToastMessageType.Success) {
            return `${indicatorColor}`
        }
        if (messageType == ToastMessageType.Info) {
            return `text-successColor`
        }
        if (messageType == ToastMessageType.Warning) {
            return `bg-white p-0 inline-flex rounded-[50%] w-[21.5px] h-[21.5px]`
        }
        if (messageType == ToastMessageType.Error) {
            return `bg-white p-0 inline-flex rounded-[50%] w-[21.5px] h-[21.5px]`
        }
    }

    return (
        <div

            style={{
                top: position.includes('top') ? '1rem' : undefined,
                bottom: position.includes('bottom') ? '1rem' : undefined,
                left: position.includes('left') ? '1rem' : undefined,
                right: position.includes('right') ? '12rem' : undefined,
                margin: position.includes('center') ? '0 auto' : undefined,
            }}
            className='fixed top-5 right-1/2 w-[360px] translate-y-0 z-[999] transition-all duration-300 ease-in flex flex-col gap-4 -mr-[180px]'>
            <div
                className={`p-3 flex bg-white rounded  gap-[10px] relative shadow-[0px_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in 
                    ${setCardStyle()} 
                    ${visibility ? "!flex animate-slideInFromRight" : "hidden animate-slideOutToRight"}`
                }>
                <div className='flex gap-2 w-full'>
                    <div className={`${indicatorType()}`}>
                        <div className={`${indicatorBox()}`}>
                            {messageType == ToastMessageType.Success && <Icons.FaceSuccessIcon className='text-successColor' />}
                            {messageType == ToastMessageType.Info && <Icons.OutlineInfoIcon className='text-info' />}
                            {messageType == ToastMessageType.Warning && <Icons.OutlineWarningIcon className='text-warning' />}
                            {messageType == ToastMessageType.Error && <Icons.FaceErrorIcon className='text-danger' />}
                        </div>
                    </div>
                    <div className='w-full'>
                        <h4 className={`font-medium text-base ${indicatorTitle()}`}>{title}</h4>
                        <p className='text-[10px] md:text-xs font-normal text-gray-800'>
                            {description}
                        </p>
                    </div>
                </div>
                <button
                    className={`p-[6px] cursor-pointer border-none rounded-md bg-transparent flex items-center h-fit ${setCardStyle()?.closeBtnHover}`}
                    onClick={closeToast}>
                    <Icons.CloseMenu className='w-4 h-4 fill-black' />
                </button>
                <span className={`${loaderSpan()}`} style={{ '--loader-timer': `${timeout}ms` } as CSSProperties}></span>
            </div>
        </div>
    );
}

export default ToastCard;