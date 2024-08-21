import * as React from "react"
import { ButtonLoader } from "../Loader/ComponentLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    btnIcon?: React.ReactElement;
    minBtn?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, type, btnIcon, minBtn, isLoading, ...props }, ref) => {
        return (
            <button
                type={type} 
                className={`bg-primary text-white font-medium ${minBtn ? "py-2 px-4 text-xs" : "py-3 px-6 text-base"} rounded-full hover:bg-primary-foreground hover:text:bg-primary ${className}`}
                ref={ref}
                {...props}
            >
                {btnIcon && <span>{btnIcon}</span>}
                {isLoading && <ButtonLoader />}
                {props.children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
