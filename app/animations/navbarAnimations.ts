export const hideNavItemsVariant = {
  opened: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
  closed: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.5,
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

type MobileMenuVariant = {
  direction?: "fromLeft" | "fromRight";
  inDelay?: number;
  outDelay?: number;
};

export const mobileMenuVariant = ({ direction, inDelay, outDelay }: MobileMenuVariant) => {
  if (direction === "fromRight") {
    return {
      opened: {
        x: "0%",
        transition: {
          delay: inDelay ?? 0.4,
          duration: 0.5,
          ease: [0.74, 0, 0.19, 1.02],
        },
      },
      closed: {
        x: "100%",
        transition: {
          delay: outDelay ?? 0.35,
          duration: 0.63,
          ease: [0.74, 0, 0.19, 1.02],
        },
      },
    };
  }

  return {
    opened: {
      x: "0%",
      transition: {
        delay: inDelay ?? 0.4,
        duration: 0.5,
        ease: [0.74, 0, 0.19, 1.02],
      },
    },
    closed: {
      x: "100%",
      transition: {
        delay: outDelay ?? 0.35,
        duration: 0.63,
        ease: [0.74, 0, 0.19, 1.02],
      },
    },
  };
};

// export const mobileMenuVariant = {
//   opened: {
//     x: "0%",
//     transition: {
//       delay: 0.4,
//       duration: 0.5,
//       ease: [0.74, 0, 0.19, 1.02],
//     },
//   },
//   closed: {
//     x: "100%",
//     transition: {
//       delay: 0.35,
//       duration: 0.63,
//       ease: [0.74, 0, 0.19, 1.02],
//     },
//   },
// };

export const overlayVariant = {
  opened: {
    opacity: 1,
    x: "0%",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  closed: {
    opacity: 0,
    x: "100%",
    transition: {
      delay: 0.8,
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

export const fadeInVariant = {
  opened: {
    opacity: 1,
    transition: {
      delay: 1.2,
    },
  },
  closed: { opacity: 0 },
};

export const ulVariant = {
  opened: {
    transition: {
      delayChildren: 1,
      staggerChildren: 0.18,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

export const liVariant = {
  opened: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  closed: {
    opacity: 0,
    y: "100%",
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

export const profileVariant = {
  opened: {
    opacity: 1,
    x: "0%",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  closed: {
    opacity: 0,
    x: "50%",
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};
