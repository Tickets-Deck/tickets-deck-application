"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import images from "@/public/images"
import { Icons } from "../ui/icons"

type Testimonial = {
    id: number
    name: string
    role: string
    avatar: string
    content: string
    rating: number
}

interface TestimonialsProps {
    testimonials: Testimonial[]
    autoScrollInterval?: number
}

export default function Testimonials({
    testimonials,
    autoScrollInterval = 5000, // 5 seconds by default
}: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Calculate how many testimonials to show based on screen size
    const [itemsPerView, setItemsPerView] = useState(3)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1)
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2)
            } else {
                setItemsPerView(3)
            }
        }

        // Set initial value
        handleResize()

        // Add event listener
        window.addEventListener("resize", handleResize)

        // Clean up
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const startAutoScroll = () => {
        if (timerRef.current) clearInterval(timerRef.current)

        timerRef.current = setInterval(() => {
            if (!isPaused) {
                setDirection(1)
                setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - itemsPerView ? 0 : prevIndex + 1))
            }
        }, autoScrollInterval)
    }

    useEffect(() => {
        startAutoScroll()
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isPaused, testimonials.length, itemsPerView, autoScrollInterval])

    const handleNext = () => {
        setIsPaused(true)
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - itemsPerView ? 0 : prevIndex + 1))

        // Resume auto-scrolling after 5 seconds of inactivity
        setTimeout(() => setIsPaused(false), 5000)
    }

    const handlePrev = () => {
        setIsPaused(true)
        setDirection(-1)
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - itemsPerView : prevIndex - 1))

        // Resume auto-scrolling after 5 seconds of inactivity
        setTimeout(() => setIsPaused(false), 5000)
    }

    // Variants for the container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    // Variants for the testimonial cards
    const cardVariants = {
        hidden: (custom: number) => ({
            x: custom > 0 ? 100 : -100,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
            },
        },
        exit: (custom: number) => ({
            x: custom > 0 ? -100 : 100,
            opacity: 0,
            transition: { duration: 0.3 },
        }),
    }

    // Get visible testimonials based on current index and items per view
    const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView)

    // If we don't have enough testimonials to fill the view, add from the beginning
    if (visibleTestimonials.length < itemsPerView) {
        const remaining = itemsPerView - visibleTestimonials.length
        visibleTestimonials.push(...testimonials.slice(0, remaining))
    }

    return (
        <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <AnimatePresence custom={direction} mode="wait">
                <motion.div
                    key={currentIndex}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    custom={direction}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {visibleTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={`${testimonial.id}-${index}`}
                            custom={direction}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-full"
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-12 h-12 rounded-full overflow-hidden relative">
                                    <Image
                                        alt="User avatar"
                                        src={images.user_avatar}
                                        fill
                                    />
                                </span>
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Icons.Star
                                        key={i}
                                        className={`h-4 w-4 ${i < testimonial.rating ? "" : "[&_path]:!fill-gray-500"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-300">"{testimonial.content}"</p>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-center mt-8 gap-4">
                <button
                    onClick={handlePrev}
                    className="rounded-full bg-grey/50 grid place-items-center border-gray-500 min-w-10 min-h-10 hover:bg-purple-900/20 hover:border-purple-500"
                >
                    <Icons.ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Previous</span>
                </button>

                <button
                    onClick={handleNext}
                    className="rounded-full bg-grey/50 grid place-items-center border-gray-500 min-w-10 min-h-10 hover:bg-purple-900/20 hover:border-purple-500"
                >
                    <Icons.ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Next</span>
                </button>
            </div>

            {/* Pagination indicators */}
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsPaused(true)
                            setCurrentIndex(index * itemsPerView)
                            setTimeout(() => setIsPaused(false), 5000)
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${Math.floor(currentIndex / itemsPerView) === index ? "bg-purple-500 w-6" : "bg-gray-600 hover:bg-gray-500"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar for auto-scroll */}
            <div className="mt-4 max-w-xs mx-auto">
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-purple-600"
                        initial={{ width: "0%" }}
                        animate={{ width: isPaused ? "0%" : "100%" }}
                        transition={{
                            duration: autoScrollInterval / 1000,
                            ease: "linear",
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

