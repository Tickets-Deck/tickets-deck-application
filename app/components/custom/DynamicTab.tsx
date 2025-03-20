import {
  CSSProperties,
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
} from "react";

interface DynamicTabProps {
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  arrayOfTabOptions: { tabName: string; isDisabled?: boolean }[];
  tabCustomWidth: number;
  tabCustomHeight: number;
  indicatorColor?: string;
  tabActiveColor?: string;
  tabInActiveColor?: string;
  containerbackgroundColor?: string;
  hasBorder?: boolean;
  outerBorderBackgroundColor?: string;
  outerBorderRadius?: string;
}

const DynamicTab: FunctionComponent<DynamicTabProps> = ({
  currentTab,
  setCurrentTab,
  arrayOfTabOptions,
  tabCustomHeight,
  tabCustomWidth,
  indicatorColor,
  tabActiveColor,
  tabInActiveColor,
  containerbackgroundColor,
  hasBorder,
  outerBorderBackgroundColor,
  outerBorderRadius,
}): ReactElement => {
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
          left: `${index * tabCustomWidth}px`,
          width: `${tabCustomWidth}px`,
          backgroundColor: indicatorColor ?? "#000000",
        };
      }
    }
  }

  return (
    <div
      className='w-fit md:w-auto'
      style={
        hasBorder
          ? {
              padding: "8px",
              backgroundColor: outerBorderBackgroundColor,
              borderRadius: outerBorderRadius ?? "30px",
            }
          : {}
      }
    >
      <div
        className='flex w-full md:w-fit rounded-[40px] overflow-hidden bg-white relative'
        style={{ backgroundColor: containerbackgroundColor }}
      >
        {arrayOfTabOptions.map((tabOption, index) => {
          return (
            <p
              key={index}
              style={
                currentTab == index
                  ? ({
                      "--tabWidth": `${tabCustomWidth}px`,
                      "--tabHeight": `${tabCustomHeight}px`,
                      color: tabActiveColor ?? "#fff",
                    } as CSSProperties)
                  : ({
                      "--tabWidth": `${tabCustomWidth}px`,
                      "--tabHeight": `${tabCustomHeight}px`,
                      color: tabInActiveColor ?? "",
                    } as CSSProperties)
              }
              onClick={() => setCurrentTab(index)}
              className={`m-0 w-[var(--tabWidth)] h-[var(--tabHeight)] p-0 text-sm grid place-items-center text-[#3b3939] cursor-pointer z-[2] transition-all duration-300 select-none hover:bg-transparent aria-disabled:opacity-80 aria-disabled:pointer-events-none  ${
                currentTab == index ? "hover:bg-transparent" : ""
              }`}
              aria-disabled={tabOption.isDisabled == true ? true : undefined}
            >
              {tabOption.tabName}
            </p>
          );
        })}
        <span
          className='absolute w-[var(--tabWidth)] h-full rounded-[40px] transition-[all_300ms_cubic-bezier(0.61,-0.16,0.52,1.2)]'
          style={switchTabTest()}
        ></span>
      </div>
    </div>
  );
};

export default DynamicTab;
