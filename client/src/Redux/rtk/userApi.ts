import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

interface UserData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  items: string[];
  total: number;
}

interface OrderData {
  items: string[];
  total: number;
}

export const registerApi = createApi({
  reducerPath: "registerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).userDetails;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Orders"], // Add tag types here
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, UserData>({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),
    updateUser: builder.mutation<void, Partial<UserData>>({
      query: (updatedData) => ({
        url: "/user/update",
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: "/user/get-user",
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : [],
    }),
    getUserOrders: builder.query<Order[], string>({
      query: (userId) => `/user/${userId}/orders`,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      providesTags: (result, _error) =>
        result ? result.map(({ id }) => ({ type: "Orders", id })) : [],
    }),
    createOrder: builder.mutation<
      void,
      { userId: string; vendorId: string; orderData: OrderData }
    >({
      query: ({ userId, orderData }) => ({
        url: `/user/${userId}/create-order`,
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Orders", id: userId },
      ],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCreateOrderMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetUserOrdersQuery,
} = registerApi;
