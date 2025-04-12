export type Review = {
  id: string;
  rating: number;
  reviewText: string;
  eventId: string;
  reviewerId: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  eventName: string;
  reviewerName: string;
  reviewerProfilePhoto: string;
};

export type CreateReviewRequest = {
  rating: number;
  reviewText: string;
  reviewerId: string;
  organizerId: string;
  eventId: string;
};
