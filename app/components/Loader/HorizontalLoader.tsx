export const HorizontalLoader = () => {
  return (
    <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-blue-600 animate-loader-progress"
        style={{
          animation: "loader-progress 2s infinite ease-in-out",
        }}
      />
      <style jsx>{`
        @keyframes loader-progress {
          0% {
            width: 0%;
            left: 0;
          }
          50% {
            width: 100%;
            left: 0;
          }
          100% {
            width: 0%;
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};
