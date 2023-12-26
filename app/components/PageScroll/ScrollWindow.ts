import { RefObject } from "react";

export const scrollWindow = (top: number) => {
  // Scroll to a specific y-coordinate
  window.scrollTo({
    top: top,
    behavior: "smooth", // Optionally, add smooth scrolling effect
  });
};
