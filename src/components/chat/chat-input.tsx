// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Send, Image as ImageIcon, Paperclip } from 'lucide-react';

// interface ChatInputProps {
//   onSend: (content: string) => void;
//   disabled?: boolean;
// }

// export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
//   const [message, setMessage] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!message.trim() || disabled) return;
    
//     onSend(message);
//     setMessage('');
//     inputRef.current?.focus();
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
//       <div className="flex items-center gap-2">
//         <Button type="button" variant="ghost" size="icon" disabled={disabled}>
//           <Paperclip className="h-5 w-5" />
//           <span className="sr-only">Attach file</span>
//         </Button>
//         <Button type="button" variant="ghost" size="icon" disabled={disabled}>
//           <ImageIcon className="h-5 w-5" />
//           <span className="sr-only">Send image</span>
//         </Button>
//       </div>
//       <Input
//         ref={inputRef}
//         type="text"
//         placeholder="Type a message..."
//         className="flex-1"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         disabled={disabled}
//       />
//       <Button type="submit" size="icon" disabled={!message.trim() || disabled}>
//         <Send className="h-5 w-5" />
//         <span className="sr-only">Send message</span>
//       </Button>
//     </form>
//   );
// };
