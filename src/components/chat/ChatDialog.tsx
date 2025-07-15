"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useSendMessageMutation } from "@/store/apis/chat.api";
import { useSocket } from "@/hooks/use-socket";
import { toast } from "sonner";

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
  onSendMessage: (message: {
    senderId: string;
    receiverId: string;
    content: string;
    messageType: string;
  }) => void;
  isLoading?: boolean;
  conversationId?: string;
}

export function ChatDialog({
  open,
  onOpenChange,
  messages = [],
  currentUserId,
  otherParticipant,
  onSendMessage,
  isLoading = false,
  conversationId,
}: ChatDialogProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sendMessageToAPI, { isLoading: isSendingMessage }] =
    useSendMessageMutation();
  const { socket } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !otherParticipant || !currentUserId) return;

    console.log("Attempting to send message:", {
      senderId: currentUserId,
      receiverId: otherParticipant.userId,
      content: trimmedMessage,
      conversationId,
    });

    if (onSendMessage) {
      console.log("Using parent handleSendMessage");
      onSendMessage({
        senderId: currentUserId,
        receiverId: otherParticipant.userId,
        content: trimmedMessage,
        messageType: "TEXT",
      });
      setMessage("");
      return;
    }

    try {
      const messageData = conversationId
        ? {
            senderId: currentUserId,
            content: trimmedMessage,
            messageType: "TEXT" as const,
            conversationId: conversationId,
          }
        : {
            senderId: currentUserId,
            receiverId: otherParticipant.userId,
            content: trimmedMessage,
            messageType: "TEXT" as const,
          };

      console.log("Sending to API:", messageData);

      let messageId = `temp-${Date.now()}`;
      let createdAt = new Date().toISOString();

      try {
        const response = await sendMessageToAPI(messageData).unwrap();
        console.log("API Response:", response);
        messageId = response.id;
        createdAt = response.createdAt;
      } catch (apiError) {
        console.warn("API failed, using socket-only mode:", apiError);
      }

      if (socket?.connected) {
        console.log("Socket connected, sending message");
        const socketMessage = {
          senderId: currentUserId,
          receiverId: otherParticipant.userId,
          content: trimmedMessage,
          messageType: "TEXT",
          messageId,
          createdAt,
          ...(conversationId && { conversationId }),
        };
        console.log("Emitting sendMessage to socket:", socketMessage);
        socket.emit("sendMessage", socketMessage);
      } else {
        console.warn("Socket not connected");
        throw new Error("No connection to server");
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as { data?: { message?: string } };
        toast.error(
          `failed to send message: ${apiError.data?.message || "Server error"}`
        );
      } else {
        toast.error(
          "failed to send message: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) {
      console.log("No socket available in ChatDialog");
      return;
    }

    console.log("Setting up socket listener in ChatDialog");

    const handleReceiveMessage = (message: Message) => {
      console.log("ChatDialog received message:", message);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      console.log("Cleaning up socket listener in ChatDialog");
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] bg-white flex flex-col p-0">
        {otherParticipant && (
          <DialogHeader className="border-b p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={otherParticipant.profileImage || ""}
                    alt={otherParticipant.name}
                  />
                  <AvatarFallback>
                    {otherParticipant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {otherParticipant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                )}
              </div>
              <div>
                <DialogTitle className="text-lg">
                  {otherParticipant.name}
                </DialogTitle>
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
                  msg.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
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
              placeholder="Type a message."
              className="flex-1"
              disabled={isLoading || isSendingMessage}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading || isSendingMessage}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
