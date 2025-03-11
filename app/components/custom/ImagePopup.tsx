"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "../ui/icons"
import Image from "next/image"

interface ImagePopupProps {
  imageUrl: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImagePopup({ imageUrl, alt, isOpen, onClose }: ImagePopupProps) {
  // Handle ESC key press to close the popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              onClick={onClose}
              aria-label="Close image popup"
            >
              <Icons.Close className="[&_path]:stroke-white w-5 h-5" />
            </button>

            <motion.div className="relative w-full h-[80vh] overflow-hidden rounded-lg" layoutId="expandable-image">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={alt}
                className="object-contain w-full h-full max-h-[80vh]"
                fill
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}