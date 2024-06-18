import { Dispatch, FunctionComponent, ReactElement, ReactNode, SetStateAction, useRef, CSSProperties } from "react";
import modalStyle from "../../styles/ModalStyle.module.scss";
import useRemoveHtmlElementFromDOM from "../../hooks/useRemoveHtmlElementFromDOM";

interface ModalWrapperProps {
    setVisibility: Dispatch<SetStateAction<boolean>>
    visibility: boolean
    children: ReactNode
    styles?: CSSProperties
    disallowOverlayFunction?: boolean
}

const ModalWrapper: FunctionComponent<ModalWrapperProps> = ({ visibility, setVisibility, children, styles, disallowOverlayFunction }): ReactElement => {

    const modalContainerRef = useRef<HTMLDivElement>(null);

    useRemoveHtmlElementFromDOM(modalContainerRef, visibility, 350, "flex");

    return (
        <div className={visibility ? modalStyle.modalParent : modalStyle.modalParentInvisible} ref={modalContainerRef}>
            <div className={modalStyle.overlay} onClick={() =>  disallowOverlayFunction ? {} : setVisibility(false)}></div> 
            <div className={modalStyle.modalContainer} style={styles}>
                {children}
            </div>
        </div>
    );
}

export default ModalWrapper;