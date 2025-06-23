import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { postsApi } from "./apis/posts";
import { categoryApi } from "./apis/category";
import { productsApi } from "./apis/products";
import { userApi } from "./apis/user.api";
import { profileApi, socialMediaApi } from "./apis/profile";
import { chatApi } from "./apis/chat.api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [socialMediaApi.reducerPath]: socialMediaApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postsApi.middleware,
      categoryApi.middleware,
      productsApi.middleware,
      userApi.middleware,
      profileApi.middleware,
      socialMediaApi.middleware,
      chatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
