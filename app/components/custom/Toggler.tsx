import { CSSProperties, FunctionComponent, ReactElement, useState, Dispatch, SetStateAction } from "react";
import styles from "@/app/styles/components/toggler.module.scss";

interface TogglerProps {
    mainColor: string;
    disabledColor: string;
    togglerIndicatorColor: string;
    setCheckboxValue: Dispatch<SetStateAction<boolean>>
    checkboxValue: boolean
}

const Toggler: FunctionComponent<TogglerProps> = (
    { mainColor, disabledColor, togglerIndicatorColor, setCheckboxValue, checkboxValue }): ReactElement => {

    // const [checkboxValue, setCheckboxValue] = useState(false);

    return (
        <div
            className={styles.togglerContainer}
            style={{ '--main-color': `#${mainColor}`, '--disabled-color': `#${disabledColor}`, '--toggler-indicator-color': `#${togglerIndicatorColor}` } as CSSProperties}>
            <input type='checkbox' name="checkbox" checked={checkboxValue} onChange={(e) => setCheckboxValue(e.currentTarget.checked)} />
            <span className={styles.toggler}>
                <span className={styles.togglerIndicator}></span>
            </span>
        </div>
    );
}

export default Toggler;