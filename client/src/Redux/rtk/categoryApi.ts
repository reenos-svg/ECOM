// src/services/categoryApiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SubCategory {
  _id: string;
  name: string;
  parentCategory: string;
  subCategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Category {
  _id: string;
  name: string;
  parentCategory: string | null;
  subCategories: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface GetCategoriesResponse {
  success: boolean;
  category: Category[];
}

export const categoryApiSlice = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/category",
  }), // Adjust the base URL if needed
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories", // API endpoint for fetching all categories
      transformResponse: (response: GetCategoriesResponse) => response.category, // Extract categories from the response
    }),
    addSubCategory: builder.mutation<
      void,
      { categoryId: string; name: string }
    >({
      query: ({ categoryId, name }) => ({
        url: `/categories/${categoryId}/subcategories`,
        method: "POST",
        body: { name },
      }),
    }),
    addCategory: builder.mutation<void, { name: string }>({
      query: ({ name }) => ({
        url: `/create-category`,
        method: "POST",
        body: { name },
      }),
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  tagTypes: ["Category"],
});

export const {
  useGetCategoriesQuery,
  useAddSubCategoryMutation,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} = categoryApiSlice;
