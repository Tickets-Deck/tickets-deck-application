import { useUploadBannerFrame } from "@/app/api/apiClient";
import { ICreateBannerPayload } from "@/app/models/IBanner";
import { useEffect, useRef, useState } from "react";

interface Step4Props {
  payload: Partial<ICreateBannerPayload>;
  frameImageUrl: string | null;
  isUploading: boolean;
}

const AVATAR_PLACEHOLDER = "/images/avatar-placeholder.png";

export const Step4Review = ({
  payload,
  frameImageUrl,
  isUploading,
}: Step4Props) => {
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  // This effect calculates the scale factor of the rendered image vs its natural size
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
  }, [frameImageUrl]);

  if (!frameImageUrl) {
    return (
      <div className="text-center text-red-500">
        An error occurred. Please go back and re-upload your frame image.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Review & Publish
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Review your banner configuration below. If everything looks correct,
          press "Publish Banner".
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-4 rounded-md border p-4 bg-gray-50 h-fit">
          <div>
            <h4 className="font-semibold text-gray-800">Title</h4>
            <p className="text-gray-600">{payload.title || "Not set"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Description</h4>
            <p className="text-gray-600">{payload.description || "Not set"}</p>
          </div>
          {payload.configuration?.avatar && (
            <div>
              <h4 className="font-semibold text-gray-800">Avatar Config</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                <li>Shape: {payload.configuration.avatar.shape}</li>
                <li>
                  Position: (x: {Math.round(payload.configuration.avatar.x)}, y:{" "}
                  {Math.round(payload.configuration.avatar.y)})
                </li>
                <li>
                  Size: {payload.configuration.avatar.width}px x{" "}
                  {payload.configuration.avatar.height}px
                </li>
              </ul>
            </div>
          )}
          {payload.configuration?.textElements &&
            payload.configuration.textElements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800">Text Elements</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {payload.configuration.textElements.map((el) => (
                    <li key={el.id}>
                      "{el.text}" ({el.fontSize}px, {el.color})
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Right Column: Visual Preview */}
        <div className="relative w-full mx-auto border rounded-md overflow-hidden bg-gray-100 flex">
          <div className="relative my-auto">
            <img
              ref={imageRef}
              src={frameImageUrl}
              alt="Banner frame"
              className="w-full h-auto select-none"
            />
            {/* Avatar Preview */}
            {payload.configuration?.avatar && (
              <div
                className="absolute bg-cover bg-center pointer-events-none bg-black/20 border-2 border-dashed border-white/50"
                style={{
                  left: payload.configuration.avatar.x * scale,
                  top: payload.configuration.avatar.y * scale,
                  width: payload.configuration.avatar.width * scale,
                  height: payload.configuration.avatar.height * scale,
                  backgroundImage: `url(${AVATAR_PLACEHOLDER})`,
                  borderRadius:
                    payload.configuration.avatar.shape === "circle"
                      ? "50%"
                      : "0",
                }}
              />
            )}
            {/* Text Elements Preview */}
            {payload.configuration?.textElements?.map((el) => (
              <div
                key={el.id}
                className="absolute"
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
                {el.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
