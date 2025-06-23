export type MessageStatus = 'sent' | 'delivered' | 'seen';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE';

export interface User {
  userId: string;
  name: string;
  profileImage?: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  // senderId: string;
  receiverId: string;
  sender?: {
    userId: string;
    name: string;
    profileImage?: string;
  };
  content: string;
  messageType: MessageType;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  conversationId: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
  messageType: MessageType;
}

export interface UpdateMessageStatusPayload {
  messageId: string;
  status: MessageStatus;
}

export interface MarkConversationAsReadPayload {
  conversationId: string;
  userId: string;
}

export interface SocketEvents {
  // Emit events
  'sendMessage': (payload: SendMessagePayload) => void;
  'updateMessageStatus': (payload: UpdateMessageStatusPayload) => void;
  'markConversationAsRead': (payload: MarkConversationAsReadPayload) => void;
  
  // Listen events
  'receiveMessage': (message: Message) => void;
  'messageStatusUpdated': (payload: { messageId: string; status: MessageStatus }) => void;
  'messageSent': (message: Message) => void;
  'conversationRead': (payload: { conversationId: string; userId: string }) => void;
  'error': (error: string) => void;
}
