"use client"
import CheckInModal from "@/app/components/Modal/CheckInModal";
import { useSession } from "next-auth/react";
import { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import jsQR from 'jsqr';
import { useCheckInTicketOrder, useFetchEventById } from "@/app/api/apiClient";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"
import { ApplicationError } from "@/app/constants/applicationError";
import { FullPageLoader } from "@/app/components/Loader/ComponentLoader";
import { MultipleTickets } from "@/app/models/ICheckIn";

interface CheckInPageProps {

}

const CheckInPage: FunctionComponent<CheckInPageProps> = (): ReactElement => {

    const checkInTicketOrder = useCheckInTicketOrder();
    const {data: session} = useSession();

    const searchParams = useSearchParams();
    const eventId = searchParams.get('id');
    const eventTitle = searchParams.get('name')?.replace(/-/g, ' ');

    const [multipleCheckInModalVisibility, setMultipleCheckInModalVisibility] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [scannedAccessCode, setScannedAccessCode] = useState<string | null>(null);
    const [typedAccessCode, setTypedAccessCode] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [beginScan, setBeginScan] = useState(false);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    
    const [multipleTickets, setMultipleTickets] = useState<MultipleTickets[]>();
    const [ticketOrderAccessCode, setTicketOrderAccessCode] = useState<string | null>(null);

    const handleAccessCodeValidation = async () => {

        setIsCheckingIn(true);
        setTicketOrderAccessCode(scannedAccessCode);

        await checkInTicketOrder(session?.user.token as string, scannedAccessCode as string, eventId as string)
            .then((response) => {
                console.log("Check in response: ", response);
                if (response.data) {
                    setMultipleTickets(response.data);
                    return;
                }
                toast.success("Check-in successful");
            })
            .catch((error) => {
                console.log("Check in error: ", error);
                if (error?.response) {
                    console.log("Error response: ", error.response);
                    if (error.response.data.errorCode == ApplicationError.TicketOrderWithIdNotFound.Code) {
                        toast.error("Invalid event access code");
                        return;
                    }
                    if (error.response.data.errorCode == ApplicationError.TicketOrderHasBeenCheckedIn.Code) {
                        toast.error("This ticket order has been checked in.");
                        return;
                    }
                    toast.error("An error occurred while checking in. Please try again.");
                }
            })
            .finally(() => {
                setIsCheckingIn(false);
                setScannedAccessCode(null);
                setTypedAccessCode(null);
            })
    };

    // const handleFetchEventById = async () => {}

    useEffect(() => {
        if (!beginScan) return;

        const startCamera = async () => {
            try {
                // Access the camera
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute('playsinline', 'true');
                    videoRef.current.play();
                }

                // Start scanning
                scanQRCode();
            } catch (error) {
                console.error('Error accessing the camera', error);
            }
        };

        const scanQRCode = () => {
            const video = videoRef.current;
            if (!video) return;

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const tick = () => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    if (context) {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);

                        if (code) {
                            // console.log("QR CODE found: ", code);
                            validateQrData(code.data);
                            // setScannedAccessCode(code.data); // QR code data found
                            setBeginScan(false);
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
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [beginScan]);

    const validateQrData = (data: string) => {
        // Regex to check if the data is alphanumeric
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (alphanumericRegex.test(data)) {
            setScannedAccessCode(data);
            setScanError(null);
        } else {
            setScannedAccessCode(null);
            setScanError('Scanned code is invalid.');
            toast.error("Scanned code is invalid.");
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
    }, [multipleTickets])

    useEffect(() => { 
        if (!multipleCheckInModalVisibility) {
            setTicketOrderAccessCode(null);
        }
    }, [multipleCheckInModalVisibility])

    return (
        <main className="px-4 py-8 min-h-screen">
            <div className="mb-5">
                <h2 className="text-2xl font-medium text-gray-300">{eventTitle} Attendees Check-In</h2>
            </div>
            <div className="flex flex-col mb-5">
                <p className="mb-1">Please scan attendee QR code to continue</p>
                <button
                    onClick={() => setBeginScan(true)}
                    className="h-24 w-full md:w-1/3 bg-primary-color-sub/30 border-dashed border-primary-color-sub border-[1.5px] rounded-xl hover:bg-primary-color-sub/50">
                    Scan
                </button>
            </div>
            <div className="flex flex-col mb-5">
                <p className="mb-1">Or enter attendee access code below to continue</p>
                <div className="flex flex-row gap-2 items-center">
                    <input
                        className="p-2 border-[1px] border-solid border-grey/30 bg-grey/10 rounded-lg"
                        type="text"
                        placeholder="Event ID"
                        name={"eventId"}
                        value={typedAccessCode ?? ""}
                        onChange={(e) => setTypedAccessCode(e.target.value)}
                    />
                    <button
                        // disabled={}
                        className="text-sm w-fit bg-white text-black/80 px-4 py-2 rounded-full hover:bg-white/80 transition-all"
                        onClick={() => setScannedAccessCode(typedAccessCode)}>
                        Continue
                    </button>
                </div>
            </div>

            {scanError && <p className="text-red-500">{scanError}</p>}
            {scannedAccessCode && <p className="text-primary-color-sub-50">Check-in attendee with access code: {scannedAccessCode}</p>}

            {
                beginScan &&
                <div className="absolute w-full h-full top-0 left-0 z-20 flex flex-col items-center justify-center gap-3 bg-dark-grey/50">
                    <video
                        ref={videoRef}
                        className="w-[80%] h-[70%] border-primary-color-sub border-[1px] rounded-xl object-cover"
                        style={{
                            // width: '100%',
                            // height: 'auto',
                            // border: '1px solid black', // Add a border for visibility
                            display: 'block',
                        }}
                    />
                    <button
                        onClick={() => setBeginScan(true)}
                        className="text-sm w-fit bg-white text-black/80 px-4 py-2 rounded-full hover:bg-white/80 transition-all">
                        Stop Scan
                    </button>
                </div>
            }
            {
                isCheckingIn &&
                <div className="absolute w-full h-full top-0 left-0 z-20 flex flex-col items-center justify-center gap-0 bg-dark-grey/50">
                    <FullPageLoader />
                    <p>Checking in...</p>
                </div>
            }

            <CheckInModal
                visibility={multipleCheckInModalVisibility}
                setVisibility={setMultipleCheckInModalVisibility}
                multipleTickets={multipleTickets}
                ticketOrderAccessCode={ticketOrderAccessCode}
                eventId={eventId}
            />
        </main>
    );
}

export default CheckInPage;