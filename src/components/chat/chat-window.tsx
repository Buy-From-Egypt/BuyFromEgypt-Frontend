// import React, { useEffect, useRef } from 'react';
// import { Message } from './message';
// import { ChatInput } from './chat-input';
// import { Message as MessageType, User } from '@/types/chat';
// import { useChat } from '@/contexts/chat-context';
// import { Loader2 } from 'lucide-react';

// interface ChatWindowProps {
//   currentUser: User;
//   recipient?: User;
//   onClose: () => void;
// }

// export const ChatWindow: React.FC<ChatWindowProps> = ({
//   currentUser,
//   recipient,
//   onClose,
// }) => {
//   const { messages, sendMessage, markAsRead, activeConversation } = useChat();
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (activeConversation) {
//       markAsRead(activeConversation.conversationId);
//     }
//   }, [activeConversation, markAsRead]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = (content: string) => {
//     if (!recipient) return;
//     sendMessage(content, recipient.userId);
//   };

//   if (!recipient) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-gray-500">
//         <p>Select a conversation to start chatting</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat header */}
//       <div className="border-b p-4 flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
//               <img
//                 src={recipient.profileImage || '/images/user-placeholder.png'}
//                 alt={recipient.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//           </div>
//           <div>
//             <h3 className="font-medium">{recipient.name}</h3>
//             <p className="text-xs text-gray-500">
//               {true ? 'Online' : 'Offline'}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             <p>No messages yet. Say hi! 👋</p>
//           </div>
//         ) : (
//           messages.map((message) => (
//             <Message
//               key={message.messageId}
//               message={message}
//               isCurrentUser={message.senderId === currentUser.userId}
//             />
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t p-4">
//         <ChatInput onSend={handleSendMessage} />
//       </div>
//     </div>
//   );
// };
