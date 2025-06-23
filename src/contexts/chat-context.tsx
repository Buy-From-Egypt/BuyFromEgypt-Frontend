// import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { SocketEvents, Message, Conversation, User, MessageStatus } from '@/types/chat';

// type SocketType = Socket<SocketEvents> | null;

// interface ChatContextType {
//   socket: SocketType;
//   isConnected: boolean;
//   conversations: Conversation[];
//   activeConversation: Conversation | null;
//   messages: Message[];
//   setActiveConversation: (conversation: Conversation | null) => void;
//   sendMessage: (content: string, receiverId: string) => void;
//   markAsRead: (conversationId: string) => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ 
//   children, 
//   userId 
// }) => {
//   const [socket, setSocket] = useState<SocketType>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
  
//   // Get current user from auth context or props
//   const currentUser = useMemo(() => ({
//     userId: 'current-user-id', // Replace with actual user ID from auth context
//     name: 'Current User',
//     email: 'user@example.com',
//     profileImage: '/images/user-placeholder.png',
//   }), []);

//   useEffect(() => {
//     // Initialize socket connection
//     const socketInstance = io('ws://localhost:3000/chat', {
//       query: { userId },
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     setSocket(socketInstance);

//     socketInstance.on('connect', () => {
//       setIsConnected(true);
//       console.log('Connected to chat server');
//     });

//     socketInstance.on('disconnect', () => {
//       setIsConnected(false);
//       console.log('Disconnected from chat server');
//     });

//     socketInstance.on('receiveMessage', (message: Message) => {
//       setMessages(prev => [...prev, message]);
      
//       // Update last message in conversations
//       setConversations(prev => 
//         prev.map(conv => {
//           if (conv.conversationId === message.conversationId) {
//             return {
//               ...conv,
//               lastMessage: message,
//               unreadCount: conv.conversationId === activeConversation?.conversationId 
//                 ? 0 
//                 : conv.unreadCount + 1,
//               updatedAt: new Date().toISOString(),
//             };
//           }
//           return conv;
//         })
//       );
//     });
    
//     socketInstance.on('messageStatusUpdated', (payload: { messageId: string; status: MessageStatus }) => {
//       const { messageId, status } = payload;
      
//       // Update message status in messages list
//       setMessages(prev => 
//         prev.map(msg => 
//           msg.messageId === messageId 
//             ? { ...msg, status, updatedAt: new Date().toISOString() } 
//             : msg
//         )
//       );
      
//       // Update last message in conversations if needed
//       setConversations(prev => 
//         prev.map(conv => {
//           if (conv.lastMessage?.messageId === messageId) {
//             return {
//               ...conv,
//               lastMessage: {
//                 ...conv.lastMessage!,
//                 status,
//                 updatedAt: new Date().toISOString(),
//               }
//             };
//           }
//           return conv;
//         })
//       );
//     });
    
//     socketInstance.on('conversationRead', (payload: { conversationId: string; userId: string }) => {
//       const { conversationId, userId } = payload;
      
//       // Only process if the message was read by someone else
//       if (userId !== currentUser?.userId) {
//         // Update messages status to 'seen' for this conversation
//         setMessages(prev => 
//           prev.map(msg => 
//             msg.conversationId === conversationId && msg.senderId !== userId
//               ? { ...msg, status: 'seen', updatedAt: new Date().toISOString() }
//               : msg
//           )
//         );
        
//         // Update conversation's unread count
//         setConversations(prev => 
//           prev.map(conv => 
//             conv.conversationId === conversationId
//               ? { ...conv, unreadCount: 0 }
//               : conv
//           )
//         );
//       }
//     });
    
//     socketInstance.on('messageSent', (message: Message) => {
//       // Update the message with server-generated ID and timestamp
//       setMessages(prev => 
//         prev.map(msg => 
//           msg.senderId === message.senderId && 
//           msg.receiverId === message.receiverId &&
//           !msg.messageId.startsWith('temp-') && 
//           msg.content === message.content
//             ? message
//             : msg
//         )
//       );
      
//       // Update last message in conversations
//       setConversations(prev => 
//         prev.map(conv => {
//           if (conv.conversationId === message.conversationId) {
//             return {
//               ...conv,
//               lastMessage: message,
//               updatedAt: new Date().toISOString(),
//             };
//           }
//           return conv;
//         })
//       );
//     });

//     socketInstance.on('messageStatusUpdated', ({ messageId, status }) => {
//       setMessages(prev =>
//         prev.map(msg =>
//           msg.messageId === messageId ? { ...msg, status } : msg
//         )
//       );
//     });

//     socketInstance.on('conversationRead', ({ conversationId, userId: readByUserId }) => {
//       if (readByUserId !== userId) {
//         setMessages(prev =>
//           prev.map(msg =>
//             msg.conversationId === conversationId && msg.senderId !== userId
//               ? { ...msg, status: 'seen' as const }
//               : msg
//           )
//         );
//       }
//     });

//     // Clean up on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [userId]);

//   const sendMessage = (content: string, receiverId: string) => {
//     if (!socket || !isConnected) return;

//     const message: Parameters<SocketEvents['sendMessage']>[0] = {
//       senderId: userId,
//       receiverId,
//       content,
//       messageType: 'TEXT',
//     };

//     socket.emit('sendMessage', message);
//   };

//   const markAsRead = (conversationId: string) => {
//     if (!socket || !isConnected) return;
    
//     socket.emit('markConversationAsRead', {
//       conversationId,
//       userId,
//     });

//     // Update local state
//     setConversations(prev =>
//       prev.map(conv =>
//         conv.conversationId === conversationId
//           ? { ...conv, unreadCount: 0 }
//           : conv
//       )
//     );
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         socket,
//         isConnected,
//         conversations,
//         activeConversation,
//         messages,
//         setActiveConversation,
//         sendMessage,
//         markAsRead,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = (): ChatContextType => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };
