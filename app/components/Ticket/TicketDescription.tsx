import React, { Fragment } from "react";
import {
  Dialog,
  Description,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useState } from "react";
import { RetrievedTicketResponse } from "@/app/models/ITicket";

type Props = {
  ticket: RetrievedTicketResponse;
};

export default function TicketDescription({ ticket }: Props) {
  let [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-[2px] px-[6px] text-xs bg-background text-foreground hover:bg-background/80 rounded-full"
      >
        See details
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
          {/* Overlay */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </TransitionChild>

          {/* Dialog Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="w-full max-w-md rounded-xl bg-[#1A1A1A] p-6 text-white shadow-xl">
                <DialogTitle className="text-lg font-semibold mb-3">
                  {ticket.name} Details
                </DialogTitle>
                <Description className="mb-1 text-sm text-background/60">
                  Ticket Description
                </Description>

                <p
                  dangerouslySetInnerHTML={{
                    __html: (ticket.description || "").replace(/\n/g, "<br/>"),
                  }}
                  className="text-sm text-background"
                />

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-white text-black rounded-md text-sm"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
