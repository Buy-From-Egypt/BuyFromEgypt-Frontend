import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  NextPage: boolean;
  PreviousPage: boolean;
}
export interface Post {
  postId: string;
  title: string;
  content: string;
  cloudFolder: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewCount: number;
  comments_count: number;
  user: {
    userId: string;
    name: string;
    profileImage: string;
  };
  images: Array<{
    id: string;
    url: string;
    postId: string;
  }>;
}
export interface PostResponse {
  data: Post[];
  meta: Pagination;
}
export interface RatePostRequest {
  postId: string;
  value: number;
}
export interface RatePostResponse {
  message: string;
}
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery,
  tagTypes: ["Posts"],
  endpoints: (builder) => {
    return {
      createPost: builder.mutation({
        query: (body) => ({
          url: "/posts",
          method: "POST",
          body,
        }),
      }),
      getPosts: builder.query<PostResponse, { page?: number; limit?: number }>({
        query: ({ page = 1, limit = 10 } = {}) => ({
          url: "/posts",
          method: "GET",
          params: {
            page,
            limit,
          },
        }),
      }),
      ratePost: builder.mutation<RatePostResponse, RatePostRequest>({
        query: ({ value, postId }) => ({
          url: `/rating/post/${postId}`,
          method: "POST",
          body: { value },
        }),
      }),
      getPostId: builder.query<Post, { postId: string }>({
        query: ({ postId }) => ({
          url: `/posts/${postId}`,
        }),
      }),
    };
  },
});

export const {
  useGetPostIdQuery,
  useCreatePostMutation,
  useGetPostsQuery,
  useRatePostMutation,
} = postsApi;
