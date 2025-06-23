"use client";

import React from "react";
import {
  useState,
  useCallback,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGetConversationsQuery } from "@/store/apis/chat.api";
import { useSocket } from "@/hooks/use-socket";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/chat";

// API Response Types
interface ApiUser {
  userId: string;
  name: string;
  profileImage: string | null;
  isOnline?: boolean;
  email?: string;
}

interface ApiParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  user: ApiUser;
}

interface ApiMessage {
  id?: string;
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  createdAt: string;
  seen: boolean;
  delivered: boolean;
  sender: {
    userId: string;
    name: string;
    profileImage: string | null;
  };
}

interface ApiConversation {
  id: string;
  name: string | null;
  type: "PRIVATE" | "GROUP" | string;
  createdAt: string;
  updatedAt: string;
  participants: ApiParticipant[];
  messages: ApiMessage[];
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    senderName: string;
  };
  unreadCount?: number;
}

// Component Types
interface ConversationUser {
  userId: string;
  name: string;
  profileImage: string | null;
  lastSeen?: string;
  isOnline?: boolean;
  email?: string;
}

interface Conversation {
  id: string;
  name: string | null;
  type: "direct" | "group";
  createdAt: string;
  updatedAt: string;
  participants: ConversationUser[];
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    senderName: string;
  };
  unreadCount: number;
  isTyping?: boolean;
}

interface MessagesProps {
  className?: string;
  onConversationSelect?: (conversationId: string) => void;
  initialSelectedConversationId?: string | null;
}

const AVATAR_SIZE = 40;
const SKELETON_ITEMS = 3;

