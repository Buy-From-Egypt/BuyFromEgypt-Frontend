// import React, { useState } from 'react';
// import { Dialog, DialogContent } from '@/components/ui/dialog';
// import { ConversationList } from './conversation-list';
// import { ChatWindow } from './chat-window';
// import { User, Conversation } from '@/types/chat';
// import { useChat } from '@/contexts/chat-context';
// import { Button } from '@/components/ui/button';
// import { MessageSquare, X } from 'lucide-react';

// interface ChatProps {
//   currentUser: User;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const Chat: React.FC<ChatProps> = ({ currentUser, isOpen, onClose }) => {
//   const { conversations, activeConversation, setActiveConversation } = useChat();
//   const [isMobileListOpen, setIsMobileListOpen] = useState(true);

//   // Get the other participant in the active conversation
//   const recipient = activeConversation?.participants.find(
//     (p) => p.userId !== currentUser.userId
//   );

//   const handleSelectConversation = (conversation: Conversation) => {
//     setActiveConversation(conversation);
//     setIsMobileListOpen(false);
//   };

//   const handleBackToList = () => {
//     setIsMobileListOpen(true);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl   bg-white h-[80vh] p-0 flex overflow-hidden">
//         {/* Desktop: Always show both panels */}
//         <div className="hidden md:flex w-full h-full">
//           {/* Conversation list */}
//           <div className="w-1/3 border-r overflow-y-auto">
//             <div className="p-4 border-b">
//               <h2 className="text-lg font-semibold">Messages</h2>
//             </div>
//             <ConversationList
//               conversations={conversations}
//               currentUser={currentUser}
//               onSelectConversation={handleSelectConversation}
//               selectedConversationId={activeConversation?.conversationId}
//             />
//           </div>

//           {/* Chat window */}
//           <div className="flex-1 flex flex-col">
//             <ChatWindow
//               currentUser={currentUser}
//               recipient={recipient}
//               onClose={onClose}
//             />
//           </div>
//         </div>

//         {/* Mobile: Show either list or chat */}
//         <div className="md:hidden w-full h-full">
//           {isMobileListOpen ? (
//             <div className="flex flex-col h-full">
//               <div className="p-4 border-b flex items-center justify-between">
//                 <h2 className="text-lg font-semibold">Messages</h2>
//                 <Button variant="ghost" size="icon" onClick={onClose}>
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>
//               <ConversationList
//                 conversations={conversations}
//                 currentUser={currentUser}
//                 onSelectConversation={handleSelectConversation}
//                 selectedConversationId={activeConversation?.conversationId}
//               />
//             </div>
//           ) : (
//             <div className="h-full flex flex-col">
//               <div className="p-4 border-b flex items-center">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="mr-2"
//                   onClick={handleBackToList}
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </Button>
//                 <h2 className="text-lg font-semibold">
//                   {recipient?.name || 'Chat'}
//                 </h2>
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 <ChatWindow
//                   currentUser={currentUser}
//                   recipient={recipient}
//                   onClose={onClose}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
//   return (
//     <Button
//       onClick={onClick}
//       className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-lg"
//     >
//       <MessageSquare className="h-6 w-6" />
//       <span className="sr-only">Open chat</span>
//     </Button>
//   );
// };
