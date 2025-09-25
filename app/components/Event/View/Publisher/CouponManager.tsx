import React, { useState, useEffect, useContext } from "react";
import { EventResponse } from "@/app/models/IEvents";
import {
  CouponResponse,
  CouponRequest,
  CouponUpdateRequest,
} from "@/app/models/ICoupon";
import { Icons } from "@/app/components/ui/icons";
import { ToastContext } from "@/app/context/ToastCardContext";
import { catchError } from "@/app/constants/catchError";
import {
  useCreateCoupon,
  useFetchEventCoupons,
  useUpdateCoupon,
  useDeleteCoupon,
} from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import moment from "moment";
import { ApplicationError } from "@/app/constants/applicationError";

type Props = {
  eventInfo: EventResponse;
};

export default function CouponManager({ eventInfo }: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  const toastHandler = useContext(ToastContext);

  // API hooks
  const createCoupon = useCreateCoupon();
  const fetchEventCoupons = useFetchEventCoupons();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showEditCouponModal, setShowEditCouponModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [couponForm, setCouponForm] = useState<{
    code: string;
    discount: number;
    maxUsage: number;
    validUntil: string;
  }>({
    code: "",
    discount: 0,
    maxUsage: 1,
    validUntil: "",
  });

  useEffect(() => {
    handleFetchCoupons();
  }, [eventInfo.id]);

  const handleFetchCoupons = async () => {
    if (!user?.token) return;

    setIsLoading(true);
    try {
      const response = await fetchEventCoupons(
        user.token,
        eventInfo.id,
        eventInfo.publisherId
      );
      setCoupons(response.data || []);
    } catch (error) {
      catchError(error);
      toastHandler?.logError(
        "Error",
        "Failed to fetch coupons. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCoupon = () => {
    setCouponForm({
      code: "",
      discount: 0,
      maxUsage: 1,
      validUntil: "",
    });
    setShowAddCouponModal(true);
  };

  const handleEditCoupon = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discount: coupon.discount,
      maxUsage: coupon.maxUsage,
      validUntil: moment(coupon.validUntil).format("YYYY-MM-DDTHH:mm"),
    });
    setShowEditCouponModal(true);
  };

  const handleDeleteCoupon = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setShowDeleteConfirmModal(true);
  };

  const handleSubmitCoupon = async () => {
    if (!user?.token) return;

    // Validation
    if (
      !couponForm.code ||
      !couponForm.discount ||
      !couponForm.maxUsage ||
      !couponForm.validUntil
    ) {
      toastHandler?.logError("Error", "Please fill in all required fields.");
      return;
    }

    if (couponForm.discount <= 0 || couponForm.discount > 100) {
      toastHandler?.logError(
        "Error",
        "Discount must be between 1 and 100 percent."
      );
      return;
    }

    if (couponForm.maxUsage <= 0) {
      toastHandler?.logError("Error", "Maximum usage must be at least 1.");
      return;
    }

    const validUntilDate = new Date(couponForm.validUntil);
    if (validUntilDate <= new Date()) {
      toastHandler?.logError(
        "Error",
        "Valid until date must be in the future."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (showAddCouponModal) {
        // Create new coupon
        const couponData: CouponRequest = {
          eventId: eventInfo.id,
          code: couponForm.code.toUpperCase(),
          discount: couponForm.discount,
          maxUsage: couponForm.maxUsage,
          validUntil: validUntilDate.toISOString(),
        };

        await createCoupon(
          user.token,
          eventInfo.id,
          eventInfo.publisherId,
          couponData
        );
        toastHandler?.logSuccess("Success", "Coupon created successfully!");
        setShowAddCouponModal(false);
      } else if (showEditCouponModal && selectedCoupon) {
        // Update existing coupon
        const updateData: CouponUpdateRequest = {
          code: couponForm.code.toUpperCase(),
          discount: couponForm.discount,
          maxUsage: couponForm.maxUsage,
          validUntil: validUntilDate.toISOString(),
        };

        await updateCoupon(
          user.token,
          selectedCoupon.id,
          eventInfo.publisherId,
          updateData
        );
        toastHandler?.logSuccess("Success", "Coupon updated successfully!");
        setShowEditCouponModal(false);
      }

      // Refresh coupons list
      await handleFetchCoupons();
    } catch (error: any) {
      console.log("🚀 ~ handleSubmitCoupon ~ error:", error);
      // if (error?.response.data.errorCode == ApplicationError.InvalidCouponMaxUsage.Code) {
      //   toastHandler?.logError(
      //     "Error",
      //     ""
      //     );
      // }
      catchError(error);
      toastHandler?.logError(
        "Error",
        showAddCouponModal
          ? "Failed to create coupon."
          : "Failed to update coupon."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user?.token || !selectedCoupon) return;

    setIsSubmitting(true);
    try {
      await deleteCoupon(user.token, selectedCoupon.id, user.id as string);
      toastHandler?.logSuccess("Success", "Coupon deleted successfully!");
      setShowDeleteConfirmModal(false);
      await handleFetchCoupons();
    } catch (error) {
      catchError(error);
      toastHandler?.logError("Error", "Failed to delete coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCouponStatus = (coupon: CouponResponse) => {
    const now = new Date();
    const expiryDate = new Date(coupon.validUntil);
    const isExpired = now > expiryDate;
    const isFullyUsed = coupon.usageCount >= coupon.maxUsage;

    if (isExpired)
      return {
        status: "Expired",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
      };
    if (isFullyUsed)
      return {
        status: "Fully Used",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
      };
    if (coupon.usageCount / coupon.maxUsage > 0.8)
      return {
        status: "Almost Full",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
      };
    return {
      status: "Active",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    };
  };

  if (isLoading) {
    return (
      <div className="rounded-xl p-8 bg-[#1e1e1e] border-[2px] border-container-grey">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
          <span className="ml-3">Loading coupons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 pb-8 bg-[#1e1e1e] border-[2px] border-container-grey">
      <div className="mb-5 flex flex-row justify-between items-center">
        <h4 className="text-2xl font-medium">Event Coupons</h4>
        <button
          onClick={handleAddCoupon}
          className="primaryButton !px-4 !py-2 flex items-center gap-2"
        >
          <Icons.Add width={16} height={16} fill="#fff" />
          Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        // Empty state - only show when there are actually no coupons
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <Icons.QuickTicketBooking
              width={24}
              height={24}
              className="text-gray-400"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">No coupons added yet</h3>
          <p className="text-gray-400 mb-6">
            Create discount coupons to attract more customers to your event.
          </p>
          <button
            onClick={handleAddCoupon}
            className="primaryButton !px-6 !py-3"
          >
            Add First Coupon
          </button>
        </div>
      ) : (
        <div>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Total Coupons</h4>
              <p className="text-2xl font-semibold">{coupons.length}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Active Coupons</h4>
              <p className="text-2xl font-semibold text-green-400">
                {
                  coupons.filter((c) => getCouponStatus(c).status === "Active")
                    .length
                }
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Total Uses</h4>
              <p className="text-2xl font-semibold">
                {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Available Uses</h4>
              <p className="text-2xl font-semibold">
                {coupons.reduce(
                  (sum, c) => sum + (c.maxUsage - c.usageCount),
                  0
                )}
              </p>
            </div>
          </div>

          {/* Coupons list */}
          <div className="space-y-4">
            {coupons.map((coupon) => {
              const status = getCouponStatus(coupon);
              return (
                <div
                  key={coupon.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-color-sub/20 px-3 py-1 rounded-md text-sm font-mono font-medium">
                          {coupon.code}
                        </span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          {coupon.discount}% OFF
                        </span>
                        <span
                          className={`${status.bgColor} ${status.color} px-2 py-1 rounded text-xs`}
                        >
                          {status.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                        <div>
                          <p className="font-medium text-white mb-1">Usage</p>
                          <p>
                            {coupon.usageCount} / {coupon.maxUsage} used
                          </p>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary-color h-2 rounded-full"
                              style={{
                                width: `${
                                  (coupon.usageCount / coupon.maxUsage) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-white mb-1">Expires</p>
                          <p>
                            {moment(coupon.validUntil).format("MMM D, YYYY")}
                          </p>
                          <p className="text-xs">
                            {moment(coupon.validUntil).fromNow()}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-white mb-1">
                            Remaining
                          </p>
                          <p
                            className={`${
                              coupon.maxUsage - coupon.usageCount > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {coupon.maxUsage - coupon.usageCount}{" "}
                            {coupon.maxUsage - coupon.usageCount === 1
                              ? "use"
                              : "uses"}{" "}
                            left
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="tertiaryButton !rounded-lg !py-2 !px-4 text-sm"
                        title="Edit coupon"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon)}
                        className="tertiaryButton !bg-failed-color !text-white !rounded-lg !py-2 !px-4"
                        title="Delete coupon"
                      >
                        <Icons.Delete className="!w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Coupon Modal */}
      {(showAddCouponModal || showEditCouponModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-medium mb-4">
              {showEditCouponModal ? "Edit Coupon" : "Add New Coupon"}
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-color"
                  placeholder="e.g., SAVE20"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={couponForm.discount}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      discount: Number(e.target.value),
                    }))
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-color"
                  placeholder="e.g., 20"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Maximum Uses
                </label>
                <input
                  type="number"
                  value={couponForm.maxUsage}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      maxUsage: Number(e.target.value),
                    }))
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-color"
                  placeholder="e.g., 100"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Valid Until
                </label>
                <input
                  type="datetime-local"
                  value={couponForm.validUntil}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      validUntil: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-color"
                />
              </div>
            </form>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddCouponModal(false);
                  setShowEditCouponModal(false);
                  setSelectedCoupon(null);
                }}
                className="secondaryButton !px-4 !py-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCoupon}
                className="primaryButton !px-4 !py-2"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : showEditCouponModal
                  ? "Update Coupon"
                  : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-medium mb-4">Delete Coupon</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete the coupon "{selectedCoupon.code}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setSelectedCoupon(null);
                }}
                className="secondaryButton !px-4 !py-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="primaryButton !bg-red-500 hover:!bg-red-600 !px-4 !py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
