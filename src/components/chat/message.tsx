// import React from 'react';
// import Image from 'next/image';
// import { format } from 'date-fns';
// import { Message as MessageType, MessageStatus } from '@/types/chat';
// import { cn } from '@/lib/utils';

// interface MessageProps {
//   message: MessageType;
//   isCurrentUser: boolean;
// }

// const statusIcons = {
//   sent: '✓',
//   delivered: '✓✓',
//   seen: '✓✓✓',
// };

// export const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
//   const statusIcon = statusIcons[message.status];
//   const time = format(new Date(message.createdAt), 'h:mm a');

//   return (
//     <div
//       className={cn(
//         'flex mb-4',
//         isCurrentUser ? 'justify-end' : 'justify-start'
//       )}
//     >
//       {!isCurrentUser && (
//         <div className="mr-2">
//           <Image
//             src={message.sender?.profileImage || '/images/user-placeholder.png'}
//             alt={message.sender?.name || 'User'}
//             width={32}
//             height={32}
//             className="rounded-full"
//           />
//         </div>
//       )}
//       <div
//         className={cn(
//           'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
//           isCurrentUser
//             ? 'bg-primary text-white rounded-br-none'
//             : 'bg-gray-100 text-gray-900 rounded-bl-none',
//           'relative'
//         )}
//       >
//         <p className="text-sm">{message.content}</p>
//         <div className="flex items-center justify-end mt-1">
//           <span className="text-xs opacity-70">{time}</span>
//           {isCurrentUser && (
//             <span className="ml-1 text-xs">{statusIcon}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
