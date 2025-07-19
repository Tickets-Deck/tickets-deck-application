"use client";

import type React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalWrapper from "../../Modal/ModalWrapper";
import BasicDateTimePicker from "../../custom/DateTimePicker";
import moment from "moment";
import { UpdateEventRequest } from "@/app/models/IEvents";
import { Icons } from "../../ui/icons";
import EventDescriptionEditor from "../../Editor/EventDescription";
import Image from "next/image";
import { buildCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

interface EditEventModalProps {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
  initialData: UpdateEventRequest;
  handleUpdateEventInfo: (
    updatedEventInfo: UpdateEventRequest & { mainImageFile: File | undefined },
    toastMessage?: string
  ) => Promise<void>;
}

export function EditEventModal({
  modalVisibility,
  setModalVisibility,
  initialData,
  handleUpdateEventInfo,
}: EditEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [eventRequest, setEventRequest] = useState<UpdateEventRequest>();
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mainImageBase64Url, setMainImageBase64Url] = useState<string>();
  const [mainImageFile, setMainImageFile] = useState<File>();
  const [mainImageUrl, setMainImageUrl] = useState<string>();

  const handleDateSelect = (
    field: keyof UpdateEventRequest,
    date: Date | string | undefined
  ) => {
    if (date) {
      setEventRequest((prev) => ({
        ...(prev as UpdateEventRequest),
        [field]: date,
      }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (eventRequest?.tags && !eventRequest.tags.includes(newTag.trim())) {
        setEventRequest((prev) => ({
          ...(prev as UpdateEventRequest),
          tags: prev
            ? [...(prev.tags as string[]), newTag.trim()]
            : [newTag.trim()],
        }));
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEventRequest((prev) => ({
      ...(prev as UpdateEventRequest),
      tags: prev?.tags ? prev.tags.filter((tag) => tag !== tagToRemove) : [],
    }));
  };

  /**
   * Function to handle image file upload and update form values
   * @param e is the event handler
   * @returns void
   */
  const handleFileUpload = (e: any) => {
    // Get the selected file
    const selectedFile: File = e.target.files[0];

    // If a valid file was selected...
    if (
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/webp"
    ) {
      // Unset validation message
      // setPhotoErrorMsg(false);

      const file = e.target.files[0]; // Get the selected file

      if (file) {
        setMainImageFile(file);

        // Instantiate a FileReader object
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

          if (base64URL) {
            // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
            const base64String = base64URL.split(",")[1];

            // console.log('base64URL: ', base64String);
            setMainImageBase64Url(base64String);
            setEventRequest({
              ...(eventRequest as UpdateEventRequest),
              mainImageBase64Url: base64String,
              mainImageId: initialData.mainImageId,
            });
          }
        };

        // Read the file as a data URL (base64-encoded)
        reader.readAsDataURL(file);
      }
    }
    // Otherwise...
    else {
      // Set appropriate validation message
      // setPhotoErrorMsg('Please select a valid photo');

      // Exit this method
      return;
    }

    // Set the image url
    const imgURL = URL.createObjectURL(selectedFile);

    // Update the image url state
    setMainImageUrl(imgURL);

    // Clear the error message
    // setImageValidationMessage(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      if (!eventRequest) {
        throw new Error("No event data provided");
      }

      const dataForValidation = {
        ...initialData,
        ...eventRequest,
      };

      const { startDate, endDate, purchaseStartDate, purchaseEndDate } =
        dataForValidation;

      const sDate = startDate ? moment(startDate) : null;
      const eDate = endDate ? moment(endDate) : null;
      const psDate = purchaseStartDate ? moment(purchaseStartDate) : null;
      const peDate = purchaseEndDate ? moment(purchaseEndDate) : null;

      // --- Date Validation Logic ---

      // 1. Basic Sequence Violations
      if (sDate && eDate && eDate.isBefore(sDate)) {
        throw new Error("An event can’t end before it starts.");
      }

      // 2. Zero-Duration Violations
      if (sDate && eDate && eDate.isSame(sDate)) {
        throw new Error(
          "The event must have a duration. Start and end times cannot be the same."
        );
      }
      if (psDate && peDate && peDate.isSame(psDate)) {
        throw new Error(
          "Ticket sales must have a duration. Start and end times cannot be the same."
        );
      }

      // 3. Logical Contradictions (Sales vs. Event)
      if (psDate && eDate && psDate.isAfter(eDate)) {
        throw new Error(
          "You can't start selling tickets for an event that has already ended. Please change the sales start date."
        );
      }

      if (psDate && peDate && peDate.isBefore(psDate)) {
        throw new Error("Ticket sales can’t end before they begin.");
      }

      if (peDate && eDate && peDate.isAfter(eDate)) {
        throw new Error(
          "You can't allow ticket sales to continue after the event has ended."
        );
      }
      if (psDate && sDate && psDate.isAfter(sDate)) {
        throw new Error(
          "You can’t start selling tickets after the event has already started."
        );
      }
      if (peDate && sDate && peDate.isSameOrAfter(sDate)) {
        throw new Error("Ticket sales must end before the event begins.");
      }

      await handleUpdateEventInfo({ ...eventRequest, mainImageFile });

      setModalVisibility(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      if (initialData.tags) {
        setEventRequest((prev) => ({
          ...(prev as UpdateEventRequest),
          tags: initialData.tags,
        }));
      }
    }
  }, [initialData]);

  return (
    <ModalWrapper
      visibility={modalVisibility}
      setVisibility={setModalVisibility}
      disallowOverlayFunction
      styles={{
        backgroundColor: "transparent",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <div className="w-full max-w-full md:w-[500px] md:max-w-[500px] max-h-[86vh] overflow-y-auto scrollbar-none p-6 rounded-lg bg-container-grey">
        <div className="flex flex-row justify-between items-start mb-5">
          <div className="flex flex-col space-y-1">
            <h3 className="text-2xl">Edit Event Details</h3>
            <p className="text-gray-400">
              Make changes to your event&apos;s basic information here.
            </p>
          </div>

          <button
            className="ml-auto w-8 h-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-gray-100/10 [&_svg_path]:stroke-[#fff] fill-[#fff]"
            onClick={() => setModalVisibility(false)}
          >
            <Icons.Close className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="createEventFormField">
              <label htmlFor="title" className="text-sm font-medium block mb-1">
                Event Image
              </label>
              <div
                className={`w-full md:max-w-[300px] mx-auto h-[300px] rounded-2xl overflow-hidden relative after after:bg-black after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:opacity-[0] hover:after:opacity-40 after:transition-all after:duration-300 group`}
              >
                <Image
                  src={
                    mainImageUrl ||
                    buildCloudinaryImageUrl(initialData.mainImageUrl as string)
                  }
                  alt="Event flyer"
                  fill
                  className="object-cover"
                />
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex flex-row gap-3 z-[3]">
                  {mainImageUrl && (
                    <button
                      onClick={() => {
                        setMainImageUrl(undefined);
                        setEventRequest({
                          ...(eventRequest as UpdateEventRequest),
                          mainImageBase64Url: undefined,
                          mainImageId: undefined,
                        });
                      }}
                      className="p-2 px-4 rounded-full flex flex-row gap-2 items-center bg-primary-color text-sm w-fit h-fit whitespace-nowrap hover:bg-white hover:text-primary-color"
                    >
                      <Icons.Undo className="w-4 h-4 [&_path]:stroke-primary-color-sub" />
                      Undo
                    </button>
                  )}
                  <button
                    onClick={() => {}}
                    className="p-2 px-4 rounded-full flex flex-row gap-2 items-center bg-primary-color text-sm w-fit h-fit whitespace-nowrap hover:bg-white hover:text-primary-color"
                  >
                    <input
                      className="imageInput"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <Icons.Upload className="w-4 h-4 [&_path]:stroke-primary-color-sub" />
                    Change Image
                  </button>
                </div>
              </div>
            </div>

            <div className="createEventFormField">
              <label htmlFor="title" className="text-sm font-medium block mb-1">
                Event Title
              </label>
              <input
                id="title"
                value={eventRequest?.title || initialData.title || ""}
                onChange={(e) =>
                  setEventRequest((prev) => ({
                    ...(prev as UpdateEventRequest),
                    title: e.target.value,
                  }))
                }
                className="bg-[#252525] border-gray-700"
                required
              />
            </div>

            <div className="createEventFormField">
              <label
                htmlFor="description"
                className="text-sm font-medium block mb-1"
              >
                Description
              </label>
              <EventDescriptionEditor
                description={
                  eventRequest?.description || initialData.description || ""
                }
                updateDescription={(value) =>
                  setEventRequest({
                    ...(eventRequest as UpdateEventRequest),
                    description: value,
                  })
                }
              />
              {/* <textarea
                                id="description"
                                value={eventRequest.description || ""}
                                onChange={(e) => setEventRequest((prev) => ({ ...prev, description: e.target.value }))}
                                className="bg-[#252525] border-gray-700 min-h-[100px]"
                                required
                            /> */}
            </div>

            <div className="createEventFormField">
              <label className="text-sm font-medium block mb-1">
                Event Start
              </label>
              <div className="">
                <BasicDateTimePicker
                  className="custom-datepicker"
                  defaultValue={
                    eventRequest?.startDate
                      ? moment(eventRequest.startDate)
                      : initialData.startDate
                      ? moment(initialData.startDate)
                      : undefined
                  }
                  onChangeFn={(newValue) => {
                    console.log("🚀 ~ newValue:", newValue);
                    console.log("🚀 ~ newValue:", newValue.toISOString());
                    // Set the form value
                    handleDateSelect("startDate", newValue?.toISOString());
                    // setEventRequest({ ...eventRequest as UpdateEventRequest, startDate: formattedDateForApi(newValue.toDate()) });
                  }}
                  minDate={moment(new Date())}
                />
              </div>
            </div>
            <div className="createEventFormField">
              <label className="text-sm font-medium block mb-1">
                Event End
              </label>
              <div className="">
                <BasicDateTimePicker
                  className="custom-datepicker"
                  defaultValue={
                    eventRequest?.endDate
                      ? moment(eventRequest.endDate)
                      : initialData.endDate
                      ? moment(initialData.endDate)
                      : undefined
                  }
                  onChangeFn={(newValue) => {
                    // Set the form value
                    handleDateSelect("endDate", newValue?.toDate());
                    // setEventRequest({ ...eventRequest as EventRequest, endDate: formattedDateForApi(newValue.toDate()) });
                  }}
                  minDate={moment(eventRequest?.startDate)}
                />
              </div>
            </div>
            <div className="createEventFormField">
              <label className="text-sm font-medium block mb-1">
                Sales Start
              </label>
              <div className="">
                <BasicDateTimePicker
                  className="custom-datepicker"
                  defaultValue={
                    eventRequest?.purchaseStartDate
                      ? moment(eventRequest.purchaseStartDate)
                      : initialData.purchaseStartDate
                      ? moment(initialData.purchaseStartDate)
                      : undefined
                  }
                  onChangeFn={(newValue) => {
                    // Set the form value
                    handleDateSelect("purchaseStartDate", newValue?.toDate());
                  }}
                  minDate={moment(eventRequest?.startDate)}
                />
              </div>
            </div>
            <div className="createEventFormField">
              <label className="text-sm font-medium block mb-1">
                Sales End
              </label>
              <div className="">
                <BasicDateTimePicker
                  className="custom-datepicker"
                  defaultValue={
                    eventRequest?.purchaseEndDate
                      ? moment(eventRequest.purchaseEndDate)
                      : initialData.purchaseEndDate
                      ? moment(initialData.purchaseEndDate)
                      : undefined
                  }
                  onChangeFn={(newValue) => {
                    // Set the form value
                    handleDateSelect("purchaseEndDate", newValue?.toDate());
                  }}
                  minDate={moment(eventRequest?.startDate)}
                />
              </div>
            </div>

            <div className="createEventFormField">
              <label htmlFor="tags" className="text-sm font-medium block mb-1">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-[#252525] border border-gray-700 rounded-md">
                  {eventRequest &&
                    eventRequest.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-900/30 text-purple-300 border-purple-700 gap-1 pl-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-purple-100 focus:outline-none"
                        >
                          <Icons.Close className="h-3 w-3" />
                          <span className="sr-only">Remove {tag} tag</span>
                        </button>
                      </span>
                    ))}
                </div>
                <input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter"
                  className="bg-[#252525] border-gray-700"
                />
              </div>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="tertiaryButton !px-4 !py-2 !bg-transparent !text-white"
              onClick={() => setModalVisibility(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tertiaryButton !px-4 !py-2"
              disabled={isLoading}
            >
              {isLoading ? <>Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
