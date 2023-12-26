import { FunctionComponent, ReactElement } from "react";
// import { SkeletonTypes } from "./SkeletonTypes";
import styles from '../../styles/skeleton.module.scss';
import { SkeletonTypes } from "./SkeletonTypes";
import React, { CSSProperties } from "react";

interface SkeletonElementProps {
    type: string
    style?: CSSProperties
}

const SkeletonElement: FunctionComponent<SkeletonElementProps> = ({ type, style }): ReactElement => {

    // const classes = `skeleton${type}`; 

    const classes = () => {
        return `skeleton${type}`
    };

    return (
        <>
            {type == SkeletonTypes.text && <div className={`${styles.skeleton} ${styles.skeletontext}`} style={style}></div>} 
            {type == SkeletonTypes.title && <div className={`${styles.skeleton} ${styles.skeletontitle}`} style={style}></div>}
            {type == SkeletonTypes.thumbnail && <div className={`${styles.skeleton} ${styles.skeletonthumbnail}`} style={style}></div>}
            {type == SkeletonTypes.avatar && <div className={`${styles.skeleton} ${styles.skeletonavatar}`} style={style}></div>}
        </>
    );
}

export default SkeletonElement;