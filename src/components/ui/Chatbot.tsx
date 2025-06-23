'use client';

import { useState, useEffect, useRef } from 'react';
import { createChatSocket } from '@/lib/chatService';
import { Button } from './button';
import { Input } from './input';
import { PaperPlaneIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { ScrollArea } from './scroll-area';

interface IncomingMessage {
  messageId: string;
  content: string;
  senderId: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // A mock user ID. In a real app, you'd get this from your auth system.
  const userId = 'user-frontend-' + Math.random().toString(16).slice(2);

  useEffect(() => {
    if (!isOpen) return;

    const socket = createChatSocket(userId);
    socketRef.current = socket;

    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to chat server');
      setMessages((prev) => [...prev, { id: 'status', content: 'Connected!', sender: 'bot' }]);
    });

        socket.on('receiveMessage', (message: IncomingMessage) => {
      setMessages((prev) => [...prev, { id: message.messageId, content: message.content, sender: 'bot' }]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    return () => {
      socket.disconnect();
    };
  }, [isOpen, userId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && socketRef.current) {
      const message = {
        content: inputValue,
        receiverId: 'admin', // Assuming you're sending to an admin or bot
        conversationId: 'user-' + userId, // A simple conversation ID
      };

      try {
        socketRef.current.emit('sendMessage', message, (response: { success: boolean; error?: string }) => {
          if (response && response.success) {
            console.log('Message sent successfully');
          } else {
            console.error('Error sending message:', response?.error || 'Server did not acknowledge success.');
          }
        });
        setMessages((prev) => [...prev, { id: new Date().toISOString(), content: inputValue, sender: 'user' }]);
        setInputValue('');
      } catch (error) {
        console.error('Failed to emit message:', error);
      }
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <ChatBubbleIcon className="w-8 h-8" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50">
      <div className="p-4 bg-primary text-primary-foreground rounded-t-lg">
        <h3 className="font-bold">Chat with us!</h3>
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-white">X</button>
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted self-start'}`}>
              {msg.content}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t flex items-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button onClick={handleSendMessage} className="ml-2">
          <PaperPlaneIcon />
        </Button>
      </div>
    </div>
  );
}