function Messages({
  className,
  onConversationSelect,
  initialSelectedConversationId = null,
}: MessagesProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialSelectedConversationId ?? null);

  // State for chat dialog
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentConversation, setCurrentConversation] =
    useState<ApiConversation | null>(null);

  // Fetch conversations
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    isError: hasError,
  } = useGetConversationsQuery("conversations", {
    refetchOnMountOrArgChange: true,
  });

  // Handle conversation click
  const handleConversationClick = useCallback(
    (conversation: ApiConversation) => {
      setCurrentConversation(conversation);
      setSelectedConversationId(conversation.id);
      setIsChatOpen(true);
      onConversationSelect?.(conversation.id);
      // router.push(`/messages/${conversation.id}`);
    },
    [onConversationSelect, router]
  );

  // Using handleConversationClick for both direct clicks and programmatic selection
  // since they perform the same actions

  // Initialize conversation from URL on mount
  const { socket } = useSocket();

  // useEffect(() => {
  //   if (initialSelectedConversationId && conversationsData) {
  //     const conversation = Array.isArray(conversationsData)
  //       ? conversationsData.find(
  //           (c: { id: string }) => c.id === initialSelectedConversationId
  //         )
  //       : null;
  //     if (conversation) {
  //       // Ensure the conversation has all required ApiConversation properties
  //       const apiConversation: Conversation = {
  //         ...conversation,
  //         name: conversation.name || null,
  //         type: conversation.type === "direct" ? "PRIVATE" : "GROUP",
  //         createdAt: conversation.createdAt || new Date().toISOString(),
  //         updatedAt: conversation.updatedAt || new Date().toISOString(),
  //         messages: [], // Add empty array if messages is undefined
  //       };
  //       handleConversationClick(apiConversation);
  //     }
  //   }
  // }, [
  //   initialSelectedConversationId,
  //   conversationsData,
  //   handleConversationClick,
  // ]);

  // Track typing status
  const [typingStatus, setTypingStatus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up WebSocket listeners for real-time updates
  useEffect(() => {
    if (!socket || !currentConversation) return;

    const handleNewMessage = (message: ApiMessage) => {
      // Handle incoming message
      if (message.conversationId === currentConversation.id) {
        // Update the current conversation with the new message
        setCurrentConversation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, message],
            updatedAt: new Date().toISOString(),
            lastMessage: {
              id: message.messageId,
              content: message.content,
              createdAt: message.createdAt,
              senderName: message.sender?.name || "Unknown",
            },
          };
        });

        // Mark message as delivered and seen if it's the current user's message
        if (message.senderId === user?.userId) {
          socket.emit("messageStatus", {
            messageId: message.messageId,
            status: "delivered",
          });

          // Mark as seen if the chat is open
          if (isChatOpen) {
            socket.emit("messageStatus", {
              messageId: message.messageId,
              status: "seen",
            });
          }
        }
      }

      // Update the conversation list with the new message
      if (conversationsData) {
        // Update the conversation in the list
        const updatedConversations = conversationsData.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: {
                id: message.messageId,
                content: message.content,
                createdAt: message.createdAt,
                senderName: message.sender?.name || "Unknown",
              },
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });
        // Update the conversations data (you might want to use a proper state update here)
        // setConversations(updatedConversations);
      }
    };

    const handleMessageStatus = (data: {
      messageId: string;
      status: "delivered" | "seen";
    }) => {
      setCurrentConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.messageId === data.messageId
              ? { ...msg, [data.status]: true }
              : msg
          ),
        };
      });
    };

    const handleTypingStatus = (data: {
      userId: string;
      isTyping: boolean;
    }) => {
      setTypingStatus((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));
    };

    // Set up all socket listeners
    socket.on("receiveMessage", handleNewMessage);
    socket.on("messageStatus", handleMessageStatus);
    socket.on("typingStatus", handleTypingStatus);

    // Join the conversation room
    socket.emit("joinConversation", { conversationId: currentConversation.id });

    return () => {
      // Clean up listeners
      socket.off("receiveMessage", handleNewMessage);
      socket.off("messageStatus", handleMessageStatus);
      socket.off("typingStatus", handleTypingStatus);

      // Leave the conversation room
      socket.emit("leaveConversation", {
        conversationId: currentConversation.id,
      });
    };
  }, [
    socket,
    currentConversation,
    isChatOpen,
    user?.userId,
    conversationsData,
  ]);

  // Handle typing indicator
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !currentConversation || !user) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Only emit typing status if the user is actually typing
      if (isTyping) {
        socket.emit("typingStatus", {
          conversationId: currentConversation.id,
          userId: user.userId,
          isTyping: true,
        });

        // Automatically set typing to false after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typingStatus", {
            conversationId: currentConversation.id,
            userId: user.userId,
            isTyping: false,
          });
        }, 3000);
      } else {
        socket.emit("typingStatus", {
          conversationId: currentConversation.id,
          userId: user.userId,
          isTyping: false,
        });
      }
    },
    [socket, currentConversation, user]
  );

  // Handle sending a new message
  const handleSendMessage = useCallback(
    (message: {
      senderId: string;
      receiverId: string;
      content: string;
      messageType: string;
    }) => {
      if (!socket || !currentConversation || !user) return;

      // Clear any pending typing indicators
      handleTyping(false);

      // Create a temporary message ID for optimistic updates
      const tempMessageId = `temp-${Date.now()}`;
      const newMessage: ApiMessage = {
        id: tempMessageId,
        messageId: tempMessageId,
        conversationId: currentConversation.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        messageType: message.messageType,
        createdAt: new Date().toISOString(),
        seen: false,
        delivered: false,
        sender: {
          userId: user.userId,
          name: user.name || "You",
          profileImage: user.profileImage,
        },
      };

      // Update UI optimistically
      setCurrentConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date().toISOString(),
          lastMessage: {
            id: tempMessageId,
            content: message.content,
            createdAt: new Date().toISOString(),
            senderName: user.name || "You",
          },
        };
      });

      // Emit the message via WebSocket
      socket.emit("sendMessage", {
        ...message,
        conversationId: currentConversation.id,
        messageId: tempMessageId,
        createdAt: new Date().toISOString(),
        seen: false,
        delivered: false,
        sender: {
          userId: message.senderId,
          name: user?.name || "You",
        },
      });

      // Handle message delivery status
      const handleMessageDelivered = (data: { messageId: string }) => {
        if (
          data.messageId === tempMessageId ||
          data.messageId.startsWith("temp-")
        ) {
          setCurrentConversation((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.messageId === tempMessageId
                  ? { ...msg, delivered: true }
                  : msg
              ),
            };
          });
          // Unsubscribe from the event
          socket.off("messageDelivered", handleMessageDelivered);
        }
      };

      // Handle message seen status
      const handleMessageSeen = (data: { messageId: string }) => {
        if (
          data.messageId === tempMessageId ||
          data.messageId.startsWith("temp-")
        ) {
          setCurrentConversation((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.messageId === tempMessageId
                  ? { ...msg, seen: true, delivered: true }
                  : msg
              ),
            };
          });
          // Unsubscribe from the event
          socket.off("messageSeen", handleMessageSeen);
        }
      };

      // Listen for delivery and read receipts
      socket.on("messageDelivered", handleMessageDelivered);
      socket.on("messageSeen", handleMessageSeen);

      // Clean up event listeners when component unmounts or conversation changes
      return () => {
        socket.off("messageDelivered", handleMessageDelivered);
        socket.off("messageSeen", handleMessageSeen);
      };
    },
    [socket, currentConversation, user, handleTyping]
  );

  // Close chat dialog
  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetConversationsQuery(user?.userId || "", {
    skip: !user?.userId,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.userId) return;

    // Create socket connection with query parameters
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      query: { userId: user.userId },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user?.userId]);

  // Function to manually send a message
  const sendMessage = useCallback(
    (message: {
      senderId: string;
      receiverId: string;
      content: string;
      messageType: string;
    }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", message);
        return true;
      }
      console.error("WebSocket is not connected");
      return false;
    },
    []
  );

  // Function to listen for incoming messages
  const onMessage = useCallback((callback: (message: any) => void) => {
    if (!socketRef.current) return () => {};

    socketRef.current.on("receiveMessage", callback);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage", callback);
      }
    };
  }, []);

  // Set up message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ApiMessage) => {
      // Don't show the message if it's from the current user
      if (message.senderId === user?.userId) return;

      setCurrentConversation((prev) => {
        if (!prev || prev.id !== message.conversationId) return prev;

        // Check if message already exists
        const messageExists = prev.messages.some(
          (m) => m.messageId === message.messageId
        );
        if (messageExists) return prev;

        // Add new message to the conversation
        return {
          ...prev,
          messages: [...prev.messages, message],
          updatedAt: new Date().toISOString(),
          lastMessage: {
            id: message.messageId,
            content: message.content,
            createdAt: message.createdAt,
            senderName: message.sender?.name || "Unknown",
          },
        };
      });

      // Mark message as delivered
      socket.emit("messageStatus", {
        messageId: message.messageId,
        status: "delivered",
      });

      // If chat is open, mark as seen
      if (isChatOpen) {
        socket.emit("messageStatus", {
          messageId: message.messageId,
          status: "seen",
        });
      }
    };

    // Listen for new messages
    socket.on("receiveMessage", handleNewMessage);

    // Clean up
    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, user?.userId, isChatOpen]);

  return (
    <div className={cn("main-card flex flex-col gap-4 h-full", className)}>
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="New message"
          className="rounded-full"
        >
          <Image
            src="/images/pen.png"
            width={20}
            height={20}
            alt="New message"
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-hidden
          />
        </Button>
      </header>

      <div className="h-10 mb-4 flex items-center justify-between w-full bg-main-bg px-2 py-3 rounded-full">
        <div className="flex items-center justify-start gap-2 flex-1">
          <Image
            src="/images/search.png"
            width={20}
            height={20}
            className="size-5"
            alt="Search"
          />
          <Input
            placeholder="Search conversations"
            className="w-full bg-transparent border-0 shadow-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mx-4 px-4">
        {isLoading ? (
          Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
            <div
              key={i}
              className="py-3 px-2 rounded-lg flex items-center gap-3"
              aria-label="Loading conversation"
            >
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))
        ) : apiData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
            <p>No conversations found</p>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {(apiData as unknown as ApiConversation[])?.map((conversation) => {
              // Find the other participant (not the current user)
              const otherParticipant = conversation.participants?.find(
                (p) => p.userId !== user?.userId
              );

              // Get the last message if it exists
              const lastMessage = conversation.messages?.[0];

              return (
                <li key={conversation.id}>
                  <div
                    className="flex items-center p-3 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors"
                    onClick={() =>
                      handleConversationClick(conversation as ApiConversation)
                    }
                  >
                    {/* User Avatar */}
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {otherParticipant?.user?.profileImage ? (
                          <img
                            src={otherParticipant.user.profileImage}
                            alt={otherParticipant.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {(otherParticipant?.user?.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      {otherParticipant?.user?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></span>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">
                          {conversation.name ||
                            otherParticipant?.user?.name ||
                            "Unknown User"}
                        </h3>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(
                              conversation.updatedAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          <span className="font-medium">
                            {lastMessage.senderId === user?.userId
                              ? "You: "
                              : ""}
                          </span>
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Chat Dialog */}
      {currentConversation && (
        <ChatDialog
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          messages={currentConversation.messages.map((msg) => ({
            id: msg.messageId,  // Use messageId as id
            senderId: msg.sender?.userId,  // Add required senderId
            receiverId: msg.receiverId,
            content: msg.content,
            messageType: msg.messageType,
            createdAt: msg.createdAt || new Date().toISOString(),
            status: msg.seen ? "seen" : "delivered",
            updatedAt: msg.createdAt, // Using createdAt if updatedAt is not available,
            sender: {
              userId: msg.sender?.userId,
              name: msg.sender?.name,
              profileImage: msg.sender?.profileImage
            }
          }))}
          currentUserId={user?.userId}
          otherParticipant={{
            userId:
              currentConversation.participants.find(
                (p) => p.userId !== user?.userId
              )?.userId || "",
            name:
              currentConversation.participants.find(
                (p) => p.userId !== user?.userId
              )?.user?.name || "Unknown User",
            profileImage: currentConversation.participants.find(
              (p) => p.userId !== user?.userId
            )?.user?.profileImage,
            isOnline: currentConversation.participants.find(
              (p) => p.userId !== user?.userId
            )?.user?.isOnline,
          }}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

export default Messages;
