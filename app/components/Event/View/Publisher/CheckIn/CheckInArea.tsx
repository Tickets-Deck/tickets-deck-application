"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Button from "@/app/components/ui/button";
import { Icons } from "@/app/components/ui/icons";
import { useCheckInTicketOrder } from "@/app/api/apiClient";
import { ApplicationError } from "@/app/constants/applicationError";
import { MultipleTickets } from "@/app/models/ICheckIn";
import { ToastContext } from "@/app/context/ToastCardContext";
import jsQR from "jsqr";
import { FullPageLoader } from "@/app/components/Loader/ComponentLoader";
import { useSession } from "next-auth/react";
import CheckInModal from "@/app/components/Modal/CheckInModal";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
  checkInTime?: string;
}

interface CheckInAreaProps {
  eventId: string;
  isLive: boolean;
}

export function CheckInArea({ eventId, isLive }: CheckInAreaProps) {
  const checkInTicketOrder = useCheckInTicketOrder();
  const toasthandler = useContext(ToastContext);
  const { data: session } = useSession();

  // const [searchQuery, setSearchQuery] = useState("")
  const [showScanner, setShowScanner] = useState(false);
  // const [recentCheckIns, setRecentCheckIns] = useState<Attendee[]>([])
  const [checkInSuccess, setCheckInSuccess] = useState<boolean | null>(null);

  const [multipleCheckInModalVisibility, setMultipleCheckInModalVisibility] =
    useState(false);
  const [scannedAccessCode, setScannedAccessCode] = useState<string | null>(
    null
  );
  const [typedAccessCode, setTypedAccessCode] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const [multipleTickets, setMultipleTickets] = useState<MultipleTickets[]>();
  const [ticketOrderAccessCode, setTicketOrderAccessCode] = useState<
    string | null
  >(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Mock attendees data - in real app, this would come from your API
  const mockAttendees: Attendee[] = [
    {
      id: "att_1",
      name: "John Doe",
      email: "john@example.com",
      ticketType: "General",
      checkedIn: false,
    },
    {
      id: "att_2",
      name: "Jane Smith",
      email: "jane@example.com",
      ticketType: "VIP",
      checkedIn: true,
      checkInTime: "2025-02-27T16:45:00Z",
    },
  ];

  const handleAccessCodeValidation = async () => {
    setIsCheckingIn(true);
    setTicketOrderAccessCode(scannedAccessCode);

    await checkInTicketOrder(
      session?.user.token as string,
      scannedAccessCode as string,
      eventId as string
    )
      .then((response) => {
        if (response.data) {
          setMultipleTickets(response.data);
          return;
        }
        setCheckInSuccess(true);
        toasthandler?.logSuccess("Success!", "Check-in successful");
      })
      .catch((error) => {
        if (error?.response) {
          if (
            error.response.data.errorCode ==
            ApplicationError.TicketOrderWithIdNotFound.Code
          ) {
            toasthandler?.logError(
              "Error checking in",
              "Invalid event access code"
            );
            return;
          }
          if (
            error.response.data.errorCode ==
            ApplicationError.TicketOrderHasBeenCheckedIn.Code
          ) {
            toasthandler?.logError(
              "Error checking in",
              "This ticket order has been checked in."
            );
            return;
          }
          toasthandler?.logError(
            "Error checking in",
            "An error occurred while checking in. Please try again."
          );
        }
      })
      .finally(() => {
        setIsCheckingIn(false);
        setScannedAccessCode(null);
        setTypedAccessCode(null);
      });
  };

  useEffect(() => {
    if (!showScanner) return;

    // Function to stop the camera
    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    const startCamera = async () => {
      try {
        // Access the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play();
        }

        // Start scanning
        scanQRCode();
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    const scanQRCode = () => {
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const tick = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );

            if (code) {
              validateQrData(code.data);
              // setScannedAccessCode(code.data); // QR code data found
              setShowScanner(false);
              return; // Stop scanning after successful read
            }
          }
        }
        requestAnimationFrame(tick);
      };
      tick();
    };

    startCamera();

    // Cleanup the camera stream when the component unmounts
    return () => {
      // if (videoRef.current && videoRef.current.srcObject) {
      //     const stream = videoRef.current.srcObject as MediaStream;
      //     stream.getTracks().forEach((track) => track.stop());
      // }
      stopCamera();
    };
  }, [showScanner]);

  const validateQrData = (data: string) => {
    // Regex to check if the data is alphanumeric
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (alphanumericRegex.test(data)) {
      setScannedAccessCode(data);
      setScanError(null);
    } else {
      setScannedAccessCode(null);
      setScanError("Scanned code is invalid.");
      toasthandler?.logError("Error scanning", "Scanned code is invalid.");
    }
  };

  useEffect(() => {
    if (!scannedAccessCode || !eventId) return;
    handleAccessCodeValidation();
  }, [scannedAccessCode, eventId]);

  useEffect(() => {
    if (multipleTickets) {
      setMultipleCheckInModalVisibility(true);
    }
  }, [multipleTickets]);

  useEffect(() => {
    if (!multipleCheckInModalVisibility) {
      setTicketOrderAccessCode(null);
    }
  }, [multipleCheckInModalVisibility]);

  if (!isLive) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        <h2 className="text-xl font-medium">Event Check-In</h2>
      </div>

      <div className="bg-[#1e1e1e] border-[2px] border-container-grey p-5 rounded-xl">
        <div className="mb-4">
          <h4 className="text-2xl font-medium">Check In Attendees</h4>
          <p className="text-gray-400">
            Search by access code, or scan ticket QR code
          </p>
        </div>

        <div>
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="h-fit w-full md:w-[40%] relative">
                <input
                  type="text"
                  placeholder="Enter access code"
                  value={typedAccessCode ?? ""}
                  onChange={(e) => setTypedAccessCode(e.target.value)}
                  className="p-3 pl-11 outline-none bg-[#252525] border-gray-700 focus:border-gray-500 rounded-lg w-full h-12"
                />
                <Icons.Search
                  stroke="#fff"
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-6 pointer-events-none"
                />
              </div>

              <div className="ml-auto md:m-0 flex flex-row items-center gap-2">
                <Button
                  minBtn
                  className={`!bg-white !text-black hover:!opacity-50 flex flex-row items-center !gap-1 w-fit text-nowrap ${
                    !typedAccessCode ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => setScannedAccessCode(typedAccessCode)}
                >
                  <Icons.VerifyAccess className="h-4 w-4" />
                  Verify Access Code
                </Button>
                <Button
                  minBtn
                  className="!bg-white !text-black hover:!opacity-50 flex flex-row items-center !gap-1 w-fit text-nowrap"
                  onClick={() => setShowScanner(!showScanner)}
                >
                  <Icons.QrCode className="h-4 w-4" />
                  Scan QR
                </Button>
              </div>
            </div>
            {scanError && <p className="errorMsg">{scanError}</p>}
          </div>

          {/* {showScanner && (
                        <div className="mb-6 p-6 border border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">QR Scanner would appear here</p>
                        </div>
                    )} */}
          {showScanner && (
            <div className="absolute w-full h-full top-0 left-0 z-20 flex flex-col items-center justify-center gap-3 bg-dark-grey/50">
              <video
                ref={videoRef}
                className="w-[80%] h-[70%] border-primary-color-sub border-[1px] rounded-xl object-cover"
                style={{
                  // width: '100%',
                  // height: 'auto',
                  // border: '1px solid black', // Add a border for visibility
                  display: "block",
                }}
              />
              <button
                onClick={() => setShowScanner(false)}
                className="text-sm w-fit bg-white text-black/80 px-4 py-2 rounded-full hover:bg-white/80 transition-all"
              >
                Stop Scan
              </button>
            </div>
          )}
          {isCheckingIn && (
            <div className="absolute w-full h-full top-0 left-0 z-20 flex flex-col items-center justify-center gap-0 bg-dark-grey/50">
              <FullPageLoader />
              <p>Checking in...</p>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-4">
            {scannedAccessCode &&
              mockAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252525]"
                >
                  <div>
                    <p className="font-medium">{attendee.name}</p>
                    <p className="text-sm text-gray-400">{attendee.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-purple-900/30 text-purple-300 border-purple-700">
                        {attendee.ticketType}
                      </span>
                      {attendee.checkedIn && (
                        <span className="bg-green-900/30 text-green-300 border-green-700">
                          Checked In
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => {}}
                    disabled={attendee.checkedIn}
                    className={attendee.checkedIn ? "border-gray-700" : ""}
                  >
                    {attendee.checkedIn ? "Already Checked In" : "Check In"}
                  </Button>
                </div>
              ))}
          </div>

          {/* Recent Check-ins */}
          {/* {recentCheckIns.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Check-ins</h3>
                            <div className="space-y-2">
                                {recentCheckIns.map((attendee) => (
                                    <div
                                        key={`${attendee.id}-${attendee.checkInTime}`}
                                        className="flex items-center justify-between p-2 rounded-md bg-[#252525]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icons.OutlineCheck className="h-4 w-4 text-green-500" />
                                            <span>{attendee.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            {new Date(attendee.checkInTime!).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
        </div>
      </div>

      {/* Check-in Status Animation */}
      {checkInSuccess !== null && (
        <div
          className={`
          fixed bottom-4 right-4 p-4 rounded-lg shadow-lg
          transition-all duration-300 transform
          ${checkInSuccess ? "bg-green-500" : "bg-red-500"}
          ${
            checkInSuccess === null
              ? "translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }
        `}
        >
          <div className="flex items-center gap-2">
            {checkInSuccess ? (
              <>
                <Icons.OutlineCheck className="h-5 w-5" />
                <span>Successfully checked in!</span>
              </>
            ) : (
              <>
                <Icons.OutlineClose className="h-5 w-5" />
                <span>Check-in failed. Please try again.</span>
              </>
            )}
          </div>
        </div>
      )}

      <CheckInModal
        visibility={multipleCheckInModalVisibility}
        setVisibility={setMultipleCheckInModalVisibility}
        multipleTickets={multipleTickets}
        ticketOrderAccessCode={ticketOrderAccessCode}
        eventId={eventId}
      />
    </div>
  );
}
