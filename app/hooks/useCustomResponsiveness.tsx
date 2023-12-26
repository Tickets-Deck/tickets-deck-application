import { useEffect, useState } from "react";

export default function useCustomResponsive(threshold: number) {
    function windowMatch() {
        if (typeof window !== "undefined") {
            return (window.matchMedia(`(max-width: ${threshold}px)`).matches);
        }
    }
    const [isThresholdReached, setIsThresholdReached] = useState<any>(windowMatch());
    useEffect(() => {
        // Set media query btw 0px and threshold
        if (typeof window !== "undefined") {
            window.matchMedia(`(max-width: ${threshold}px)`).addEventListener('change', e => {
                setIsThresholdReached(e.matches);
            })
        }
    })
    // Return the state variable
    return isThresholdReached;
}