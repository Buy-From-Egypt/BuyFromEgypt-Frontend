import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
export interface Post {
  cloudFolder: string;
  content: string;
  createdAt: string;
  postId: string;
  rating: number;
  reviewCount: number;
  title: string;
  updatedAt: string;
  userId: string;
}
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery,
  endpoints: (builder) => {
    return {
      createPost: builder.mutation({
        query: (body) => ({
          url: "/posts",
          method: "POST",
          body,
        }),
      }),
      getPosts: builder.query<Post[], void>({
        query: () => ({
          url: "/posts",
          method: "GET",
        }),
      }),
    };
  },
});

export const { useCreatePostMutation , useGetPostsQuery } = postsApi;
