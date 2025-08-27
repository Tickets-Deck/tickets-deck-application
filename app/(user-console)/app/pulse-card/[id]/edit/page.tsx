"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ICreateBannerPayload,
  IUserEventForBanner,
  IBanner,
} from "@/app/models/IBanner";
import {
  useUpdateBanner,
  useFetchUserEventsForBanner,
  useUploadBannerFrame,
  useFetchBanner,
} from "@/app/api/apiClient";
import { ProgressBar } from "@/app/components/DpBanner/ProgressBar";
import { Step1BasicInfo } from "@/app/components/DpBanner/Step1BasicInfo";
import { Step2AvatarConfig } from "@/app/components/DpBanner/Step2AvatarConfig";
import { Step3TextConfig } from "@/app/components/DpBanner/Step3TextConfig";
import { Step4Review } from "@/app/components/DpBanner/Step4Review";
import { useToast } from "@/app/context/ToastCardContext";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import Link from "next/link";

type UpdateBannerDto = Partial<ICreateBannerPayload>;

interface EditBannerPageProps {
  params: {
    id: string;
  };
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  const { id: bannerId } = params;
  const updateBanner = useUpdateBanner();
  const uploadBannerFrame = useUploadBannerFrame();
  const fetchUserEvents = useFetchUserEventsForBanner();
  const fetchBanner = useFetchBanner();
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [payload, setPayload] = useState<Partial<ICreateBannerPayload>>({});
  const [frameImageFile, setFrameImageFile] = useState<File | null>(null);
  const [framePreviewUrl, setFramePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<IUserEventForBanner[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Effect to fetch banner data for editing
  useEffect(() => {
    if (bannerId && status === "authenticated") {
      const loadBannerData = async () => {
        setIsLoading(true);
        try {
          const response = await fetchBanner(bannerId);
          const bannerData: IBanner = response.data;
          setPayload({
            title: bannerData.title,
            description: bannerData.description,
            configuration: bannerData.configuration,
            eventId: bannerData.eventId,
          });
          setFramePreviewUrl(bannerData.configuration.frameImageUrl);
        } catch (err) {
          console.error("Failed to fetch banner data", err);
          setError(
            "Failed to load banner data. It might not exist or you may not have permission to edit it."
          );
          toast.logError("Error", "Failed to load banner data.");
        } finally {
          setIsLoading(false);
        }
      };
      loadBannerData();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [bannerId, status]);

  // Effect to fetch user's events
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const loadEvents = async () => {
        setIsLoadingEvents(true);
        try {
          const response = await fetchUserEvents(session.user.token as string);
          setUserEvents(response.data);
        } catch (error) {
          console.error("Failed to fetch user events", error);
          toast.logError("Error", "Could not load your events.");
        } finally {
          setIsLoadingEvents(false);
        }
      };
      loadEvents();
    }
  }, [status, session?.user?.id]);

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

    setError(null);
    setIsSubmitting(true);
    if (!session?.user.token) {
      setError("You must be signed in to update a banner.");
      toast.logError("Error", "You must be signed in to update a banner.");
      setIsSubmitting(false);
      return;
    }

    try {
      let uploadedFrameUrl = payload.configuration?.frameImageUrl;

      if (frameImageFile) {
        const formData = new FormData();
        formData.append("frame-image", frameImageFile);
        const uploadedFileResponse = await uploadBannerFrame(
          formData,
          session.user.token
        );
        uploadedFrameUrl = uploadedFileResponse.data.bannerImageUrl;
      }

      const finalPayload: UpdateBannerDto = {
        ...payload,
        configuration: {
          ...payload.configuration,
          frameImageUrl: uploadedFrameUrl!,
        },
      };

      await updateBanner(bannerId, finalPayload, session.user.token);

      toast.logSuccess("Success!", "Banner updated successfully.");
      router.push(ApplicationRoutes.UserPulseCard);
    } catch (error: any) {
      setIsSubmitting(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      setError(errorMessage);
      toast.logError("Update Failed", errorMessage);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <ComponentLoader />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Edit Your Banner
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to edit a banner.
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

  if (error && !isLoading) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">{error}</h1>
        <Link
          href={ApplicationRoutes.UserPulseCard}
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Go back to your banners
        </Link>
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
            userEvents={userEvents}
            isLoadingEvents={isLoadingEvents}
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
            isUploading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Edit Pulse Card Banner
      </h1>
      <ProgressBar currentStep={currentStep} />
      <form onSubmit={handleSubmit}>
        {renderStep()}
        {error && <p className="text-red-500 mt-4">{error}</p>}
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700"
          >
            {isSubmitting
              ? "Saving..."
              : currentStep === totalSteps
              ? "Save Changes"
              : "Next Step"}
          </button>
        </div>
      </form>
    </div>
  );
}
