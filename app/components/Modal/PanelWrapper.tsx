import { Dispatch, FunctionComponent, ReactElement, ReactNode, SetStateAction, useRef, CSSProperties } from "react";
import panelStyle from "../../styles/PanelStyle.module.scss";
import useRemoveHtmlElementFromDOM from "../../hooks/useRemoveHtmlElementFromDOM";

interface PanelWrapperProps {
    setVisibility: Dispatch<SetStateAction<boolean>>
    visibility: boolean
    children: ReactNode
    styles?: CSSProperties
    disallowOverlayFunction?: boolean
}

const PanelWrapper: FunctionComponent<PanelWrapperProps> = ({ visibility, setVisibility, children, styles, disallowOverlayFunction }): ReactElement => {

    const panelContainerRef = useRef<HTMLDivElement>(null);

    useRemoveHtmlElementFromDOM(panelContainerRef, visibility, 600, "flex");

    return (
        <div className={visibility ? panelStyle.rightSidebarContainer : panelStyle.rightSidebarContainerInvisible} ref={panelContainerRef}>
            <div className={panelStyle.overlay} onClick={() =>  disallowOverlayFunction ? {} : setVisibility(false)}></div> 
            <div className={panelStyle.container} style={styles}>
                {children}
            </div>
        </div>
    );
}

export default PanelWrapper;