// categories

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery,
  endpoints: (builder) => {
    return {
      getCategories: builder.query({
        query: () => ({
          url: "/categories",
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetCategoriesQuery } = categoryApi;