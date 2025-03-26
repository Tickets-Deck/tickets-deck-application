import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import { Icons } from "@/app/components/ui/icons";
import { useToast } from "@/app/context/ToastCardContext";
import {
    ReactElement,
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useState,
} from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface ReviewModalProps {
    modalVisibility: boolean;
    setModalVisibility: Dispatch<SetStateAction<boolean>>;
    organizerName: string;
}

const ReviewModal: FunctionComponent<ReviewModalProps> = ({
    modalVisibility,
    setModalVisibility,
    organizerName
}): ReactElement => {

    const toastHandler = useToast();

    const [rating, setRating] = useState<number>(0)
    const [hoveredRating, setHoveredRating] = useState<number>(0)
    const [reviewText, setReviewText] = useState<string>("")
    const [eventAttended, setEventAttended] = useState<string>("")

    const handleRatingClick = (selectedRating: number) => {
        setRating(selectedRating)
    }

    const handleRatingHover = (hoveredRating: number) => {
        setHoveredRating(hoveredRating)
    }

    const handleRatingLeave = () => {
        setHoveredRating(0)
    }

    const handleSubmit = () => {
        // Get the event name based on the selected event ID

        // Submit the review
        // onReviewSubmit({
        //     rating,
        //     reviewText,
        //     eventAttended,
        //     eventName,
        // })

        // Reset form and close modal
        setRating(0)
        setReviewText("")
        setEventAttended("")
        setModalVisibility(false)
    }

    return (
        <ModalWrapper
            visibility={modalVisibility}
            setVisibility={setModalVisibility}
            styles={{
                backgroundColor: "transparent",
                color: "#fff",
                width: "fit-content",
            }}
        >
            <div className='w-full md:w-[28.125rem] max-h-[86vh] overflow-y-auto p-6 rounded-[20px] bg-container-grey [scrollbar-width:none]'>
                <div className='flex justify-between items-start mb-6'>
                    <div className="flex flex-col items-start gap-1 text-white">
                        <h4 className="text-lg">Write a Review</h4>
                        <p className="text-white/80 text-sm">Share your experience with Similoluwa Afolabi to help others in the community.</p>
                    </div>
                    <span
                        className='ml-auto size-8 min-w-8 min-h-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-white [&_svg_path]:fill-white'
                        onClick={() => {
                            setModalVisibility(false);
                        }}
                    >
                        <Icons.Close />
                    </span>
                </div>
                <div className='flex flex-col gap-[0.8rem] mb-[1.5rem]'>
                    <div className="flex flex-col">
                        <label className='text-sm text-white' htmlFor='name'>
                            Rating
                        </label>
                        <div className="flex items-center gap-1" onMouseLeave={handleRatingLeave}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => handleRatingHover(star)}
                                    className="focus:outline-none"
                                    aria-label={`Rate ${star} stars out of 5`}
                                >
                                    <Icons.StarOutline
                                        className={`h-8 w-8 ${(hoveredRating ? star <= hoveredRating : star <= rating)
                                            ? "fill-white text-white"
                                            : "text-white/20"
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-white/20">
                                {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-0">
                        <label className='text-sm text-white mb-2' htmlFor='name'>
                            Event Attended
                        </label>
                        <Select value={eventAttended} onValueChange={setEventAttended}>
                            <SelectTrigger id="event" className="bg-container-grey/50 border-border/60">
                                <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                            <SelectContent className="bg-container-grey border-border/40">
                                <SelectItem value="ticketsdeck-workshop">Ticketsdeck Workshop (Sep 25)</SelectItem>
                                <SelectItem value="tech-meetup">Tech Meetup 2025 (Oct 15)</SelectItem>
                                <SelectItem value="other">Other Event</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className='text-sm text-white mb-2' htmlFor='name'>
                            Your Review
                        </label>
                        <Textarea
                            id="review"
                            placeholder="Share details about your experience with this organizer..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <p className="text-sm text-white/80">
                            Your review will be public and associated with your profile.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-auto">
                        <button
                            className="tertiaryButton"
                            onClick={() => setModalVisibility(false)}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || !eventAttended || !reviewText.trim()}
                            className="tertiaryButton"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ReviewModal;