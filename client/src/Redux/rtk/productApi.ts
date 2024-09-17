// productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export interface ProductProps {
  productTheme: string | null;
  productColors: [
    {
      colorCode: string;
      colorName: string;
      imageUrl: string[];
    }
  ];

  isFeatured: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  vendorId: {
    _id: string;
    name: string;
  };
  productName: string;
  productDescription: string;
  productCategory: {
    id: string;
    name: string;
  };
  productPrice: number;
  discountedProductPrice: number;
  productImages: string[];
  productSize: string[];
  productStock: number;
  productSubCategory: {
    id: string;
    name: string;
  };
  reviews: {
    userId: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    _id: string;
    createdAt: string;
  }[];
}

// Define your base query function
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1", // Replace with your actual API base URL
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).userDetails; // Assuming your token is stored in auth slice
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// Define a service using `createApi`
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery,
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchProductsByVendor: builder.query({
      query: (vendorId) => ({
        url: `/product/products/${vendorId}`,
        method: "GET",
      }), // Assumes your API endpoint for fetching products

      // Provides tags for caching the specific Campaign List to optimize data fetching
      providesTags: (result, _error, Products) =>
        result ? [{ type: "Products", id: Products }] : [],
    }),
    fetchAllProducts: builder.query({
      query: () => ({
        url: "/product/products",
        method: "GET",
      }), // Assumes your API endpoint for fetching products

      // Provides tags for caching the specific Campaign List to optimize data fetching
      providesTags: (result) => (result ? [{ type: "Products" }] : []),
    }),
    fetchRecentProducts: builder.query({
      query: ({ id }) => ({
        url: `/product/${id}/products`,
        method: "GET",
      }), // Assumes your API endpoint for fetching products

      // Provides tags for caching the specific Campaign List to optimize data fetching
      providesTags: (result, _error, PrductList) =>
        result ? [{ type: "Products", id: PrductList }] : [],
    }),
    createProduct: builder.mutation({
      query: (productData: ProductProps, vendorId: string) => ({
        url: `/product/create-product/${vendorId}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: [{ type: "Products", id: "ProductList" }],
    }),
    searchProducts: builder.query({
      query: (keyword: string) => `/product/search?keyword=${keyword}`,
    }),
    updateProduct: builder.mutation({
      query: ({ vendorId, productId, updatedData }) => ({
        url: `/update-product/${vendorId}/${productId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: ({ productId, vendorId }) => ({
        url: `/product/delete-product/${vendorId}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    addReview: builder.mutation({
      query: ({ userId, productId, review }) => ({
        url: `product/${userId}/${productId}/reviews`,
        method: "POST",
        body: review,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useFetchAllProductsQuery,
  useFetchRecentProductsQuery,
  useFetchProductsByVendorQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddReviewMutation,
  useSearchProductsQuery,
} = productApi;
