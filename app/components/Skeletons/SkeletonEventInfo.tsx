import React from "react";
import { FunctionComponent, ReactElement } from "react";
import Shimmer from "./Shimmer";
import styles from "../../styles/skeleton.module.scss";
import SkeletonElement from "./SkeletonElement";
import { SkeletonTypes } from "./SkeletonTypes";
import useResponsive from "../../hooks/useResponsiveness";

interface SkeletonEventInfoProps {
    forConsole?: boolean
}

const SkeletonEventInfo: FunctionComponent<SkeletonEventInfoProps> = ({ forConsole }): ReactElement => {

    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;

    return (
        <section className={forConsole ? styles.consoleEventInfoContainer : styles.eventInfoContainer}>
            <div className={styles.mainSection}>
                <Shimmer />
                <div className={styles.eventImage}>
                    <SkeletonElement type={SkeletonTypes.thumbnail} style={{ margin: 0, height: '100%', width: '100%', position: 'absolute', top: '0', left: '0' }} />
                </div>
                <span className={styles.tag}><SkeletonElement type={SkeletonTypes.title} style={{ margin: '0', height: '100%', width: '100%' }} /></span>
                <div className={styles.eventDetails}>
                    <div className={styles.leftInfo}>
                        <SkeletonElement type={SkeletonTypes.title} style={typeof (onMobile) == "boolean" && onMobile ? { marginTop: '8px', width: '100%' } : { marginTop: '0' }} />
                        {/* <SkeletonElement type={SkeletonTypes.text} style={{ width: '35%' }} /> */}
                        <div className={styles.publisherInfo}>
                            <div className={styles.publisherInfo__image}>
                                <SkeletonElement type={SkeletonTypes.avatar} style={{ width: '100%', height: '100%', borderRadius: '100%' }} />
                            </div>
                            <div className={styles.publisherInfo__name}><SkeletonElement type={SkeletonTypes.text} style={{ margin: '0' }} /></div>
                        </div>
                        <div className={styles.dateTime}>
                            <SkeletonElement type={SkeletonTypes.title} />
                            <SkeletonElement type={SkeletonTypes.title} />
                        </div>
                        <div className={styles.location}>
                            <SkeletonElement type={SkeletonTypes.text} />
                            <SkeletonElement type={SkeletonTypes.text} />
                            <SkeletonElement type={SkeletonTypes.text} style={{ width: '70%' }} />
                        </div>
                        <div className={styles.bottomArea}>
                            <SkeletonElement type={SkeletonTypes.title} style={{ marginBottom: '0' }} />
                        </div>
                    </div>
                    <div className={styles.actionButtons}>
                        <SkeletonElement type={SkeletonTypes.avatar} style={{ margin: '0px', borderRadius: '100%' }} />
                        <SkeletonElement type={SkeletonTypes.avatar} style={{ margin: '0px', borderRadius: '100%' }} />
                        <SkeletonElement type={SkeletonTypes.avatar} style={{ margin: '0px', borderRadius: '100%' }} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SkeletonEventInfo;