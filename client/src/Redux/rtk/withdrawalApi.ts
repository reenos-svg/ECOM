import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

interface Withdrawal {
  id?: string;
  vendorId: string;
  vendorName?: string;
  amount: number;
  accountHolderName: string;
  accountNumber: string;
  branchName: string;
  address: string;
  phoneNumber: string;
  status?: string;
}

export const withdrawalApi = createApi({
  reducerPath: "withdrawalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/withdrawl", // Corrected API base URL
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
    createWithdrawal: builder.mutation<Withdrawal, Partial<Withdrawal>>({
      query: (newWithdrawal) => ({
        url: "/new-withdrawal",
        method: "POST",
        body: newWithdrawal,
      }),
    }),
    getWithdrawals: builder.query<Withdrawal[], void>({
      query: () => ({
        url: "/withdrawals",
        method: "GET",
      }),
    }),
    getWithdrawalsByVendor: builder.query<Withdrawal[], void>({
      query: () => ({
        url: "/withdraw/vendor",
        method: "GET",
      }),
    }),
    updateWithdrawal: builder.mutation<
      Withdrawal,
      { id: string; updateData: Partial<Withdrawal> }
    >({
      query: ({ id, updateData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
    deleteWithdrawal: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateWithdrawalMutation,
  useGetWithdrawalsQuery,
  useGetWithdrawalsByVendorQuery,
  useUpdateWithdrawalMutation,
  useDeleteWithdrawalMutation,
} = withdrawalApi;
