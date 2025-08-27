import {
  ICreateBannerPayload,
  IUserEventForBanner,
} from "@/app/models/IBanner";
import { Dispatch, SetStateAction, Fragment } from "react";
import ComponentLoader from "../Loader/ComponentLoader";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";

interface Step1Props {
  payload: Partial<ICreateBannerPayload>;
  setPayload: Dispatch<SetStateAction<Partial<ICreateBannerPayload>>>;
  setFrameImageFile: Dispatch<SetStateAction<File | null>>;
  framePreviewUrl: string | null;
  setFramePreviewUrl: Dispatch<SetStateAction<string | null>>;
  userEvents: IUserEventForBanner[];
  isLoadingEvents: boolean;
}

export const Step1BasicInfo = ({
  payload,
  setPayload,
  setFrameImageFile,
  framePreviewUrl,
  setFramePreviewUrl,
  userEvents,
  isLoadingEvents,
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

  const noneEvent: IUserEventForBanner = { id: "none", title: "None" };
  const eventOptions = [noneEvent, ...userEvents];
  const selectedEvent =
    eventOptions.find((e) => e.id === payload.eventId) || noneEvent;

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

      {/* New Event Link Dropdown */}
      <div className="mt-6">
        <label
          htmlFor="event"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Link to Event (Optional)
        </label>
        {isLoadingEvents ? (
          <div className="flex items-center gap-2 text-gray-500">
            <ComponentLoader isSmallLoader />
            <span>Loading your events...</span>
          </div>
        ) : eventOptions.length > 1 ? (
          <Listbox
            value={selectedEvent}
            onChange={(event) => {
              setPayload((p) => ({
                ...p,
                eventId: event.id === "none" ? undefined : event.id,
              }));
            }}
          >
            <div className="relative mt-1">
              <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
                <span className="block truncate">
                  {selectedEvent.title == "None"
                    ? "Select Event"
                    : selectedEvent.title}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronsUpDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {eventOptions.map((event) => (
                    <ListboxOption
                      key={event.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-indigo-100 text-indigo-900"
                            : "text-gray-900"
                        }`
                      }
                      value={event}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {event.title}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        ) : (
          <div className="p-4 text-center bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">
              You do not have any upcoming events.
            </p>
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Linking a banner to an event will make it more visible to attendees.
        </p>
      </div>
    </div>
  );
};
