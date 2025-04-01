import { FunctionComponent, ReactElement } from "react";
import React from "react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";

interface ShimmerProps {}

const Shimmer: FunctionComponent<ShimmerProps> = (): ReactElement => {
  const appTheme = useSelector((state: RootState) => state.theme.appTheme);
  const isLightTheme = appTheme === Theme.Light;

  return (
    <div className='absolute top-0 left-0 size-full animate-skeletonLoading duration-[2500ms]'>
      <div
        className={`w-1/2 h-full bg-[#49494933] skew-x-[-20deg] blur-[0.938rem] shadow-[0_0_1.875rem_1.875rem_#ffffff0d] ${
          isLightTheme ? "bg-[#e2e2e233]" : ""
        }`}
      ></div>
    </div>
  );
};

export default Shimmer;
