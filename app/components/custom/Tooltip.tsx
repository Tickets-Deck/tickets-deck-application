import { ReactElement, FunctionComponent } from "react";

interface TooltipProps {
    children: JSX.Element
    tooltipText: string
    position?: 'left' | 'bottom' | 'top' | 'right'
}

const Tooltip: FunctionComponent<TooltipProps> = ({ children, tooltipText, position }): ReactElement => {
    return (
        <div className='tooltipWrapper'>
            <span className={`tooltip ${position ?? 'left'}`}>{tooltipText}</span>
            {children}
        </div>
    );
}

export default Tooltip;