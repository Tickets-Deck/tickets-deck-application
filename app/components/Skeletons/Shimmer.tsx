import { FunctionComponent, ReactElement } from "react";
import styles from "../../styles/skeleton.module.scss";
import React from "react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";

interface ShimmerProps {
    
}
 
const Shimmer: FunctionComponent<ShimmerProps> = ():ReactElement => {
    
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);
    const isLightTheme = appTheme === Theme.Light;

    return ( 
        <div className={styles.shimmerWrapper}> 
            <div className={isLightTheme ? styles.shimmerLight : styles.shimmer}></div>
        </div> 
     );
}
 
export default Shimmer;