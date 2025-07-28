"use client";

import { IBanner } from "@/app/models/IBanner";
import { useToast } from "@/app/context/ToastCardContext";
import { UploadCloud, Loader2 } from "lucide-react";

interface PersonalizationFormProps {
  banner: IBanner;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (elementId: string, text: string) => void;
  onGenerate: () => void;
  userTextInputs: { [key: string]: string };
  isGenerating: boolean;
  userAvatarPreviewUrl: string | null;
}

export const PersonalizationForm = ({
  banner,
  onAvatarChange,
  onTextChange,
  onGenerate,
  userTextInputs,
  isGenerating,
  userAvatarPreviewUrl,
}: PersonalizationFormProps) => {
  const toast = useToast();

  const handleGenerateClick = () => {
    const isAvatarRequired = !!banner.configuration.avatar;
    const isAvatarProvided = !!userAvatarPreviewUrl;
    const requiredTextElements = banner.configuration.textElements || [];

    const missingRequirements: string[] = [];

    if (isAvatarRequired && !isAvatarProvided) {
      missingRequirements.push("you upload your avatar photo");
    }

    const areAllTextsProvided = requiredTextElements.every((el) =>
      userTextInputs[el.id]?.trim()
    );

    if (requiredTextElements.length > 0 && !areAllTextsProvided) {
      missingRequirements.push("all text fields are filled");
    }

    if (missingRequirements.length > 0) {
      const message = `Please make sure ${missingRequirements.join(" and ")}.`;
      toast.logError("Missing Information", message);
      return;
    }

    onGenerate();
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">
        Personalize Your Pulse Card
      </h2>
      <div className="space-y-4">
        {/* Avatar Upload */}
        {banner.configuration.avatar && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Photo
            </label>
            <label
              htmlFor="avatar-upload"
              className="flex items-center gap-4 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
                {userAvatarPreviewUrl ? (
                  <img
                    src={userAvatarPreviewUrl}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UploadCloud className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <span className="text-sm text-indigo-600 hover:text-indigo-800 font-medium block">
                  Click to upload an image
                </span>
                <span className="text-xs text-gray-500">(Maximum of 10mb)</span>
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={onAvatarChange}
            />
          </div>
        )}

        {/* Text Inputs */}
        {banner.configuration.textElements?.map((el) => (
          <div key={el.id}>
            <label
              htmlFor={`text-input-${el.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              {el.text} (placeholder)
            </label>
            <input
              id={`text-input-${el.id}`}
              type="text"
              value={userTextInputs[el.id] || ""}
              onChange={(e) => onTextChange(el.id, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Enter text for "${el.text}"`}
            />
          </div>
        ))}

        {/* Generate Button */}
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate DP"
          )}
        </button>
      </div>
    </div>
  );
};
