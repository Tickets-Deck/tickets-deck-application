"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ICreateBannerPayload } from "@/app/models/IBanner";
import { useCreateBanner, useUploadBannerFrame } from "../../api/apiClient";
import { ProgressBar } from "@/app/components/DpBanner/ProgressBar";
import { Step1BasicInfo } from "@/app/components/DpBanner/Step1BasicInfo";
import { Step2AvatarConfig } from "@/app/components/DpBanner/Step2AvatarConfig";
import { Step3TextConfig } from "@/app/components/DpBanner/Step3TextConfig";
import { Step4Review } from "@/app/components/DpBanner/Step4Review";
import {
  BannerDraft,
  clearBannerState,
  getBannerState,
  saveBannerState,
} from "@/utils/indexeddb/bannerDraftStorageService";
import { useDebounce } from "@/app/hooks/useDebounce";
import { DialogWrapper } from "@/app/components/Dialog/DialogWrapper";
import { useToast } from "@/app/context/ToastCardContext";

export default function CreateBannerPage() {
  const createBanner = useCreateBanner();
  const uploadBannerFrame = useUploadBannerFrame();
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [payload, setPayload] = useState<Partial<ICreateBannerPayload>>({});
  const [frameImageFile, setFrameImageFile] = useState<File | null>(null);
  const [framePreviewUrl, setFramePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [loadedDraft, setLoadedDraft] = useState<BannerDraft | null>(null);

  const debouncedPayload = useDebounce(payload, 500);
  const debouncedStep = useDebounce(currentStep, 500);
  const debouncedPreviewUrl = useDebounce(framePreviewUrl, 500);

  // Helper function to convert data URL back to a File object
  async function dataUrlToFile(
    dataUrl: string,
    filename: string
  ): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleUploadBannerFrame = async (frameImageFile: File) => {
    const formData = new FormData();

    formData.append("frame-image", frameImageFile);

    const uploadedFileResponse = await uploadBannerFrame(
      formData!,
      session?.user.token as string
    );

    return uploadedFileResponse.data;
  };

  // Effect to load state from IndexedDB on component mount
  useEffect(() => {
    if (status === "authenticated") {
      const loadState = async () => {
        const savedState = await getBannerState(session.user.id as string);
        if (savedState) {
          setLoadedDraft(savedState);
          setShowResumeModal(true);
        }
      };
      loadState();
    }
  }, [status, session]);

  const handleResume = async () => {
    if (!loadedDraft) return;
    setPayload(loadedDraft.payload);
    setCurrentStep(loadedDraft.currentStep);
    setFramePreviewUrl(loadedDraft.framePreviewUrl);
    if (loadedDraft.framePreviewUrl && loadedDraft.frameImageFileName) {
      const file = await dataUrlToFile(
        loadedDraft.framePreviewUrl,
        loadedDraft.frameImageFileName
      );
      setFrameImageFile(file);
    }
    setShowResumeModal(false);
    setLoadedDraft(null);
  };

  const handleStartNew = async () => {
    if (session?.user?.id) {
      // Clear the old draft and start fresh
      await clearBannerState(session.user.id as string);
    }
    setShowResumeModal(false);
    setLoadedDraft(null);
    // Reset the UI state to start fresh
    setCurrentStep(1);
    setPayload({});
    setFrameImageFile(null);
    setFramePreviewUrl(null);
  };

  // Effect to save state to IndexedDB on change
  useEffect(() => {
    if (status === "authenticated" && (payload.title || framePreviewUrl)) {
      const draft: BannerDraft = {
        userId: session.user.id as string,
        payload: debouncedPayload,
        currentStep: debouncedStep,
        framePreviewUrl: debouncedPreviewUrl,
        frameImageFileName: frameImageFile?.name || null,
      };
      saveBannerState(draft);
    }
  }, [
    debouncedPayload,
    debouncedStep,
    debouncedPreviewUrl,
    status,
    session,
    frameImageFile,
  ]);

  const totalSteps = 4;

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission logic
    setError(null);
    setIsUploading(true);
    if (!frameImageFile || !session?.user.token) {
      setError("Frame image is required and you must be signed in.");
      toast.logError(
        "We couldn't create your banner.",
        "Frame image is required and you must be signed in."
      );
      setIsUploading(false);
      return;
    }

    try {
      const uploadedFrameResponse = await handleUploadBannerFrame(
        frameImageFile
      );

      const finalPayload: ICreateBannerPayload = {
        title: payload.title!,
        description: payload.description,
        configuration: {
          frameImageUrl: uploadedFrameResponse.bannerImageUrl,
          avatar: payload.configuration?.avatar,
          textElements: payload.configuration?.textElements,
        },
      };
      console.log("🚀 ~ handleSubmit ~ finalPayload:", finalPayload);

      const newBanner = await createBanner(finalPayload, session.user.token);

      // Clear the draft from DB after successful submission
      await clearBannerState(session.user.id as string);

      // Redirect to the new banner's page or a success page
      router.push(`/dp-banner/${newBanner.data.id}`);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred."
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Create Your Own Banner
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to create a new banner template for your
            campaigns.
          </p>
          <button
            onClick={() => signIn()}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            payload={payload}
            setPayload={setPayload}
            setFrameImageFile={setFrameImageFile}
            framePreviewUrl={framePreviewUrl}
            setFramePreviewUrl={setFramePreviewUrl}
          />
        );
      case 2:
        return (
          <Step2AvatarConfig
            payload={payload}
            setPayload={setPayload}
            frameImageUrl={framePreviewUrl}
          />
        );
      case 3:
        return (
          <Step3TextConfig
            payload={payload}
            setPayload={setPayload}
            frameImageUrl={framePreviewUrl}
          />
        );
      case 4:
        return (
          <Step4Review
            payload={payload}
            frameImageUrl={framePreviewUrl}
            isUploading={isUploading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <DialogWrapper
        isOpen={showResumeModal}
        onClose={handleStartNew}
        title="Unfinished Banner Found"
      >
        <p className="text-sm text-gray-500">
          Would you like to continue where you left off, or start a new banner?
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleStartNew}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"
          >
            Start New
          </button>
          <button
            type="button"
            onClick={handleResume}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Resume
          </button>
        </div>
      </DialogWrapper>

      <ProgressBar currentStep={currentStep} />
      <form onSubmit={handleSubmit}>
        {renderStep()}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
          )}
          <div className="flex-grow"></div> {/* Spacer */}
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700"
          >
            {isUploading
              ? "Saving..."
              : currentStep === totalSteps
              ? "Publish Banner"
              : "Next Step"}
          </button>
        </div>
      </form>
    </div>
  );
}
