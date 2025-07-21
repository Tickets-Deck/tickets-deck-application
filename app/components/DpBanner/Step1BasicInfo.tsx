import { ICreateBannerPayload } from "@/app/models/IBanner";
import { Dispatch, SetStateAction, useState } from "react";
import { HorizontalLoader } from "../Loader/HorizontalLoader";

interface Step1Props {
  payload: Partial<ICreateBannerPayload>;
  setPayload: Dispatch<SetStateAction<Partial<ICreateBannerPayload>>>;
  setFrameImageFile: Dispatch<SetStateAction<File | null>>;
  framePreviewUrl: string | null;
  setFramePreviewUrl: Dispatch<SetStateAction<string | null>>;
}

export const Step1BasicInfo = ({
  payload,
  setPayload,
  setFrameImageFile,
  framePreviewUrl,
  setFramePreviewUrl,
}: Step1Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrameImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFramePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Banner Title
        </label>
        <input
          id="title"
          type="text"
          value={payload.title || ""}
          onChange={(e) => setPayload({ ...payload, title: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., My Awesome Campaign"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={payload.description || ""}
          onChange={(e) =>
            setPayload({ ...payload, description: e.target.value })
          }
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="A short description of what this banner is for."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Frame Image
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            {framePreviewUrl ? (
              <img
                src={framePreviewUrl}
                alt="Frame preview"
                className="mx-auto h-48 w-auto"
              />
            ) : (
              <p className="text-gray-500">Image preview will appear here</p>
            )}
            <div className="mt-4 flex w-fit mx-auto text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG up to 10MB
            </p>
            {/* <div className="mt-4 space-y-2">
              <p className="text-sm text-center text-gray-600">
                Publishing banner, please wait...
              </p>
              <HorizontalLoader />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
