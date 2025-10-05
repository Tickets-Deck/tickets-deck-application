"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DialogWrapper } from "../../Dialog/DialogWrapper";
import Button from "../../ui/button";
import { useVerifyEventSlug, useUpdateEventById } from "../../../api/apiClient";
import { useSession } from "next-auth/react";
import { Check, Info, Loader, X } from "lucide-react";

interface EventUrlShortenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  eventId: string;
  publisherId: string;
  onSlugUpdate: (newSlug: string) => void;
}

interface ValidationState {
  isValid?: boolean;
  message: string;
  isChecking: boolean;
}

export default function EventUrlShortenerModal({
  isOpen,
  onClose,
  currentSlug = "",
  eventId,
  publisherId,
  onSlugUpdate,
}: EventUrlShortenerModalProps) {
  const { data: session } = useSession();
  const updateEventById = useUpdateEventById();
  const [slug, setSlug] = useState(currentSlug);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    message: "",
    isChecking: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Generate default slug if none exists
  const generateDefaultSlug = useCallback(() => {
    return currentSlug || "my-event";
  }, [currentSlug]);

  // Initialize slug when modal opens
  useEffect(() => {
    if (isOpen && !currentSlug) {
      setSlug(generateDefaultSlug());
    } else if (isOpen) {
      setSlug(currentSlug);
    }
  }, [isOpen, currentSlug, generateDefaultSlug]);

  const verifyEventSlug = useVerifyEventSlug();

  // API call to validate slug
  const validateSlug = useCallback(async (slugToValidate: string) => {
    if (!slugToValidate.trim()) {
      setValidation({
        isValid: false,
        message: "Slug cannot be empty",
        isChecking: false,
      });
      return;
    }

    // Basic slug validation (alphanumeric only)
    const slugPattern = /^[a-zA-Z0-9]+$/;
    if (!slugPattern.test(slugToValidate)) {
      setValidation({
        isValid: false,
        message: "Slug can only contain letters and numbers",
        isChecking: false,
      });
      return;
    }

    setValidation({ isValid: true, message: "", isChecking: true });

    try {
      const response = await verifyEventSlug(slugToValidate);
      const { isUnique, reason } = response.data;

      setValidation({
        isValid: isUnique,
        message:
          reason ||
          (isUnique
            ? "Slug is available!"
            : "This slug is already taken. Please try another one."),
        isChecking: false,
      });
    } catch (error) {
      console.error("Error validating slug:", error);
      setValidation({
        isValid: false,
        message: "Failed to check slug availability. Please try again.",
        isChecking: false,
      });
    }
  }, []);

  // Debounced validation effect
  useEffect(() => {
    if (!slug) return;

    const timeoutId = setTimeout(() => {
      validateSlug(slug);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [slug]);

  // Handle slug input change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Filter out everything except letters and numbers, then convert to lowercase
    const filteredValue = inputValue.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Only update state and reset validation if the slug actually changed
    if (filteredValue !== slug) {
      setSlug(filteredValue);

      // Reset validation state while typing
      setValidation({
        isValid: undefined,
        message: "Checking availability...",
        isChecking: false,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validation.isValid || validation.isChecking || !session?.user?.token)
      return;

    setIsUpdating(true);

    try {
      // Create FormData with the slug update
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("eventId", eventId);
      formData.append("publisherId", publisherId);

      // Call the real API to update the event
      await updateEventById(session.user.token, eventId, publisherId, formData);

      // Success - update parent component and close modal
      onSlugUpdate(slug);
      onClose();
    } catch (error) {
      console.error("Failed to update slug:", error);
      // Handle error by showing validation message
      setValidation({
        isValid: false,
        message: "Failed to save slug. Please try again.",
        isChecking: false,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (isUpdating) return; // Prevent closing while updating

    setSlug(currentSlug);
    setValidation({ isValid: true, message: "", isChecking: false });
    onClose();
  };

  const fullUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/event/${slug}`;

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Customize Event URL"
      containerClass="!bg-dark-grey-2 !max-w-lg"
      titleClass="!text-white"
    >
      <div className="space-y-6">
        {/* Current URL Preview */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Current URL Preview
          </label>
          <div className="bg-dark-grey rounded-lg p-3 border border-white/20">
            <p className="text-sm text-white/60 font-mono break-all">
              {fullUrl}
            </p>
          </div>
        </div>

        {/* Slug Input */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Custom Slug
          </label>
          <div className="flex items-center bg-dark-grey rounded-lg border border-white/20 overflow-hidden">
            <span className="px-3 py-3 text-sm text-white/60 bg-white/5 border-r border-white/20 font-mono">
              /event/
            </span>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder={`myevent${new Date().getFullYear()}`}
              className="flex-1 px-3 py-3 bg-transparent text-white placeholder-white/40 outline-none font-mono"
              disabled={isUpdating}
            />
          </div>

          {/* Validation Feedback */}
          <div className="mt-2 min-h-[20px]">
            {validation.isChecking && (
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <Loader className=" animate-spin" />
                <span>Checking availability...</span>
              </div>
            )}

            {!validation.isChecking && validation.message && (
              <div
                className={`flex items-center gap-2 text-sm 
                    ${validation.isValid === true && "text-green-400"}
                    ${validation.isValid === false && "text-red-400"}
                    ${validation.isValid === undefined && "text-gray-400"}
                `}
              >
                {validation.isValid === true && (
                  <Check width={16} height={16} />
                )}
                {validation.isValid === false && <X width={16} height={16} />}
                <span>{validation.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info
              width={16}
              height={16}
              className="text-blue-400 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-blue-100">
              <p className="font-medium mb-1">Tips for a great slug:</p>
              <ul className="text-xs text-blue-200/80 space-y-1">
                <li>• Keep it short and memorable</li>
                <li>
                  • Use only letters and numbers (automatically converted to
                  lowercase)
                </li>
                <li>• Make it relevant to your event</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={handleClose}
            disabled={isUpdating}
            className="text-white hover:bg-white/10 border border-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !validation.isValid ||
              validation.isChecking ||
              isUpdating ||
              !slug.trim()
            }
            isLoading={isUpdating}
            className="bg-primary-color text-white hover:!text-primary-color"
          >
            {isUpdating ? "Updating..." : "Update URL"}
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
}
