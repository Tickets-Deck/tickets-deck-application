import { FunctionComponent, ReactElement } from "react";
// import { SkeletonTypes } from "./SkeletonTypes";
import styles from '../../styles/skeleton.module.scss';
import { SkeletonTypes } from "./SkeletonTypes";
import React, { CSSProperties } from "react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";

interface SkeletonElementProps {
    type: string
    style?: CSSProperties
}

const SkeletonElement: FunctionComponent<SkeletonElementProps> = ({ type, style }): ReactElement => {

    const appTheme = useSelector((state: RootState) => state.theme.appTheme);
    const isLightTheme = appTheme === Theme.Light;

    // const classes = `skeleton${type}`; 

    const classes = () => {
        return `skeleton${type}`
    };

    return (
        <>
            {type == SkeletonTypes.text && <div className={`${isLightTheme ? styles.skeletonLightTheme : styles.skeleton} ${styles.skeletontext}`} style={style}></div>} 
            {type == SkeletonTypes.title && <div className={`${isLightTheme ? styles.skeletonLightTheme : styles.skeleton} ${styles.skeletontitle}`} style={style}></div>}
            {type == SkeletonTypes.thumbnail && <div className={`${isLightTheme ? styles.skeletonLightTheme : styles.skeleton} ${styles.skeletonthumbnail}`} style={style}></div>}
            {type == SkeletonTypes.avatar && <div className={`${isLightTheme ? styles.skeletonLightTheme : styles.skeleton} ${styles.skeletonavatar}`} style={style}></div>}
        </>
    );
}

export default SkeletonElement;