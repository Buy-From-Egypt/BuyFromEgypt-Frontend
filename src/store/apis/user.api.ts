import { UserSummary } from "@/components/aside/company-card";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";

export const userApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getUserSummary: builder.query<UserSummary, string>({
      query: (userId) => `/users/${userId}/summary`,
    }),
  }),
});

export const { useGetUserSummaryQuery } = userApi;
