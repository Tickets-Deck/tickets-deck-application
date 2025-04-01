import { FunctionComponent, ReactElement } from "react";
// import { SkeletonTypes } from "./SkeletonTypes";
import { SkeletonTypes } from "./SkeletonTypes";
import React, { CSSProperties } from "react";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";

interface SkeletonElementProps {
  type: string;
  style?: CSSProperties;
}

const SkeletonElement: FunctionComponent<SkeletonElementProps> = ({
  type,
  style,
}): ReactElement => {
  const appTheme = useSelector((state: RootState) => state.theme.appTheme);
  const isLightTheme = appTheme === Theme.Light;

  // const classes = `skeleton${type}`;

  const classes = () => {
    return `skeleton${type}`;
  };

  return (
    <>
      {type == SkeletonTypes.text && (
        <div
          className={`bg-[#494949] my-[0.625rem] rounded-[0.5rem] animate-pulse duration-1000  ${
            isLightTheme ? "bg-[#e2e2e2]" : ""
          } w-full h-[0.9rem]`}
          style={style}
        ></div>
      )}
      {type == SkeletonTypes.title && (
        <div
          className={`bg-[#494949] my-[0.625rem] rounded-[0.5rem] animate-pulse duration-1000  ${
            isLightTheme ? "bg-[#e2e2e2]" : ""
          } w-1/2 h-6 mb-[0.938rem]`}
          style={style}
        ></div>
      )}
      {type == SkeletonTypes.thumbnail && (
        <div
          className={`bg-[#494949] my-[0.625rem] rounded-[0.5rem] animate-pulse duration-1000  ${
            isLightTheme ? "bg-[#e2e2e2]" : ""
          } size-[6.25rem]`}
          style={style}
        ></div>
      )}
      {type == SkeletonTypes.avatar && (
        <div
          className={`bg-[#494949] my-[0.625rem] rounded-[0.5rem] animate-pulse duration-1000  ${
            isLightTheme ? "bg-[#e2e2e2]" : ""
          } size-10`}
          style={style}
        ></div>
      )}
    </>
  );
};

export default SkeletonElement;
