// Wavy animated background component
export const WavyBackground = () => {
  return (
    <div className="wave-bg">
      <div className="wave"></div>
      <div className="wave wave-2"></div>
      <div className="wave wave-3"></div>
    </div>
  );
};

// Dreamy floating shapes background component
export const DreamyBackground = () => {
  return (
    <div className="dreamy-bg">
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      <div className="floating-shape floating-shape-3"></div>
    </div>
  );
};

// Decorative shapes component
export const DecorativeShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="shape-circle bg-primary-color/5 w-64 h-64 absolute -top-20 -left-20"></div>
      <div className="shape-blob bg-primary-color/5 w-96 h-96 absolute -bottom-40 -right-20"></div>
      <div className="shape-diamond bg-primary-color/5 w-48 h-48 absolute top-1/3 -right-10"></div>
      <div className="shape-dots absolute top-1/4 left-1/4 w-full h-full opacity-30"></div>
    </div>
  );
};
