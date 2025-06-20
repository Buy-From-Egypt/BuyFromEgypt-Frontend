import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
import { 
  SocialMedia, 
  CreateSocialMediaDto, 
  UpdateSocialMediaDto 
} from "@/types/social-media";

interface Image {
  id: string;
  url: string;
  isPrimary?: boolean;
  postId?: string;
  productId?: string;
}

interface Post {
  postId: string;
  title: string;
  content: string;
  createdAt: string;
  images: Image[];
}

interface Category {
  categoryId: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  productId: string;
  name: string;
  price: number;
  currencyCode: string;
  images: Image[];
  rating: number;
  reviewCount: number;
}

interface Follow {
  followId: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  age: number;
  type: string;
  address: string;
  active: boolean;
  profileImage: string | null;
  about: string | null;
  role: string;
  socialLinks: SocialMedia[];
  posts: Post[];
  coverImage: string | null;
  categories: Category[];
  cityState: string;
  postCode: string;
  products: Product[];
  followers: Follow[];
  following: Follow[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: `/users/profile`,
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/profile`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});
export const socialMediaApi = createApi({
  reducerPath: 'socialMediaApi',
  baseQuery,
  tagTypes: ['SocialMedia'],
  endpoints: (builder) => ({
    getSocialMedias: builder.query<SocialMedia[], void>({
      query: () => 'social-media',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'SocialMedia' as const, id })),
              { type: 'SocialMedia', id: 'LIST' },
            ]
          : [{ type: 'SocialMedia', id: 'LIST' }],
    }),
    createSocialMedia: builder.mutation<SocialMedia, CreateSocialMediaDto>({
      query: (body) => ({
        url: 'social-media',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SocialMedia', id: 'LIST' }],
    }),
    updateSocialMedia: builder.mutation<SocialMedia, { id: string; data: UpdateSocialMediaDto }>({
      query: ({ id, data }) => ({
        url: `social-media/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SocialMedia', id }],
    }),
    deleteSocialMedia: builder.mutation<void, string>({
      query: (id) => ({
        url: `social-media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'SocialMedia', id }],
    }),
  }),
});

export const { 
  useUpdateProfileMutation, 
  useGetProfileQuery 
} = profileApi;

export const { 
  useGetSocialMediasQuery,
  useCreateSocialMediaMutation,
  useUpdateSocialMediaMutation,
  useDeleteSocialMediaMutation 
} = socialMediaApi;
