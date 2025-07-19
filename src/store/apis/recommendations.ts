import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
import { Pagination } from "./posts";
import { Product } from "./products";

export interface RecommendationRequestDto {
  preferred_industries?: string[];
  preferred_supplier_type?: string;
  keywords?: string[];
}

export interface RecommendationResponse {
  status: string;
  message: string;
  data: {
    recommendations: Product[] | any[];
    user_id: string;
    recommendation_type: string;
    recommendation_reason: string;
    generated_at: string;
    used_preferences?: {
      user_id: string;
      selected_industries: string[];
      preferred_supplier_type: string;
    };
  };
}

export const recommendationApi = createApi({
  reducerPath: "recommendationApi",
  baseQuery,
  endpoints: (builder) => ({
    getProductRecommendations: builder.mutation<
      RecommendationResponse,
      {
        user_id?: string;
        num_recommendations?: number;
        force_refresh?: boolean;
        dto: RecommendationRequestDto;
      }
    >({
      query: ({
        user_id,
        num_recommendations = 10,
        force_refresh = false,
        dto,
      }) => ({
        url: "/recommendations/products",
        method: "POST",
        params: {
          ...(user_id && { user_id }),
          num_recommendations,
          force_refresh,
        },
        body: dto,
      }),
    }),

    getPostRecommendations: builder.mutation<
      RecommendationResponse,
      {
        user_id?: string;
        num_recommendations?: number;
        include_similar_rated?: boolean;
        force_refresh?: boolean;
        dto: RecommendationRequestDto;
      }
    >({
      query: ({
        user_id,
        num_recommendations = 10,
        include_similar_rated = false,
        force_refresh = false,
        dto,
      }) => ({
        url: "/recommendations/posts",
        method: "POST",
        params: {
          ...(user_id && { user_id }),
          num_recommendations,
          include_similar_rated,
          force_refresh,
        },
        body: dto,
      }),
    }),

    getProductRecommendationsByUserId: builder.query<
      RecommendationResponse,
      {
        userId: string;
        num_recommendations?: number;
        force_refresh?: boolean;
      }
    >({
      query: ({ userId, num_recommendations = 10, force_refresh = false }) => ({
        url: `/recommendations/products/${userId}`,
        method: "GET",
        params: {
          num_recommendations,
          force_refresh,
        },
      }),
    }),

    getPostRecommendationsByUserId: builder.query<
      RecommendationResponse,
      {
        userId: string;
        num_recommendations?: number;
        include_similar_rated?: boolean;
        force_refresh?: boolean;
      }
    >({
      query: ({
        userId,
        num_recommendations = 10,
        include_similar_rated = false,
        force_refresh = false,
      }) => ({
        url: `/recommendations/posts/${userId}`,
        method: "GET",
        params: {
          num_recommendations,
          include_similar_rated,
          force_refresh,
        },
      }),
    }),
  }),
});

export const {
  useGetProductRecommendationsMutation,
  useGetPostRecommendationsMutation,
  useGetProductRecommendationsByUserIdQuery,
  useGetPostRecommendationsByUserIdQuery,
} = recommendationApi;
