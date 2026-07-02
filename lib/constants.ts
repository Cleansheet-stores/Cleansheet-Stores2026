export const STORE_NAME = "Clean Sheet Stores";
export const STORE_TAGLINE = "Premium Football Jerseys";

export const PHONE = "9363022434";
export const PHONE_DISPLAY = "+91 93630 22434";
export const EMAIL = "guhamsd74@gmail.com";
export const UPI_ID = "guhamsd74@oksbi";
export const WHATSAPP_URL = `https://wa.me/91${PHONE}`;

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type JerseySize = (typeof SIZES)[number];

export const CATEGORIES = ["Club", "National Team", "Retro"] as const;

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
