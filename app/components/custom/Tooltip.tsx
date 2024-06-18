import { ReactElement, FunctionComponent } from "react";

interface TooltipProps {
    children: JSX.Element
    tooltipText: string
    position?: 'left' | 'bottom' | 'top' | 'right'
    action?: () => void
}

const Tooltip: FunctionComponent<TooltipProps> = ({ children, tooltipText, position, action }): ReactElement => {
    return (
        <div className='tooltipWrapper' onClick={action}>
            <span className={`tooltip ${position ?? 'left'}`}>{tooltipText}</span>
            {children}
        </div>
    );
}

export default Tooltip;