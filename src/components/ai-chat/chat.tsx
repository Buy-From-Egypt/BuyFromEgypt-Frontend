"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import Message from "./message";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useChatWithAIMutation } from "@/store/apis/auth.api";
import { Loader2, Send, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const chatInputSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type ChatInput = z.infer<typeof chatInputSchema>;

function AiChat({
  is_open,
  setIsOpen,
}: {
  is_open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatWithAI, { isLoading }] = useChatWithAIMutation();

  const form = useForm<ChatInput>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const onSubmit = async (data: ChatInput) => {
    const userMessage = data.message;
    addMessage(userMessage, true);
    form.reset();

    try {
      const response = await chatWithAI({
        message: userMessage,
        ...(sessionId && { session_id: sessionId }),
      }).unwrap();

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      addMessage(response.response, false);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage(
        "Sorry, I'm having trouble connecting. Please try again later.",
        false
      );
    }
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="!top-[45%] bg-gray-50 !p-0 !border-0 !space-y-0 rounded-lg flex flex-col h-[70vh] max-h-[800px] w-full max-w-2xl">
        <DialogHeader className="bg-linear-to-r from-fuchsia-800 to-blue-400 text-start space-y-3 bg-main-bg rounded-t-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-start font-normal flex items-center justify-start gap-2">
              <Avatar className="size-9">
                <AvatarImage
                  alt="ai_bot"
                  src="/images/ai_bot.png"
                  className="size-9 rounded-full object-contain"
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span>AI Assistant</span>
            </DialogTitle>
            {/* <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button> */}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-center p-4">
              <div>
                <p className="text-lg font-medium">How can I help you today?</p>
                <p className="text-sm mt-2">
                  Ask me anything about our products or services.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Type your message..."
                        className="rounded-full px-4 h-12 flex-1"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-12 w-12 flex-shrink-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AiChat;
