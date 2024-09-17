import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define the API endpoints and types
export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountAmount: number;
  validFrom: string;
  validUntil: string;
  minOrderAmount: number;
  validCategories: string[];
  createdBy: string;
  status?: string;
}

interface CreateCouponRequest {
  code: string;
  description: string;
  discountAmount: number;
  validFrom: string;
  validUntil: string;
  minOrderAmount: number;
  validCategories: string[];
}

interface ApplyCouponRequest {
  code: string;
  orderAmount: number;
//   category: string;
}

interface ApplyCouponResponse {
  isValid: boolean;
  discount: number;
}

// Define your base query function
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1/coupon/", // Replace with your actual API base URL
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).userDetails; // Assuming your token is stored in auth slice
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery,
  endpoints: (builder) => ({
    createCoupon: builder.mutation<Coupon, CreateCouponRequest>({
      query: (body) => ({
        url: "/create-coupon",
        method: "POST",
        body,
      }),
    }),
    getAllCoupons: builder.query<Coupon[], void>({
      query: () => "/coupons",
    }),
    getCouponById: builder.query<Coupon, string>({
      query: (id) => `/coupons/${id}`,
    }),
    getCouponsByVendorId: builder.query<Coupon[], string>({
      query: (vendorId) => `/vendor/${vendorId}`,
    }),
    updateCoupon: builder.mutation<
      Coupon,
      { id: string; data: Partial<Coupon> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCoupon: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    applyCoupon: builder.mutation<ApplyCouponResponse, ApplyCouponRequest>({
      query: (body) => ({
        url: "/apply",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useGetCouponsByVendorIdQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponsApi;
