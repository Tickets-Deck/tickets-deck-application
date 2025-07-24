import {
  IBannerConfiguration,
  ICreateBannerPayload,
  ITextElementConfig,
} from "@/app/models/IBanner";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { v4 as uuidv4 } from "uuid";
import { Trash2, PlusCircle } from "lucide-react";

interface Step3Props {
  payload: Partial<ICreateBannerPayload>;
  setPayload: Dispatch<SetStateAction<Partial<ICreateBannerPayload>>>;
  frameImageUrl: string | null;
}

export const Step3TextConfig = ({
  payload,
  setPayload,
  frameImageUrl,
}: Step3Props) => {
  const [textElements, setTextElements] = useState<ITextElementConfig[]>(
    payload.configuration?.textElements || []
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  // New state and ref for calculating the scale factor
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const selectedElement = textElements.find(
    (el) => el.id === selectedElementId
  );

  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        textElements: textElements,
      } as IBannerConfiguration,
    }));
  }, [textElements, setPayload]);

  // This effect calculates the scale factor of the rendered image vs its natural size
  useEffect(() => {
    const calculateScale = () => {
      if (imageRef.current) {
        const { naturalWidth, offsetWidth } = imageRef.current;
        // Ensure naturalWidth is not 0 to avoid division by zero errors
        if (naturalWidth > 0) {
          setScale(offsetWidth / naturalWidth);
        }
      }
    };

    const imageElement = imageRef.current;
    if (!imageElement) return;

    // Calculate scale after the image has loaded
    imageElement.onload = calculateScale;
    // Also calculate if the image is already loaded (e.g., from cache)
    if (imageElement.complete) {
      calculateScale();
    }

    // Use a ResizeObserver to recalculate scale if the window size changes
    const resizeObserver = new ResizeObserver(calculateScale);
    resizeObserver.observe(imageElement);

    // Cleanup observer on component unmount
    return () => resizeObserver.disconnect();
  }, [frameImageUrl]); // Rerun if the image source changes

  const handleAddText = () => {
    const newId = uuidv4();
    const newElement: ITextElementConfig = {
      id: newId,
      text: "New Text",
      x: 20,
      y: 20,
      fontSize: 200,
      color: "#000000",
      fontFamily: "sans-serif",
      fontWeight: "normal",
      textAlign: "left",
    };
    setTextElements([...textElements, newElement]);
    setSelectedElementId(newId);
  };

  const handleUpdateElement = (
    id: string,
    newProps: Partial<ITextElementConfig>
  ) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const handleRemoveElement = (id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
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
          Text Configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Add text elements, then drag them to position. Select an element to
          edit its style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Controls */}
        <div className="md:col-span-1 space-y-4">
          <button
            type="button"
            onClick={handleAddText}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle size={18} />
            Add Text Element
          </button>

          {/* Property Editor */}
          {selectedElement && (
            <div className="p-4 border rounded-md space-y-4">
              <h4 className="font-semibold">Edit Text</h4>
              <div>
                <label className="text-sm">Text</label>
                <input
                  type="text"
                  value={selectedElement.text}
                  onChange={(e) =>
                    handleUpdateElement(selectedElement.id, {
                      text: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm">Size</label>
                  <input
                    type="number"
                    value={selectedElement.fontSize}
                    onChange={(e) =>
                      handleUpdateElement(selectedElement.id, {
                        fontSize: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="text-sm">Color</label>
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      handleUpdateElement(selectedElement.id, {
                        color: e.target.value,
                      })
                    }
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveElement(selectedElement.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md"
              >
                <Trash2 size={16} />
                Remove Element
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Canvas */}
        <div className="md:col-span-2 relative w-full mx-auto border rounded-md overflow-hidden bg-gray-100">
          <img
            ref={imageRef}
            src={frameImageUrl}
            alt="Banner frame"
            className="w-full h-auto select-none"
          />
          {/* Avatar Imprint/Guide */}
          {payload.configuration?.avatar && (
            <div
              className="absolute pointer-events-none bg-black/20 border-2 border-dashed border-white/50"
              style={{
                left: payload.configuration.avatar.x * scale,
                top: payload.configuration.avatar.y * scale,
                width: payload.configuration.avatar.width * scale,
                height: payload.configuration.avatar.height * scale,
                borderRadius:
                  payload.configuration.avatar.shape === "circle" ? "50%" : "0",
              }}
            />
          )}
          {textElements.map((el) => (
            <Rnd
              key={el.id}
              position={{ x: el.x * scale, y: el.y * scale }}
              onDragStop={(e, d) =>
                // Un-scale the coordinates before saving to state
                handleUpdateElement(el.id, { x: d.x / scale, y: d.y / scale })
              }
              onClick={() => setSelectedElementId(el.id)}
              className={`box-border ${
                selectedElementId === el.id
                  ? "border-2 border-dashed border-blue-500"
                  : "border-2 border-dashed border-transparent"
              }`}
              bounds="parent"
              disableResizing
            >
              <span
                style={{
                  fontSize: `${el.fontSize * scale}px`,
                  color: el.color,
                  fontFamily: el.fontFamily,
                  fontWeight: el.fontWeight as any,
                }}
                className="whitespace-nowrap"
              >
                {el.text}
              </span>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
};
