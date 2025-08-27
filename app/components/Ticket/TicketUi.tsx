import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
  useRef,
} from "react";
import Image from "next/image";
import { TicketPass } from "@/app/models/ITicketPass";
import moment from "moment";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { buildCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { formatStoredDate } from "@/utils/dateformatter";

interface TicketUiProps {
  ticketInfo: TicketPass;
  setIsTicketVisible?: Dispatch<SetStateAction<boolean>>;
}

const TicketUi: FunctionComponent<TicketUiProps> = ({
  ticketInfo,
  setIsTicketVisible,
}): ReactElement => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const captureTicketForDownload = async () => {
    if (pdfRef.current) {
      try {
        // Capture the div as a canvas
        const canvas = await html2canvas(pdfRef.current, {
          useCORS: true, // Allow cross-origin images
          scale: 2, // Increase resolution
        });
        const image = canvas.toDataURL("image/png");
        saveAs(
          image,
          `${ticketInfo.eventInfo.title}-${ticketInfo.ticketType}` + ".png"
        );

        // Create an anchor element to download the image
        // const link = document.createElement('a');
        // link.href = image;
        // link.download = `${ticketInfo.eventInfo.title}-${ticketInfo.ticketType}` + '.png';
        // document.body.appendChild(link); // Append the link to the body
        // link.click(); // Trigger the download
        // document.body.removeChild(link); // Remove the link after download
      } catch (error) {
        console.error("Error capturing or downloading the image:", error);
      }
    } else {
    }
  };

  // const captureTicketForDownload = async (e: MouseEvent) => {
  //     e.preventDefault();

  //     await domtoimage.toJpeg(pdfRef.current as Node)
  //         .then((dataUrl) => {
  //             saveAs(dataUrl, 'Ticket.png');
  //         })
  // }

  return (
    <div className="flex flex-col">
      <div
        className="w-full md:w-[450px] mx-auto bg-white rounded-2xl border border-text-grey/20"
        id="capture"
        ref={pdfRef}
      >
        <div className="flex flex-col p-4">
          <h3 className="text-dark-grey text-center py-[0.65rem] font-medium font-MonaSans">
            {ticketInfo.eventInfo.title}
          </h3>
          <div className="w-full h-[140px] relative rounded-[0.85rem] overflow-hidden">
            <Image
              className="object-cover"
              src={buildCloudinaryImageUrl(ticketInfo.eventInfo.mainImageUrl)}
              fill
              alt="Event flyer"
            />
          </div>
        </div>
        <div className="bg-primary-color text-white flex flex-col items-center justify-center py-2">
          <h1 className="text-xl">{ticketInfo.ticketType}</h1>
        </div>
        <div className="flex flex-col p-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-black mb-2">
            <div className="flex flex-col w-full">
              <div className="flex flex-row gap-5 mb-2">
                <div>
                  <h5 className="text-text-grey mb-[0.15rem] font-medium">
                    Date:
                  </h5>
                  <p className="text-sm text-dark-grey mb-2">
                    {formatStoredDate(
                      ticketInfo.eventInfo.startDate,
                      "Do of MMM YYYY"
                    )}
                  </p>
                </div>
                <div>
                  <h5 className="text-text-grey mb-[0.15rem] font-medium">
                    Time:
                  </h5>
                  <p className="text-sm text-dark-grey mb-2">
                    {formatStoredDate(
                      ticketInfo.eventInfo.startDate,
                      "hh:mm a"
                    )}
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <h5 className="text-text-grey mb-[0.15rem] font-medium">
                  Location:
                </h5>
                <p className="text-sm text-dark-grey mb-2 capitalize">
                  {ticketInfo.eventInfo.venue}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="size-[120px] relative overflow-hidden mb-1">
                {ticketInfo.qr}
                {/* <QRCode value={ticketInfo.qr} /> */}
                {/* <Image src={ticketInfo.qr} alt="QR code" /> */}
              </div>
              {/* <p>Order code: BY45CZ</p> */}
            </div>
          </div>
          <p className="text-base text-black text-center">
            Order #{ticketInfo.orderId}
          </p>
        </div>
      </div>
      <div className="flex flex-row mx-auto mt-2 gap-3">
        {setIsTicketVisible && (
          <button
            className="bg-white text-dark-grey py-2 px-4 rounded-full"
            onClick={() => setIsTicketVisible(false)}
          >
            Close
          </button>
        )}
        <button
          className="bg-primary-color text-white py-2 px-4 rounded-full"
          onClick={(e) => captureTicketForDownload()}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default TicketUi;
