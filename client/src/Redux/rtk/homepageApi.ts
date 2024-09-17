import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define your base query function
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1/homepage", // Replace with your actual API base URL
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).userDetails; // Assuming your token is stored in auth slice
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Types for Image data
export interface Image {
  status: string;
  _id: string;
  url: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
}

export interface UploadError {
  message: string;
}

// Homepage API Slice
export const homepageApi = createApi({
  reducerPath: "homepageApi",
  baseQuery,
  tagTypes: ["Carousel", "SizeChart"],
  endpoints: (builder) => ({
    // Fetch Carousel Images
    fetchCarouselImages: builder.query<Image[], void>({
      query: () => "/carousel",
      providesTags: ["Carousel"],
    }),

    // Fetch Size Chart Images
    fetchSizeChartImages: builder.query<Image, void>({
      query: () => "/sizechart",
      providesTags: ["SizeChart"],
    }),

    // Upload Carousel Image
    uploadCarouselImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/carousel/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Carousel"],
    }),

    // Upload Size Chart Image
    uploadSizeChartImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/sizechart/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SizeChart"],
    }),

    // Delete Carousel Image
    deleteCarouselImage: builder.mutation<void, string>({
      query: (imageId) => ({
        url: `/carousel/delete/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Carousel"],
    }),

    setActiveSizeChartImage: builder.mutation({
      query: (imageId) => ({
        url: `/sizechart/setActive/${imageId}`,
        method: "PUT",
      }),
    }),

    // Delete Size Chart Image
    deleteSizeChartImage: builder.mutation<void, string>({
      query: (imageId) => ({
        url: `/sizechart/delete/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SizeChart"],
    }),
  }),
});

// Export the hooks
export const {
  useFetchCarouselImagesQuery,
  useFetchSizeChartImagesQuery,
  useUploadCarouselImageMutation,
  useUploadSizeChartImageMutation,
  useDeleteCarouselImageMutation,
  useDeleteSizeChartImageMutation,
  useSetActiveSizeChartImageMutation,
} = homepageApi;
