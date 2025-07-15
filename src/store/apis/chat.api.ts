import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query.api";

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

export interface SendMessageRequest {
  senderId: string;
  content: string;
  messageType: "TEXT" | "IMAGE" | "FILE";
  receiverId?: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  createdAt: string;
  conversationId: string;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Conversations", "Messages"],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], string>({
      query: (userId) => `chat/conversations?userId=${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Conversations" as const,
                id,
              })),
              { type: "Conversations", id: "LIST" },
            ]
          : [{ type: "Conversations", id: "LIST" }],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (message) => ({
        url: "chat/sendMessage",
        method: "POST",
        body: message,
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }, "Messages"],
    }),
  }),
});

export const { useGetConversationsQuery, useSendMessageMutation } = chatApi;
