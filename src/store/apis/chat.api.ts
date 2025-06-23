import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";

// NOTE: This is an assumption of the data structure based on the UI.
// We may need to adjust it based on the actual API response.
interface ConversationUser {
  userId: string;
  name: string;
  profileImage: string;
}

interface LastMessage {
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: ConversationUser[];
  lastMessage: LastMessage;
  unreadCount: number;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Conversations"],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], string>({
      query: (userId) => `chat/conversations?userId=${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Conversations" as const, id })),
              { type: "Conversations", id: "LIST" },
            ]
          : [{ type: "Conversations", id: "LIST" }],
    }),
  }),
});

export const { useGetConversationsQuery } = chatApi;
