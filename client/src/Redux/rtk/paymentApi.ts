// src/api/paymentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1" }), // Update with your backend URL
  endpoints: (builder) => ({
    payOrder: builder.mutation({
      query: (paymentDetails) => ({
        url: "/payment/checkout",
        method: "POST",
        body: paymentDetails,
      }),
    }),
    getKey: builder.query({
      query: () => ({
        url: `/payment/key`,
        method: "GET",
      }),
    }),
    verifyPayment: builder.mutation({
        query: (paymentVerificationDetails) => ({
          url: "/payment/paymentVerification",
          method: "POST",
          body: paymentVerificationDetails,
        }),
      }),
  }),
});

export const { usePayOrderMutation, useGetKeyQuery , useVerifyPaymentMutation } = paymentApi;
export default paymentApi;
