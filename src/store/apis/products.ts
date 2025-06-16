import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";
export interface Product {
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currencyCode: string;
  active: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  category: {
    categoryId: string;
    name: string;
    description: string;
  };
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
    productId: string;
  }>;
}
export interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    NextPage: boolean;
    PreviousPage: boolean;
  };
}
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  endpoints: (builder) => {
    return {
      getProducts: builder.query<ProductResponse, { [k: string]: string }>({
        query: (params) => ({
          url: "/products",
          method: "GET",
          params,
        }),
      }),
    };
  },
});
export const { useGetProductsQuery } = productsApi;
