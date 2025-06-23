// import { useState, useCallback } from 'react';
// import { Message, MessageStatus } from '@/types/chat';
// // import { useChat } from '@/contexts/chat-context';

// export const useChatMessages = (conversationId?: string) => {
//   const { socket, isConnected, sendMessage: sendMessageContext } = useChat();
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const sendMessage = useCallback(async (content: string, receiverId: string) => {
//     if (!isConnected || !socket || !conversationId) {
//       setError(new Error('Not connected to chat server'));
//       return null;
//     }

//     setIsSending(true);
//     setError(null);

//     try {
//       // Create a temporary message for optimistic UI
//       const tempMessage: Message = {
//         messageId: `temp-${Date.now()}`,
//         conversationId,
//         // senderId: socket.id, // Will be replaced by server
//         receiverId,
//         content,
//         messageType: 'TEXT',
//         status: 'sent',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       // Send the message through the socket
//       sendMessageContext(content, receiverId);
      
//       return tempMessage;
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Failed to send message'));
//       return null;
//     } finally {
//       setIsSending(false);
//     }
//   }, [isConnected, socket, conversationId, sendMessageContext]);

//   const markAsRead = useCallback((messageId: string) => {
//     if (!isConnected || !socket) return;
    
//     socket.emit('updateMessageStatus', {
//       messageId,
//       status: 'seen' as MessageStatus,
//     });
//   }, [isConnected, socket]);

//   return {
//     sendMessage,
//     markAsRead,
//     isSending,
//     error,
//     isConnected,
//   };
// };
