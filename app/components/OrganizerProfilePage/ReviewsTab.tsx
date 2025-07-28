"use client";

import { useContext, useEffect, useState } from "react";
import { Icons } from "../ui/icons";
import Image from "next/image";
import ReviewModal from "../Modal/ReviewModal";
import { useCreateReview, useFetchOrganizerReviews } from "@/app/api/apiClient";
import { useToast } from "@/app/context/ToastCardContext";
import Ratings from "../custom/StarRating";
import { CreateReviewRequest, Review } from "@/app/models/IReview";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { Session } from "next-auth";
import {
  ApplicationContext,
  ApplicationContextData,
} from "@/app/context/ApplicationContext";
import { FullPageLoader } from "../Loader/ComponentLoader";
import { OrganizerEvents } from "@/app/u/[userId]/OrganizerProfilePage";
import { ApplicationError } from "@/app/constants/applicationError";

const orientation: "horizontal" | "vertical" = "horizontal";

type ReviewsTabProps = {
  organizerName: string;
  organizerId: string;
  organizerEvents: OrganizerEvents[];
  session: Session | null;
};

export function ReviewsTab({
  organizerName,
  organizerEvents,
  organizerId,
  session,
}: ReviewsTabProps) {
  const fetchOrganizerReviews = useFetchOrganizerReviews();
  const { toggleUserLoginPrompt } = useContext(
    ApplicationContext
  ) as ApplicationContextData;
  const toastHandler = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>();
  const [isFetchingReviews, setIsFetchingReviews] = useState(true);

  const fetchOrganizerReviewsData = async () => {
    setIsFetchingReviews(true);

    await fetchOrganizerReviews(organizerId)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      })
      .finally(() => {
        setIsFetchingReviews(false);
      });
  };

  useEffect(() => {
    fetchOrganizerReviewsData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Review submission button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <button
          onClick={() =>
            session?.user ? setIsModalOpen(true) : toggleUserLoginPrompt()
          }
          className="tertiaryButton"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews list */}
      {isFetchingReviews ? (
        <div className="text-center py-12 bg-white/0 rounded-lg">
          <FullPageLoader containerClassName="!h-[5rem]" />
          <p className="text-white/80">Fetching reviews</p>
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {/* Review stats */}
          <div className="bg-container-grey-20/30 rounded-lg p-4 px-5 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-6 w-full justify-between md:w-fit">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold font-Mona-Sans-Wide">
                  {(
                    reviews.reduce((acc, review) => acc + review.rating, 0) /
                    reviews.length
                  ).toFixed(1)}
                </span>
                <div className="flex flex-row items-end">
                  {[1, 2, 3, 4, 5].map((star) => {
                    return star <=
                      Math.round(
                        reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / reviews.length
                      ) ? (
                      <Icons.Star key={star} className={`h-4 w-4`} />
                    ) : (
                      <Icons.Star
                        key={star}
                        className={`h-4 w-4`}
                        fill="#8a8a8a"
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-white mt-1">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
              <div className="h-12 w-px bg-border hidden md:block"></div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(
                    (review) => review.rating === rating
                  ).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-3">{rating}</span>
                      <div className="h-2 bg-muted w-32 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-color rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-end text-center md:text-right">
              <p className="text-sm text-white mb-2">
                Was this organizer helpful?
              </p>
              <button className="primaryButton">
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
                    <div className="h-12 w-12 border-2 border-white relative rounded-full overflow-hidden">
                      <Image
                        src={
                          review.reviewerProfilePhoto ||
                          "https://placehold.co/300x300/8133F1/FFFFFF/png?text=SA"
                        }
                        alt="Similoluwa Afolabi"
                        fill
                        sizes="auto"
                        className="sizes-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {review.reviewerName}
                      </div>
                      <div className="text-sm text-white/80">
                        {formatRelativeTime(new Date(review.createdAt))}
                      </div>
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
                  <Ratings rating={review.rating} />
                  <div className="text-sm text-white/70 mb-2 capitalize">
                    Event: {review.eventName}
                  </div>
                  <p className="text-sm">{review.reviewText}</p>
                </div>

                <div className="flex items-center gap-4">
                  <button className="primaryButton !p-0 !bg-transparent hover:text-gray-400">
                    <Icons.ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </button>
                </div>

                {/* <Separator className="bg-border/40" /> */}
                <span
                  className={`shrink-0 bg-border ${
                    orientation === "horizontal"
                      ? "h-[1px] w-full"
                      : "h-full w-[1px]"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/10 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
          <p className="text-white/80">
            Be the first to leave a review for this organizer
          </p>
        </div>
      )}

      <ReviewModal
        events={organizerEvents}
        fetchOrganizerReviewsData={fetchOrganizerReviewsData}
        token={session?.user.token as string}
        modalVisibility={isModalOpen}
        setModalVisibility={setIsModalOpen}
        organizerName={organizerName}
        reviewerId={session?.user.id as string}
        organizerId={organizerId}
      />
    </div>
  );
}
