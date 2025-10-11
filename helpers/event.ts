import { EventResponse, FeaturedEvent } from "@/app/models/IEvents";

export const eventHelpers = {
  generateSlugOrId: (event: EventResponse | FeaturedEvent) => {
    let slug =
      event.slug && event.slug.trim()
        ? event.slug.trim().toLowerCase()
        : event.id;
    return slug;
  },
};
