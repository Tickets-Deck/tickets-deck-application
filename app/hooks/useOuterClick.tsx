import { RefObject, SetStateAction, useEffect } from "react";

/**
 * Function to close object visibiity when an element asides it is clicked upon
 * @param refObject is the name of the ref object
 * @param closeFuntion is the function for the state that ensures the element's visibility
 */
export default function useOuterClick(refObject: RefObject<any>, closeFuntion: (value: SetStateAction<boolean>) => void) {

    // useEffect hook to close an element when mouse is clicked outside the elements's area  
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (refObject.current && !refObject.current.contains(event.target as Node)) {
                closeFuntion(false); 
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [refObject]);
}