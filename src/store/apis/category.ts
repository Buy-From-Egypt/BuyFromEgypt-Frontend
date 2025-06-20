// categories

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
export interface Category {
  categoryId: string;
  name: string;
  productCount: number;
}
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery,
  endpoints: (builder) => {
    return {
      getCategories: builder.query({
        query: () => ({
          url: "/products/categories-with-count",
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetCategoriesQuery } = categoryApi;
