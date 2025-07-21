interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const steps = ["Details", "Avatar", "Text", "Review"];

export const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white ${
                index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 text-sm ${
                index + 1 <= currentStep
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
