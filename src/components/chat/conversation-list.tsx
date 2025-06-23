// import React from 'react';
// import Image from 'next/image';
// import { format } from 'date-fns';
// import { Conversation, User } from '@/types/chat';
// import { cn } from '@/lib/utils';

// interface ConversationListProps {
//   conversations: Conversation[];
//   currentUser: User;
//   onSelectConversation: (conversation: Conversation) => void;
//   selectedConversationId?: string;
// }

// export const ConversationList: React.FC<ConversationListProps> = ({
//   conversations,
//   currentUser,
//   onSelectConversation,
//   selectedConversationId,
// }) => {
//   if (conversations.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full text-gray-500">
//         <p>No conversations yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="divide-y">
//       {conversations.map((conversation) => {
//         // Get the other participant (not the current user)
//         const otherParticipant = conversation.participants.find(
//           (p) => p.userId !== currentUser.userId
//         );

//         if (!otherParticipant) return null;

//         const lastMessage = conversation.lastMessage;
//         const hasUnread = conversation.unreadCount > 0;
//         const isSelected = selectedConversationId === conversation.conversationId;

//         return (
//           <div
//             key={conversation.conversationId}
//             className={cn(
//               'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
//               isSelected && 'bg-gray-100',
//               hasUnread && 'bg-blue-50 hover:bg-blue-50'
//             )}
//             onClick={() => onSelectConversation(conversation)}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
//                   <Image
//                     src={otherParticipant.profileImage || '/images/user-placeholder.png'}
//                     alt={otherParticipant.name}
//                     width={48}
//                     height={48}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-medium text-sm truncate">
//                     {otherParticipant.name}
//                   </h4>
//                   {lastMessage && (
//                     <span className="text-xs text-gray-500">
//                       {format(new Date(lastMessage.createdAt), 'h:mm a')}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center justify-between mt-1">
//                   <p className="text-xs text-gray-500 truncate">
//                     {lastMessage?.content || 'No messages yet'}
//                   </p>
//                   {hasUnread && (
//                     <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                       {conversation.unreadCount}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
