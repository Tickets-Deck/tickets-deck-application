import {
  IBannerConfiguration,
  ICreateBannerPayload,
  IAvatarConfig,
} from "@/app/models/IBanner";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

interface Step2Props {
  payload: Partial<ICreateBannerPayload>;
  setPayload: Dispatch<SetStateAction<Partial<ICreateBannerPayload>>>;
  frameImageUrl: string | null;
}

const AVATAR_PLACEHOLDER = "/images/avatar-placeholder.png";

export const Step2AvatarConfig = ({
  payload,
  setPayload,
  frameImageUrl,
}: Step2Props) => {
  const [avatarConfig, setAvatarConfig] = useState<IAvatarConfig>(
    payload.configuration?.avatar || {
      x: 50,
      y: 50,
      width: 450,
      height: 450,
      shape: "circle",
    }
  );
  // New state and ref for calculating the scale factor
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  // Update parent state when local config changes
  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        avatar: avatarConfig,
      } as IBannerConfiguration,
    }));
  }, [avatarConfig, setPayload]);

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

  const handleShapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShape = e.target.value as "circle" | "square";
    setAvatarConfig((prev) => ({ ...prev, shape: newShape }));
  };

  if (!frameImageUrl) {
    return (
      <div className="text-center text-red-500">
        Please go back to Step 1 and upload a frame image first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Avatar Configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Set the shape, then drag and resize the placeholder avatar on the
          canvas.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Avatar Shape
        </label>
        <div className="flex items-center gap-x-6">
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input
              type="radio"
              name="avatarShape"
              value="circle"
              checked={avatarConfig.shape === "circle"}
              onChange={handleShapeChange}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-sm text-gray-700">Circle</span>
          </label>
          <label className="flex items-center gap-x-2 cursor-pointer">
            <input
              type="radio"
              name="avatarShape"
              value="square"
              checked={avatarConfig.shape === "square"}
              onChange={handleShapeChange}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-sm text-gray-700">Square</span>
          </label>
        </div>
      </div>

      {/* Visual Editor Canvas */}
      <div className="relative w-full max-w-2xl mx-auto border rounded-md overflow-hidden">
        {/* Layer 1: The original, full-opacity banner frame */}
        <img
          ref={imageRef}
          src={frameImageUrl}
          alt="Banner frame"
          className="w-full h-auto select-none"
        />
        {/* Layer 2: The resizable and draggable overlay/mask */}
        <Rnd
          size={{
            width: avatarConfig.width * scale,
            height: avatarConfig.height * scale,
          }}
          position={{ x: avatarConfig.x * scale, y: avatarConfig.y * scale }}
          onDragStop={(e, d) => {
            // Un-scale before saving
            setAvatarConfig((prev) => ({
              ...prev,
              x: d.x / scale,
              y: d.y / scale,
            }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            // Un-scale before saving
            setAvatarConfig((prev) => ({
              ...prev,
              width: parseInt(ref.style.width, 10) / scale,
              height: parseInt(ref.style.height, 10) / scale,
              x: position.x / scale,
              y: position.y / scale,
            }));
          }}
          bounds="parent"
          lockAspectRatio={avatarConfig.shape === "circle"}
          className="flex items-center justify-center border-2 border-dashed border-white"
        >
          <div
            className="w-full h-full pointer-events-none"
            style={{
              borderRadius: avatarConfig.shape === "circle" ? "50%" : "0",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            }}
          />
        </Rnd>
      </div>
    </div>
  );
};
