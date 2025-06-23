"use client";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  messageType: string;
  seen?: boolean;
  delivered?: boolean;
  profileImage?: string | null;
  sender?: {
    userId: string;
    name: string;
    profileImage?: string | null;
  };
}

export interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  currentUserId?: string;
  otherParticipant?: {
    userId: string;
    name: string;
    profileImage?: string | null;
    isOnline?: boolean;
  };
  onSendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  isLoading?: boolean;
  conversationId?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}



export function ChatDialog({
  open,
  onOpenChange,
  messages = [],
  currentUserId,
  otherParticipant,
  onSendMessage,
  isLoading = false,
}: ChatDialogProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !otherParticipant) return;

    onSendMessage({
      senderId: currentUserId || '',
      receiverId: otherParticipant.userId,
      content: trimmedMessage,
      messageType: 'TEXT'
    });
    
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] bg-white flex flex-col p-0">
        {otherParticipant && (
          <DialogHeader className="border-b p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant.profileImage || ""} alt={otherParticipant.name} />
                  <AvatarFallback>
                    {otherParticipant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {otherParticipant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                )}
              </div>
              <div>
                <DialogTitle className="text-lg">{otherParticipant.name}</DialogTitle>
              </div>
            </div>
          </DialogHeader>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.senderId === currentUserId ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    msg.senderId === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      msg.senderId === currentUserId
                        ? "text-white"
                        : "text-black"
                    )}
                  >
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!message.trim() || isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
