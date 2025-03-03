"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "../ui/icons"
import { duration } from "moment"
import Tooltip from "./Tooltip"

export default function SharePopup({ url = "https://events.ticketsdeck.com" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)

    // Handle click outside to close popup
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    // Copy link to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    // Share to social media
    const shareToSocial = (platform: string) => {
        let shareUrl = ""
        const encodedUrl = encodeURIComponent(url)
        const title = encodeURIComponent("Check out this awesome content!")

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                break
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
                break
            case "instagram":
                // Instagram doesn't have a direct share URL, but we can open Instagram
                shareUrl = "https://www.instagram.com/"
                break
            case "telegram":
                shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${title}`
                break
            case "whatsapp":
                shareUrl = `https://api.whatsapp.com/send?text=${title} ${encodedUrl}`
                break
            default:
                return
        }

        window.open(shareUrl, "_blank", "noopener,noreferrer")
    }

    const socialPlatforms = [
        { name: "Facebook", icon: Icons.Facebook, color: "bg-blue-600", hoverColor: "hover:bg-blue-700", platform: "facebook" },
        { name: "Twitter", icon: Icons.Twitter, color: "bg-sky-500", hoverColor: "hover:bg-sky-600", platform: "twitter" },
        { name: "LinkedIn", icon: Icons.LinkedIn, color: "bg-blue-700", hoverColor: "hover:bg-blue-800", platform: "linkedin" },
        {
            name: "Instagram",
            icon: Icons.Instagram,
            color: "bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700",
            hoverColor: "hover:opacity-90",
            platform: "instagram",
        },
        { name: "Telegram", icon: Icons.Telegram, color: "bg-sky-600", hoverColor: "hover:bg-sky-700", platform: "telegram" },
        { name: "Whatsapp", icon: Icons.Whatsapp, color: "bg-green-400", hoverColor: "hover:bg-green-500", platform: "whatsapp" }
    ]

    return (
        <div className="relative inline-block">
            {/* Share button */}
            <Tooltip
                position={"left"}
                tooltipText='Share event'>
                <div
                    className="w-10 h-10 rounded-full bg-[#D5542A] grid place-items-center cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}>
                    <Icons.Share />
                </div>
            </Tooltip>
            {/* <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Share content"
            >
                <Icons.Share className="w-5 h-5" />
            </button> */}

            {/* Share popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={popupRef}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Share this event</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <Icons.Twitter className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Copy link section */}
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                <div className="truncate flex-1 text-sm text-gray-600 dark:text-gray-300">{url}</div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center justify-center p-1.5 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                    aria-label="Copy link"
                                >
                                    {copied ? <Icons.Check className="w-4 h-4 text-green-600" /> : <Icons.Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            {copied && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-green-600 mt-1 ml-1"
                                >
                                    Link copied to clipboard!
                                </motion.p>
                            )}
                        </div>

                        {/* Social media buttons */}
                        <div className="grid grid-cols-5 gap-2">
                            {socialPlatforms.map((platform, index) => (
                                <motion.button
                                    key={platform.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => shareToSocial(platform.platform)}
                                    whileHover={{ translateY: -2, transition: { duration: 0.1, delay: 0 } }}
                                    className={`flex flex-col items-center justify-center p-2 h-11 rounded-lg ${platform.color} ${platform.hoverColor} text-white transition-all duration-200 transform hover:scale-105`}
                                    aria-label={`Share to ${platform.name}`}
                                >
                                    <platform.icon className="w-5 h-5 mb-0" />
                                    {/* <span className="text-xs font-medium">{platform.name}</span> */}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

