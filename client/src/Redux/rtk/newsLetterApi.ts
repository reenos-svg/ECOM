// src/features/newsletter/newsletterApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/newsletter",
  }),
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "/subscribe",
        method: "POST",
        body: { address: email },
      }),
    }),
    getEmails: builder.query({
      query: () => "/emails",
    }),
  }),
});

export const { useSubscribeNewsletterMutation, useGetEmailsQuery } =
  newsletterApi;
