"use client";

import { IBanner } from "@/app/models/IBanner";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BannerPreviewProps {
  banner: IBanner;
  userAvatarUrl?: string | null;
  userTextInputs?: { [key: string]: string };
  onAvatarClick?: () => void;
}

export const BannerPreview = ({
  banner,
  userAvatarUrl,
  userTextInputs,
  onAvatarClick,
}: BannerPreviewProps) => {
  const [imgState, setImgState] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
    scale: 1,
  });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const calculateState = () => {
      const { naturalWidth, naturalHeight, offsetWidth } = imageElement;
      if (naturalWidth > 0) {
        setImgState({
          naturalWidth,
          naturalHeight,
          scale: offsetWidth / naturalWidth,
        });
      }
    };

    if (imageElement.complete) {
      calculateState();
    } else {
      imageElement.addEventListener("load", calculateState);
    }

    const resizeObserver = new ResizeObserver(calculateState);
    resizeObserver.observe(imageElement);

    return () => {
      imageElement.removeEventListener("load", calculateState);
      resizeObserver.disconnect();
    };
  }, [banner.configuration.frameImageUrl]);

  const { configuration } = banner;
  const { frameImageUrl, avatar, textElements } = configuration || {};

  const toPercent = (value: number, total: number) => {
    if (!value || !total) return "0%";
    return `${(value / total) * 100}%`;
  };

  return (
    <div className="relative w-full mx-auto border rounded-md overflow-hidden bg-gray-200">
      <img
        ref={imageRef}
        src={frameImageUrl}
        alt="Banner frame"
        className="w-full h-auto select-none"
        crossOrigin="anonymous"
      />
      {/* Avatar Preview */}
      {avatar && imgState.naturalWidth > 0 && (
        <div
          className="absolute bg-cover bg-center transition-opacity overflow-hidden"
          style={{
            left: toPercent(avatar.x, imgState.naturalWidth),
            top: toPercent(avatar.y, imgState.naturalHeight),
            width: toPercent(avatar.width, imgState.naturalWidth),
            height: toPercent(avatar.height, imgState.naturalHeight),
            borderRadius: avatar.shape === "circle" ? "50%" : "8px",
            ...(onAvatarClick && { cursor: "pointer" }),
          }}
          onClick={onAvatarClick}
        >
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full grid place-items-center bg-black/20 border-2 border-dashed border-primary-color-sub/50 text-white/80 ${
                avatar.shape === "circle" ? "rounded-full" : "rounded-none"
              }`}
            >
              <div className="flex flex-col items-center text-center p-2">
                <ImageIcon className="w-1/3 h-1/3" />
                <span className="text-[8px] sm:text-xs mt-1">
                  {"Upload Photo"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Text Elements Preview */}
      {textElements?.map((el: any) => (
        <div
          key={el.id}
          className="absolute pointer-events-none"
          style={{
            left: toPercent(el.x, imgState.naturalWidth),
            top: toPercent(el.y, imgState.naturalHeight),
            fontSize: `${el.fontSize * imgState.scale}px`,
            color: el.color,
            fontFamily: el.fontFamily,
            fontWeight: el.fontWeight as any,
            whiteSpace: "nowrap",
          }}
        >
          {(userTextInputs && userTextInputs[el.id]) || el.text}
        </div>
      ))}
    </div>
  );
};
