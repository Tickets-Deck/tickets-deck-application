import { RefObject, useEffect } from "react";

/**
 * Custom hook to remove an HTML Div Element from DOM
 * @param refObject is the element's ref object
 * @param visibilityState is the state that holds the visibility value for the element
 * @param time is the time taken before the element is removed from the DOM - Use the animation-duration
 */
export default function useRemoveHtmlElementFromDOM(refObject: RefObject<HTMLDivElement>, visibilityState: boolean, time?: number, layout?: string) {

    /**
     * Function to remove an HTML Div Element from DOM
     * @param refObject is the element's ref object
     * @param visibilityState is the state that holds the visibility value for the element
     * @param time is the time taken before the element is removed from the DOM - Use the animation-duration
     * @param layout represents the type of layout for the element (e.g., flex or grid)
     */
    function removeElementFromDOM(refObject: RefObject<HTMLDivElement>, visibilityState: boolean, time?: number, layout?: string) {

        // If ref object is available on DOM and element is visibility... 
        if (visibilityState == false) {

            // console.log('object detected');
            setTimeout(() => {

                if (refObject.current) {
                    // Hide element -> Add the display property and set it's value to none...
                    refObject.current.style.display = 'none';
                    // console.log('removed object from DOM');
                }
            }, time ?? 1000);
        } else {

            if (refObject.current) {
                // Show element -> Add the display property and set it's value to none...
                switch (layout) {
                    case "flex":
                        return refObject.current.style.display = 'flex';
                    case "grid":
                        return refObject.current.style.display = 'flex';
                    case "block":
                        return refObject.current.style.display = 'block';

                    default:
                        return refObject.current.style.display = 'contents';
                }
                // console.log('added object to DOM');
            }
        }
    }

    // useEffect hook to trigger function 
    useEffect(() => {
        removeElementFromDOM(refObject, visibilityState, time, layout);
    }, [refObject.current, visibilityState]);
}