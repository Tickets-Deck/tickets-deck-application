import React from "react";
import { FunctionComponent, ReactElement } from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";
import { SkeletonTypes } from "./SkeletonTypes";
import useResponsiveness from "../../hooks/useResponsiveness";

interface SkeletonEventInfoProps {
  forConsole?: boolean;
}

const SkeletonEventInfo: FunctionComponent<SkeletonEventInfoProps> = ({
  forConsole,
}): ReactElement => {
  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  return (
    <section
      className={`z-[2] relative translate-y-[-4rem] sm:translate-y-[-2.25rem] ${
        forConsole
          ? "p-[1.25rem] md:px-6"
          : "p-[1.25rem] md:px-[5rem] lg:px-[10rem] xl:px-[16%]"
      }`}
    >
      <div className='p-4 rounded-[1.5rem] min-[400px]:p-6 flex flex-col sm:flex-row items-center bg-container-grey gap-4 relative overflow-hidden'>
        <Shimmer />
        <div className='[&_img]:object-cover h-[11.25rem] w-full sm:w-[30%] min-w-[400px]:h-full min-[400px]:min-h-[40vh] rounded-[1em] relative overflow-hidden inline-flex'>
          <SkeletonElement
            type={SkeletonTypes.thumbnail}
            style={{
              margin: 0,
              height: "100%",
              width: "100%",
              position: "absolute",
              top: "0",
              left: "0",
            }}
          />
        </div>
        <span className='absolute top-6 right-6 rounded-[1em] text-white w-[100px] h-6'>
          <SkeletonElement
            type={SkeletonTypes.title}
            style={{ margin: "0", height: "100%", width: "100%" }}
          />
        </span>
        <div className='flex flex-col min-[400px]:flex-row size-full'>
          <div className='order-2 min-[400px]:order-none w-full flex-col'>
            <SkeletonElement
              type={SkeletonTypes.title}
              style={
                onMobile
                  ? { marginTop: "8px", width: "100%" }
                  : onDesktop
                  ? { marginTop: "0" }
                  : {}
              }
            />
            {/* <SkeletonElement type={SkeletonTypes.text} style={{ width: '35%' }} /> */}
            <div className='flex items-center gap-[0.35rem]'>
              <div className='size-8 min-[400px]:size-10 grid place-items-center'>
                <SkeletonElement
                  type={SkeletonTypes.avatar}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "100%",
                  }}
                />
              </div>
              <div className='text-sm min-[400px]:text-base text-white font-medium w-[30%]'>
                <SkeletonElement
                  type={SkeletonTypes.text}
                  style={{ margin: "0" }}
                />
              </div>
            </div>
            <div className='flex items-center gap-3 w-[70%] sm:w-1/2'>
              <SkeletonElement type={SkeletonTypes.title} />
              <SkeletonElement type={SkeletonTypes.title} />
            </div>
            <div className='w-[85%] sm:w-[80%]'>
              <SkeletonElement type={SkeletonTypes.text} />
              <SkeletonElement type={SkeletonTypes.text} />
              <SkeletonElement
                type={SkeletonTypes.text}
                style={{ width: "70%" }}
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-3 mt-[0.8rem]'>
              <SkeletonElement
                type={SkeletonTypes.title}
                style={{ marginBottom: "0" }}
              />
            </div>
          </div>
          <div className='w-full mb-2 flex gap-2 min-[400px]:flex-col min-[400px]:w-[8%] min-[400px]:gap-[0.85rem] min-[400px]:mb-0'>
            <SkeletonElement
              type={SkeletonTypes.avatar}
              style={{ margin: "0px", borderRadius: "100%" }}
            />
            <SkeletonElement
              type={SkeletonTypes.avatar}
              style={{ margin: "0px", borderRadius: "100%" }}
            />
            <SkeletonElement
              type={SkeletonTypes.avatar}
              style={{ margin: "0px", borderRadius: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkeletonEventInfo;
