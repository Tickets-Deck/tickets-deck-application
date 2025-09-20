import React, { useState, useEffect } from 'react';
import { EventResponse } from '@/app/models/IEvents';
import { Icons } from '@/app/components/ui/icons';
import moment from 'moment';

// Define the coupon interface based on the existing ICoupon model
interface CouponResponse {
  id: string;
  code: string;
  discount: string;
  maxUsage: number;
  validUntil: string;
  usedCount: number; // How many times the coupon has been used
  createdAt: string;
  updatedAt: string;
}

type Props = {
  eventInfo: EventResponse;
};

export default function CouponManager({ eventInfo }: Props) {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponResponse | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    // TODO: Fetch coupons for the event
    // For now, we'll simulate loading and add some mock data for demonstration
    setTimeout(() => {
      // Mock data for demonstration - will be replaced with actual API call
      setCoupons([
        {
          id: '1',
          code: 'SAVE20',
          discount: '20',
          maxUsage: 100,
          usedCount: 25,
          validUntil: '2025-12-31',
          createdAt: '2024-11-01',
          updatedAt: '2024-11-01',
        },
        {
          id: '2', 
          code: 'EARLY10',
          discount: '10',
          maxUsage: 50,
          usedCount: 47,
          validUntil: '2025-01-15',
          createdAt: '2024-10-15',
          updatedAt: '2024-10-15',
        },
        {
          id: '3', 
          code: 'EXPIRED',
          discount: '15',
          maxUsage: 30,
          usedCount: 10,
          validUntil: '2024-12-01',
          createdAt: '2024-10-01',
          updatedAt: '2024-10-01',
        }
      ]);
      // Uncomment below to show empty state instead
      // setCoupons([]); 
      setIsLoading(false);
    }, 1000);
  }, [eventInfo.id]);

  const handleAddCoupon = () => {
    setShowAddCouponModal(true);
  };

  const handleEditCoupon = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setShowAddCouponModal(true);
  };

  const handleDeleteCoupon = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setShowDeleteConfirmation(true);
  };

  const getCouponStatus = (coupon: CouponResponse) => {
    const now = new Date();
    const expiryDate = new Date(coupon.validUntil);
    const isExpired = now > expiryDate;
    const isFullyUsed = coupon.usedCount >= coupon.maxUsage;
    
    if (isExpired) return { status: 'Expired', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    if (isFullyUsed) return { status: 'Fully Used', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    if (coupon.usedCount / coupon.maxUsage > 0.8) return { status: 'Almost Full', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { status: 'Active', color: 'text-green-400', bgColor: 'bg-green-500/20' };
  };

  const confirmDeleteCoupon = () => {
    if (selectedCoupon) {
      // TODO: API call to delete coupon
      setCoupons(prev => prev.filter(c => c.id !== selectedCoupon.id));
      setShowDeleteConfirmation(false);
      setSelectedCoupon(null);
    }
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
            <Icons.QuickTicketBooking width={24} height={24} className="text-gray-400" />
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
                {coupons.filter(c => getCouponStatus(c).status === 'Active').length}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Total Uses</h4>
              <p className="text-2xl font-semibold">
                {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Available Uses</h4>
              <p className="text-2xl font-semibold">
                {coupons.reduce((sum, c) => sum + (c.maxUsage - c.usedCount), 0)}
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
                      <span className={`${status.bgColor} ${status.color} px-2 py-1 rounded text-xs`}>
                        {status.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                      <div>
                        <p className="font-medium text-white mb-1">Usage</p>
                        <p>{coupon.usedCount} / {coupon.maxUsage} used</p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-color h-2 rounded-full"
                            style={{
                              width: `${(coupon.usedCount / coupon.maxUsage) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-white mb-1">Expires</p>
                        <p>{moment(coupon.validUntil).format('MMM D, YYYY')}</p>
                        <p className="text-xs">
                          {moment(coupon.validUntil).fromNow()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-white mb-1">Remaining</p>
                        <p className={`${
                          coupon.maxUsage - coupon.usedCount > 0 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {coupon.maxUsage - coupon.usedCount} uses left
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
      {showAddCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-medium mb-4">
              {selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}
            </h3>
            <p className="text-gray-400 mb-4">
              Coupon creation functionality will be implemented when the API endpoints are ready.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddCouponModal(false);
                  setSelectedCoupon(null);
                }}
                className="secondaryButton !px-4 !py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-medium mb-4">Delete Coupon</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete the coupon "{selectedCoupon.code}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setSelectedCoupon(null);
                }}
                className="secondaryButton !px-4 !py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCoupon}
                className="tertiaryButton !bg-failed-color !text-white !px-4 !py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
