export type CouponDetails = {
  id: string;
  code: string;
  discount: string;
  maxUsage: number;
  validUntil: string;
};

export type CouponRequest = {
  eventId: string;
  code: string;
  discount: number; // percentage discount
  maxUsage: number;
  validUntil: string; // ISO date string
};

export type CouponResponse = {
  id: string;
  eventId: string;
  code: string;
  discount: number;
  maxUsage: number;
  validUntil: string;
  validFrom: string;
  usageCount: number;
  ticketOrders: { id: string }[];
  createdAt: string;
  updatedAt: string;
};

export type CouponUpdateRequest = Partial<CouponRequest>;
