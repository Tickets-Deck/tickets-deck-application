"use client"

import { useState } from "react"
import { Icons } from "../ui/icons"
import Image from "next/image"
import ReviewModal from "../Modal/ReviewModal"

export type Review = {
    id: string
    rating: number
    reviewText: string
    eventAttended: string
    eventName: string
    reviewerName: string
    reviewerImage?: string
    date: Date
}

// Simple function to format dates relative to now
function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return "just now"
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
        return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
    }

    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
}

const orientation: 'horizontal' | 'vertical' = 'horizontal';

// Sample initial reviews
const initialReviews: Review[] = []

export function ReviewsTab({ organizerName }: { organizerName: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [reviews, setReviews] = useState<Review[]>(initialReviews)

    const handleReviewSubmit = (newReview: Omit<Review, "id" | "reviewerName" | "reviewerImage" | "date">) => {
        // In a real app, this would be handled by a server action or API call
        // Here we're just simulating adding the review to the list
        const fullReview: Review = {
            ...newReview,
            id: `review-${Date.now()}`,
            reviewerName: "Current User", // In a real app, this would be the logged-in user
            reviewerImage: "/placeholder.svg?height=40&width=40", // User's avatar
            date: new Date(),
        }

        setReviews([fullReview, ...reviews])
    }

    return (
        <div className="space-y-6">
            {/* Review submission button */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <button onClick={() => setIsModalOpen(true)} className="tertiaryButton">
                    Write a Review
                </button>
            </div>

            {/* Reviews list */}
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {/* Review stats */}
                    <div className="bg-muted/30 rounded-lg p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold">
                                    {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Icons.Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length)
                                                ? "fill-primary-color text-primary-color"
                                                : "text-white"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-white mt-1">
                                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                                </span>
                            </div>
                            <div className="h-12 w-px bg-border hidden md:block"></div>
                            <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = reviews.filter((review) => review.rating === rating).length
                                    const percentage = (count / reviews.length) * 100
                                    return (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-sm w-3">{rating}</span>
                                            <div className="h-2 bg-muted w-32 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-color rounded-full" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <span className="text-xs text-white">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-sm text-white mb-2">Was this organizer helpful?</p>
                            <button className="hover:border-primary-color/50 hover:text-primary-color">
                                <Icons.ThumbsUp className="h-4 w-4 mr-2" />
                                Recommend
                            </button>
                        </div>
                    </div>

                    {/* Individual reviews */}
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="space-y-4">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-32 w-32 border-4 border-text-grey relative rounded-full overflow-hidden">
                                            <Image
                                                src="https://placehold.co/300x300/8133F1/FFFFFF/png?text=SA"
                                                alt="Similoluwa Afolabi"
                                                fill
                                                sizes="auto"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium">{review.reviewerName}</div>
                                            <div className="text-sm text-white">{formatRelativeTime(review.date)}</div>
                                        </div>
                                    </div>
                                    {/* <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">More options</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Flag className="h-4 w-4 mr-2" />
                                                Report review
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu> */}
                                </div>

                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Icons.Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= review.rating ? "fill-primary-color text-primary-color" : "text-white"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm text-white mb-2">Event: {review.eventName}</div>
                                    <p className="text-sm">{review.reviewText}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="h-8 hover:text-primary-color">
                                        <Icons.ThumbsUp className="h-3 w-3 mr-1" />
                                        Helpful
                                    </button>
                                </div>

                                {/* <Separator className="bg-border/40" /> */}
                                <span className={`shrink-0 bg-border ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"}`} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white/10 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                    <p className="text-white/80">Be the first to leave a review for this organizer</p>
                </div>
            )}

            <ReviewModal
                modalVisibility={isModalOpen}
                setModalVisibility={setIsModalOpen}
                organizerName={organizerName}
            />
        </div>
    )
}
