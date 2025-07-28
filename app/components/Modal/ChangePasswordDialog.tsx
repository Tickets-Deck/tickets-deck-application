"use client";

import { useChangePassword } from "@/app/api/apiClient";
import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/context/ToastCardContext";
import { DialogWrapper } from "../Dialog/DialogWrapper";
import { Icons } from "../ui/icons";
import ComponentLoader from "../Loader/ComponentLoader";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordDialog = ({
  isOpen,
  onClose,
}: ChangePasswordDialogProps) => {
  const { data: session } = useSession();
  const changePasswordMutation = useChangePassword();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Must contain an uppercase letter, a lowercase letter, a number, and a special character.";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
      isValid = false;
    } else if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!session?.user?.id || !session?.user?.token) {
      toast.logError(
        "You are not logged in",
        "You must be logged in to change your password."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePasswordMutation(
        session.user.token,
        session.user.id,
        {
          currentPassword,
          newPassword,
        }
      );
      toast.logSuccess("Success", "Password changed successfully!");
      resetForm();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to change password. Please try again.";
      toast.logError("Error", errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      containerClass="!bg-dark-grey-2"
      titleClass="!text-white"
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="currentPassword" className="text-xs text-white">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] pl-[1.1rem] pr-10 border-none outline-none placeholder:text-white/50"
              type={isCurrentPasswordVisible ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.currentPassword) {
                  setErrors((prev) => ({ ...prev, currentPassword: "" }));
                }
              }}
              placeholder="Enter current password"
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() =>
                setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
              }
            >
              <Icons.Eye clicked={!isCurrentPasswordVisible} />
            </span>
          </div>
          {errors.currentPassword && (
            <span className="text-xs text-failed-color">
              {errors.currentPassword}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="newPassword" className="text-xs text-white">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] pl-[1.1rem] pr-10 border-none outline-none placeholder:text-white/50"
              type={isNewPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
                }
              }}
              placeholder="Enter new password"
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
            >
              <Icons.Eye clicked={!isNewPasswordVisible} />
            </span>
          </div>
          {errors.newPassword && (
            <span className="text-xs text-failed-color">
              {errors.newPassword}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="confirmPassword" className="text-xs text-white">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              className="rounded-[0.5rem] bg-white/10 text-xs w-full text-white py-[0.8rem] pl-[1.1rem] pr-10 border-none outline-none placeholder:text-white/50"
              type={isConfirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }
              }}
              placeholder="Confirm new password"
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Icons.Eye clicked={!isConfirmPasswordVisible} />
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-failed-color">
              {errors.confirmPassword}
            </span>
          )}
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-fit rounded-[3.125rem] cursor-pointer text-sm bg-white/10 text-white py-[0.6rem] px-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-fit rounded-[3.125rem] cursor-pointer text-sm bg-white text-[#111] py-[0.6rem] px-4 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? "Saving..." : "Save Changes"}
            {isLoading && (
              <ComponentLoader
                isSmallLoader
                customBackground="#fff"
                customLoaderColor="#111111"
              />
            )}
          </button>
        </div>
      </form>
    </DialogWrapper>
  );
};
