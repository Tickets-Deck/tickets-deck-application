import { CSSProperties, Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";
import styles from '@/app/styles/DynamicTab.module.scss';

interface DynamicTabProps {
    currentTab: number
    setCurrentTab: Dispatch<SetStateAction<number>>
    arrayOfTabOptions: { tabName: string, isDisabled?: boolean }[]
    tabCustomWidth: number
    tabCustomHeight: number
    indicatorColor?: string
    tabActiveColor?: string
    tabInActiveColor?: string
    containerbackgroundColor?: string
    hasBorder?: boolean,
    outerBorderBackgroundColor?: string
    outerBorderRadius?: string
}

const DynamicTab: FunctionComponent<DynamicTabProps> = (
    { currentTab, setCurrentTab, arrayOfTabOptions,
        tabCustomHeight, tabCustomWidth, indicatorColor,
        tabActiveColor, tabInActiveColor, containerbackgroundColor,
        hasBorder, outerBorderBackgroundColor, outerBorderRadius }): ReactElement => {

    /**
     * Width of each tab option
     */
    // const tabCustomWidth = 100;

    /**
     * Height of each tab option & overall height
     */
    // const tabCustomHeight = 40;

    function switchTabTest() {
        for (let index = 0; index < arrayOfTabOptions.length; index++) {
            if (currentTab == index) {
                return {
                    left: `${index * tabCustomWidth}px`, width: `${tabCustomWidth}px`, backgroundColor: indicatorColor ?? '#000000',
                }
            }
        }
    }

    return (
        <div className={`${styles.sectionContainer}`} style={hasBorder ? { padding: '8px', backgroundColor: outerBorderBackgroundColor, borderRadius: outerBorderRadius ?? '30px' } : {}}>
            <div className={styles.tabsSectionContainer} style={{ backgroundColor: containerbackgroundColor }}>
                {arrayOfTabOptions.map((tabOption, index) => {
                    return (
                        <p
                            key={index}
                            style={currentTab == index ?
                                { '--tabWidth': `${tabCustomWidth}px`, '--tabHeight': `${tabCustomHeight}px`, color: tabActiveColor ?? '#fff' } as CSSProperties :
                                { '--tabWidth': `${tabCustomWidth}px`, '--tabHeight': `${tabCustomHeight}px`, color: tabInActiveColor ?? '' } as CSSProperties}
                            onClick={() => setCurrentTab(index)}
                            className={currentTab == index ? styles.active : ''}
                            aria-disabled={tabOption.isDisabled == true ? true : undefined}
                        >
                            {tabOption.tabName}
                        </p>
                    )
                })}
                <span
                    style={switchTabTest()}
                ></span>
            </div>
        </div>
    );
}

export default DynamicTab;