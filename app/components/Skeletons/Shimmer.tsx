import { FunctionComponent, ReactElement } from "react";
import styles from "../../styles/skeleton.module.scss";
import React from "react";

interface ShimmerProps {
    
}
 
const Shimmer: FunctionComponent<ShimmerProps> = ():ReactElement => {
    return ( 
        <div className={styles.shimmerWrapper}> 
            <div className={styles.shimmer}></div>
        </div> 
     );
}
 
export default Shimmer;