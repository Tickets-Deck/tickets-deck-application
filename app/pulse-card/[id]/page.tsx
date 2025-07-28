"use client";
import { useFetchBanner, useGenerateDp } from "@/app/api/apiClient";
import { BannerPreview } from "@/app/components/DpBanner/BannerView/BannerPreview";
import { IBanner } from "@/app/models/IBanner";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Loading from "./loading";
import { Download, Share2 } from "lucide-react";
import { PersonalizationForm } from "@/app/components/DpBanner/BannerView/PersonalizationForm";
import { useToast } from "@/app/context/ToastCardContext";
import { formatFileSize } from "@/utils/formatFileSize";
import { compressImage } from "@/utils/imageCompress";

interface BannerPageProps {
  params: {
    id: string;
  };
}

export default function BannerPage({ params }: BannerPageProps) {
  const fetchBanner = useFetchBanner();
  const generateDp = useGenerateDp();
  const { data: session, status } = useSession();
  const toast = useToast();

  const [banner, setBanner] = useState<IBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for personalization
  const [userAvatarFile, setUserAvatarFile] = useState<File | null>(null);
  const [userAvatarPreviewUrl, setUserAvatarPreviewUrl] = useState<
    string | null
  >(null);
  const [userTextInputs, setUserTextInputs] = useState<{
    [key: string]: string;
  }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{
    url: string;
    blob: Blob;
  } | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatarPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (elementId: string, text: string) => {
    setUserTextInputs((prev) => ({ ...prev, [elementId]: text }));
  };

  const handleAvatarAreaClick = () => {
    avatarInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!banner) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    const formData = new FormData();
    if (userAvatarFile) {
      let fileToUpload = userAvatarFile;

      console.log(
        `Original image size: ${formatFileSize(userAvatarFile.size)}`
      );
      const { compressedFile, compressedSize, reductionPercentage } =
        await compressImage(userAvatarFile);
      console.log(
        `Compressed to: ${formatFileSize(
          compressedSize
        )} (${reductionPercentage.toFixed(2)}% reduction)`
      );

      fileToUpload = compressedFile;

      formData.append("avatar", fileToUpload);
    }
    formData.append("textInputs", JSON.stringify(userTextInputs));

    try {
      const response = await generateDp(
        banner.id,
        formData,
        session?.user.id || undefined
      );
      const blob = new Blob([response.data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setGeneratedImage({ url, blob });
    } catch (err: any) {
      console.error("Error generating DP:", err);
      if (err.response && err.response.status === 413) {
        prompt("Entity too large");

        toast.logError(
          "Image size too large",
          "Please try again with another image"
        );

        return;
      }
      toast.logError(
        "Generation Failed",
        "We couldn't generate your Pulse Card. Please try a different image or check your connection."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!generatedImage || !banner) return;

    // Construct the URL to the event page
    const eventUrl = new URL(`/events`, window.location.origin).href;
    const shareText = `I just got my tickets. Get yours here: ${eventUrl}`;
    const imageFile = new File(
      [generatedImage.blob],
      `${banner.title.replace(/\s+/g, "-")}-dp.png`,
      {
        type: "image/png",
      }
    );

    if (navigator.share && navigator.canShare?.({ files: [imageFile] })) {
      try {
        await navigator.share({
          title: banner.title,
          text: shareText,
          files: [imageFile],
        });
        toast.logSuccess(
          "Shared successfully!",
          "Your Pulse Card has been shared."
        );
      } catch (error) {
        // Don't show an error if the user cancels the share dialog
        if ((error as DOMException).name !== "AbortError") {
          toast.logError("Could not share", "An error occurred while sharing.");
        }
      }
    } else {
      toast.logError(
        "Error",
        "Sharing files is not supported on your browser."
      );
    }
  };

  useEffect(() => {
    const handleFetchBanner = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchBanner(params.id);
        setBanner(response.data);
      } catch (err: any) {
        console.error("Error fetching banner:", err);
        setError(
          err.response?.status === 404
            ? "Banner not found."
            : "Failed to load banner."
        );
        setBanner(null);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchBanner();
  }, [params.id]);

  if (isLoading || status === "loading") {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Banner not found.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side: Details and Personalization Form */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{banner.title}</h1>
          <p className="text-gray-600 mb-8">{banner.description}</p>

          <PersonalizationForm
            banner={banner}
            onAvatarChange={handleAvatarChange}
            onTextChange={handleTextChange}
            onGenerate={handleGenerate}
            userTextInputs={userTextInputs}
            isGenerating={isGenerating}
            userAvatarPreviewUrl={userAvatarPreviewUrl}
          />
          {/* Hidden file input used by both the form and the preview */}
          <input
            ref={avatarInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Right side: Live Preview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <BannerPreview
            banner={banner}
            userAvatarUrl={userAvatarPreviewUrl}
            userTextInputs={userTextInputs}
            onAvatarClick={handleAvatarAreaClick}
          />
          {generatedImage && (
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={generatedImage.url}
                download={`${banner.title.replace(/\s+/g, "-")}-dp.png`}
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Your Pulse Card
              </a>
              {/* <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Now
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
