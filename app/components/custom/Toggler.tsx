import { CSSProperties, FunctionComponent, ReactElement, useState, Dispatch, SetStateAction } from "react";
import styles from "@/app/styles/components/toggler.module.scss";

interface TogglerProps {
    setCheckboxValue: Dispatch<SetStateAction<boolean>>
    checkboxValue: boolean
}

const Toggler: FunctionComponent<TogglerProps> = (
    { setCheckboxValue, checkboxValue }): ReactElement => {

    return (
        <div className={`w-fit relative ${checkboxValue ? 'opacity-100' : 'opacity-80'}`}>
            <input
                type='checkbox'
                name="checkbox"
                checked={checkboxValue}
                onChange={(e) => setCheckboxValue(e.currentTarget.checked)}
                className="absolute size-full top-0 left-0 opacity-0 z-30 cursor-pointer peer"
            />
            <span className="bg-[#dadada] w-11 h-6 rounded-xl relative block transition-all duration-300 ease-in-out peer-checked:bg-white">
                <span className={`size-5 rounded-full absolute top-[calc(50%-1px)] transform -translate-y-1/2 block z-20 cursor-pointer transition-all duration-300 ease-in-out animate-sqwish
                    ${checkboxValue ? 'left-[calc(100%-22px)] bg-green-500' : 'left-[2px] bg-[#858585]'}
                    `}></span>
            </span>
        </div>
    );
}

export default Toggler;