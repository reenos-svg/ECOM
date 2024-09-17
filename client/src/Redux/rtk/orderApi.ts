import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define your base query function
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1/order/", // Replace with your actual API base URL
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).userDetails; // Assuming your token is stored in auth slice
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create the API slice
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => "/orders",
    }),
    getOrderById: builder.query({
      query: (id) => `/${id}`,
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `/${orderId}/status`,
        method: "PUT",
        body: { orderStatus },
      }),
    }),
    getRecentOrdersByVendorId: builder.query({
      query: (vendorId) => ({
        url: `/${vendorId}/recent-orders`,
        method: "GET",
      }),
    }),
    getOrderValuesLast6Months: builder.query({
      query: () => `/values/last-6-months`,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetRecentOrdersByVendorIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrderValuesLast6MonthsQuery,
} = orderApi;
