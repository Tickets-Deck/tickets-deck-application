"use client";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Fragment } from "react";
import Button from "../ui/button";

interface MarketplaceAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarketplaceAnnouncement({
  isOpen,
  onClose,
}: MarketplaceAnnouncementProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl md:w-fit transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/20 border border-purple-500/30 text-white shadow-xl transition-all">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Animated background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
                    />
                    <motion.div
                      animate={{
                        rotate: [360, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"
                    />
                  </div>

                  <div className="relative z-10 p-8 pt-10 text-center">
                    {/* Title Section */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="mb-6"
                    >
                      <div className="flex justify-center mb-4">
                        <motion.div
                          //   animate={{
                          //     rotate: [0, 10, -10, 0],
                          //     scale: [1, 1.1, 1],
                          //   }}
                          //   transition={{
                          //     duration: 2,
                          //     repeat: Number.POSITIVE_INFINITY,
                          //     ease: "easeInOut",
                          //   }}
                          className="text-6xl"
                        >
                          🎉
                        </motion.div>
                      </div>

                      <DialogTitle
                        as="h1"
                        className="text-2xl md:text-2xl font-bold mb-2 md:max-w-[70%] mx-auto"
                      >
                        Introducing{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                          Ticketsdeck Events Marketplace
                        </span>
                      </DialogTitle>

                      <div className="flex items-center justify-center gap-2 text-purple-300">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          The Future of Event Planning is Here
                        </span>
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </motion.div>

                    {/* Body Section */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-6 space-y-4 flex flex-col"
                    >
                      <Description
                        as="p"
                        className="text-base text-gray-200 leading-relaxed"
                      >
                        {/* <strong>
                          Now you can do more than buy/create event tickets!
                        </strong>{" "}
                        🎫
                        <br /> */}
                        <strong>
                          Find and book trusted event vendors in one place.
                        </strong>
                      </Description>

                      <p className="text-sm text-gray-300 leading-relaxed md:w-[80%] mx-auto">
                        From DJs and MCs to decorators and caterers, they're
                        ready to bring your event to life. 🎵🎤🎨
                      </p>

                      <p className="text-sm text-gray-300 leading-relaxed md:w-[80%] mx-auto">
                        Or, if you provide event services, list your offering,
                        set your rates, and get booked instantly. 💼✨
                      </p>

                      <p className="text-purple-200 font-light italic text-sm mt-4 p-1 bg-purple-900/30 rounded-lg border border-purple-500/30 w-fit mx-auto">
                        The entire event experience, now under one roof. 🏠
                      </p>
                    </motion.div>

                    {/* CTA Buttons Section */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/25"
                            onClick={() => {
                              onClose();
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <span>Become a Vendor</span>
                              <span className="text-xs text-purple-200">
                                (for people offering services)
                              </span>
                            </div>
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="w-full sm:w-auto border-2 border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white font-semibold px-8 py-3 rounded-xl bg-transparent"
                            onClick={() => {
                              onClose();
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <span>Join Waitlist</span>
                              <span className="text-xs opacity-80">
                                (for people looking to book)
                              </span>
                            </div>
                          </Button>
                        </motion.div>
                      </div>

                      <p className="text-sm text-gray-400 mt-4">
                        🎯 Be among the first to experience the future of event
                        planning
                      </p>
                    </motion.div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500"></div>
                </motion.div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
