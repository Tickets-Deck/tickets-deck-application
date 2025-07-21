"use client";

import { IBanner } from "@/app/models/IBanner";
import { useEffect, useRef, useState } from "react";

const AVATAR_PLACEHOLDER = "/images/avatar-placeholder.png";

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
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (imageRef.current) {
        const { naturalWidth, offsetWidth } = imageRef.current;
        if (naturalWidth > 0) {
          setScale(offsetWidth / naturalWidth);
        }
      }
    };

    const imageElement = imageRef.current;
    if (!imageElement) return;

    imageElement.onload = calculateScale;
    if (imageElement.complete) {
      calculateScale();
    }

    const resizeObserver = new ResizeObserver(calculateScale);
    resizeObserver.observe(imageElement);

    return () => resizeObserver.disconnect();
  }, [banner.configuration.frameImageUrl]);

  return (
    <div className="relative w-full mx-auto border rounded-md overflow-hidden bg-gray-100">
      <img
        ref={imageRef}
        src={banner.configuration.frameImageUrl}
        alt="Banner frame"
        className="w-full h-auto select-none"
        crossOrigin="anonymous"
      />
      {/* Avatar Preview */}
      {banner.configuration.avatar && (
        <div
          className={`absolute bg-cover bg-center transition-opacity ${
            onAvatarClick
              ? "cursor-pointer hover:opacity-90"
              : "pointer-events-none"
          } ${
            !userAvatarUrl
              ? "bg-black/20 border-2 border-dashed border-white/50"
              : ""
          }`}
          style={{
            left: banner.configuration.avatar.x * scale,
            top: banner.configuration.avatar.y * scale,
            width: banner.configuration.avatar.width * scale,
            height: banner.configuration.avatar.height * scale,
            backgroundImage: `url(${userAvatarUrl || AVATAR_PLACEHOLDER})`,
            borderRadius:
              banner.configuration.avatar.shape === "circle" ? "50%" : "0",
          }}
          onClick={onAvatarClick}
        />
      )}
      {/* Text Elements Preview */}
      {banner.configuration.textElements?.map((el) => (
        <div
          key={el.id}
          className="absolute pointer-events-none"
          style={{
            left: el.x * scale,
            top: el.y * scale,
            fontSize: `${el.fontSize * scale}px`,
            color: el.color,
            fontFamily: el.fontFamily,
            fontWeight: el.fontWeight as any,
            whiteSpace: "nowrap",
          }}
        >
          {userTextInputs?.[el.id] || el.text}
        </div>
      ))}
    </div>
  );
};
