import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { VendorProps } from "../../Components/Dashboard/AllVendors";
import { RootState } from "../store";

export interface Vendor {
  vendor: {
    _id: string | null;
    name: string;
    email: string;
    password?: string;
    phoneNumber?: number;
    address: string;
    role: string;
    zipcode: number;
    createdAt: string;
  };
}

export const vendorApi = createApi({
  reducerPath: "vendorApi", // Unique name for this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/vendor/", // Your API base URL
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).userDetails; // Assuming your token is stored in auth slice
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllVendors: builder.query<{ vendors: VendorProps[] }, void>({
      query: () => ({
        url: `vendors`,
        method: "GET",
      }), // Assumes your API endpoint for fetching products
    }),
    getAllOrdersByVendor: builder.query<{ vendors: VendorProps[] }, string>({
      query: (vendorId: string) => ({
        url: `/${vendorId}/orders`,
        method: "GET",
      }), // Assumes your API endpoint for fetching products
    }),
    getVendor: builder.query<Vendor, string>({
      query: () => ({
        url: "/get-vendor",
        method: "GET",
      }),
    }),
    updateVendor: builder.mutation<void, Partial<Vendor>>({
      query: (updatedData) => ({
        url: "/update-vendor",
        method: "PUT",
        body: updatedData,
      }),
    }),
    deleteVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/${vendorId}`,
        method: "DELETE",
      }),
    }),
    getOrdersSummary: builder.query({
      query: () => `orders/summary`,
    }),
  }),
});

export const {
  useGetVendorQuery,
  useDeleteVendorMutation,
  useGetAllVendorsQuery,
  useGetAllOrdersByVendorQuery,
  useUpdateVendorMutation,
  useGetOrdersSummaryQuery,
} = vendorApi; // Export the generated hook
