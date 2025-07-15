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
import {
  useGetConversationsQuery,
  useSendMessageMutation,
} from "@/store/apis/chat.api";
import { useSocket } from "@/hooks/use-socket";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { ChatDialog } from "@/components/chat/ChatDialog";

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

  const { socket } = useSocket();

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

  const handleMarkConversationAsRead = useCallback(
    (conversationId: string) => {
      if (!socket || !user?.userId) return;

      const conversation = currentConversation;
      if (conversation && conversation.messages.length > 0) {
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];

        console.log("Marking conversation as read:", {
          conversationId,
          userId: user.userId,
          lastReadMessageId: lastMessage.messageId,
        });

        socket.emit("conversationRead", {
          conversationId,
          userId: user.userId,
          lastReadMessageId: lastMessage.messageId,
        });

        setCurrentConversation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: prev.messages.map((msg) => ({
              ...msg,
              seen: true,
              delivered: true,
            })),
          };
        });
      }
    },
    [socket, user?.userId, currentConversation]
  );

  const handleConversationClick = useCallback(
    (conversation: ApiConversation) => {
      setCurrentConversation(conversation);
      setSelectedConversationId(conversation.id);
      setIsChatOpen(true);
      onConversationSelect?.(conversation.id);

      setTimeout(() => {
        handleMarkConversationAsRead(conversation.id);
      }, 1000);

      // router.push(`/messages/${conversation.id}`);
    },
    [onConversationSelect, handleMarkConversationAsRead]
  );

  const [typingStatus, setTypingStatus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up WebSocket listeners for real-time updates
  useEffect(() => {
    if (!socket || !currentConversation) return;

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

    const handleMessageStatusUpdated = (data: {
      messageId: string;
      status: "delivered" | "seen";
      conversationId: string;
    }) => {
      console.log("Message status updated:", data);
      if (data.conversationId === currentConversation.id) {
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
      }
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

    const handleMessageSent = (data: {
      messageId: string;
      conversationId: string;
      success: boolean;
    }) => {
      console.log("Message sent confirmation:", data);
      if (data.conversationId === currentConversation.id && data.success) {
        // Message was successfully sent to server
        setCurrentConversation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.messageId === data.messageId
                ? { ...msg, delivered: true }
                : msg
            ),
          };
        });
      }
    };

    const handleConversationRead = (data: {
      conversationId: string;
      userId: string;
      lastReadMessageId: string;
    }) => {
      console.log("Conversation read:", data);
      if (data.conversationId === currentConversation.id) {
        // Mark all messages as seen up to the last read message
        setCurrentConversation((prev) => {
          if (!prev) return null;
          const messageIndex = prev.messages.findIndex(
            (msg) => msg.messageId === data.lastReadMessageId
          );
          if (messageIndex !== -1) {
            return {
              ...prev,
              messages: prev.messages.map((msg, index) =>
                index <= messageIndex
                  ? { ...msg, seen: true, delivered: true }
                  : msg
              ),
            };
          }
          return prev;
        });
      }
    };

    // Set up all socket listeners
    socket.on("messageStatus", handleMessageStatus);
    socket.on("messageStatusUpdated", handleMessageStatusUpdated);
    socket.on("typingStatus", handleTypingStatus);
    socket.on("messageSent", handleMessageSent);
    socket.on("conversationRead", handleConversationRead);

    // Join the conversation room
    socket.emit("joinConversation", { conversationId: currentConversation.id });

    return () => {
      // Clean up listeners
      socket.off("messageStatus", handleMessageStatus);
      socket.off("messageStatusUpdated", handleMessageStatusUpdated);
      socket.off("typingStatus", handleTypingStatus);
      socket.off("messageSent", handleMessageSent);
      socket.off("conversationRead", handleConversationRead);

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

  const [sendMessageToAPI] = useSendMessageMutation();

  const handleSendMessage = useCallback(
    async (message: {
      senderId: string;
      receiverId: string;
      content: string;
      messageType: string;
    }) => {
      if (!socket || !currentConversation || !user) return;

      handleTyping(false);

      const tempMessageId = `temp-${Date.now()}`;
      const tempCreatedAt = new Date().toISOString();

      const tempMessage: ApiMessage = {
        messageId: tempMessageId,
        conversationId: currentConversation.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        messageType: message.messageType,
        createdAt: tempCreatedAt,
        seen: false,
        delivered: false,
        sender: {
          userId: message.senderId,
          name: user?.name || "You",
          profileImage: user?.profileImage || null,
        },
      };

      setCurrentConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, tempMessage],
          updatedAt: tempCreatedAt,
          lastMessage: {
            id: tempMessageId,
            content: message.content,
            createdAt: tempCreatedAt,
            senderName: user?.name || "You",
          },
        };
      });

      try {
        // Send to database via API first - match backend requirements
        const apiPayload = {
          senderId: message.senderId,
          content: message.content,
          messageType: message.messageType as "TEXT" | "IMAGE" | "FILE",
          conversationId: currentConversation.id,
        };

        const response = await sendMessageToAPI(apiPayload).unwrap();

        // Update the temporary message with real ID
        setCurrentConversation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.messageId === tempMessageId
                ? {
                    ...msg,
                    messageId: response.id,
                    id: response.id,
                    createdAt: response.createdAt,
                  }
                : msg
            ),
            lastMessage: {
              id: response.id,
              content: message.content,
              createdAt: response.createdAt,
              senderName: user?.name || "You",
            },
          };
        });

        // Send via Socket for real-time communication to other participants
        if (socket.connected) {
          console.log("Emitting sendMessage via socket");
          socket.emit("sendMessage", {
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            messageType: message.messageType,
            messageId: response.id,
            conversationId: currentConversation.id,
            createdAt: response.createdAt,
            seen: false,
            delivered: false,
            sender: {
              userId: message.senderId,
              name: user?.name || "You",
              profileImage: user?.profileImage,
            },
          });

          // Emit messageSent event to confirm message was sent
          socket.emit("messageSent", {
            messageId: response.id,
            conversationId: currentConversation.id,
            success: true,
          });
        }

        // Handle delivery and seen status updates
        const handleMessageDelivered = (data: { messageId: string }) => {
          if (data.messageId === response.id) {
            setCurrentConversation((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                messages: prev.messages.map((msg) =>
                  msg.messageId === response.id
                    ? { ...msg, delivered: true }
                    : msg
                ),
              };
            });
            socket.off("messageDelivered", handleMessageDelivered);
          }
        };

        const handleMessageSeen = (data: { messageId: string }) => {
          if (data.messageId === response.id) {
            setCurrentConversation((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                messages: prev.messages.map((msg) =>
                  msg.messageId === response.id
                    ? { ...msg, seen: true, delivered: true }
                    : msg
                ),
              };
            });
            socket.off("messageSeen", handleMessageSeen);
          }
        };

        // Listen for delivery and read receipts
        socket.on("messageDelivered", handleMessageDelivered);
        socket.on("messageSeen", handleMessageSeen);

        // Clean up event listeners after a timeout
        setTimeout(() => {
          socket.off("messageDelivered", handleMessageDelivered);
          socket.off("messageSeen", handleMessageSeen);
        }, 10000); // 10 seconds timeout

        // Refetch conversations to update the list with new last message
        refetch();
      } catch (error) {
        console.error("Failed to send message:", error);
        // You could show a toast error message here
      }
    },
    [socket, currentConversation, user, handleTyping, sendMessageToAPI, refetch]
  );

  // Close chat dialog
  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  // Set up message listener - This is the MAIN message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ApiMessage) => {
      console.log("Received new message:", message);

      // Always update conversations list first
      refetch();

      // Update current conversation if it's the same conversation
      setCurrentConversation((prev) => {
        if (!prev || prev.id !== message.conversationId) {
          console.log(
            "Message is for different conversation or no conversation open"
          );
          return prev;
        }

        // Check if message already exists to prevent duplicates
        const messageExists = prev.messages.some(
          (m) => m.messageId === message.messageId
        );
        if (messageExists) {
          console.log("Message already exists, skipping:", message.messageId);
          return prev;
        }

        console.log(
          "Adding new message to current conversation:",
          message.messageId
        );
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

      // Mark message as delivered only if it's not from current user
      if (message.senderId !== user?.userId && socket) {
        console.log("Marking message as delivered:", message.messageId);
        socket.emit("messageStatus", {
          messageId: message.messageId,
          status: "delivered",
        });

        // Emit messageStatusUpdated for real-time status updates
        socket.emit("messageStatusUpdated", {
          messageId: message.messageId,
          status: "delivered",
          conversationId: message.conversationId,
        });

        // If chat is open AND it's the same conversation, mark as seen after a short delay
        if (isChatOpen && currentConversation?.id === message.conversationId) {
          setTimeout(() => {
            console.log("Marking message as seen:", message.messageId);
            socket.emit("messageStatus", {
              messageId: message.messageId,
              status: "seen",
            });

            socket.emit("messageStatusUpdated", {
              messageId: message.messageId,
              status: "seen",
              conversationId: message.conversationId,
            });
          }, 1000); // 1 second delay before marking as seen
        }
      }
    };

    // Listen for new messages
    console.log("Setting up receiveMessage listener");
    socket.on("receiveMessage", handleNewMessage);

    // Clean up
    return () => {
      console.log("Cleaning up receiveMessage listener");
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, user?.userId, isChatOpen, refetch, currentConversation?.id]);

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

              // Get the last message (most recent) if it exists
              const lastMessage =
                conversation.messages?.length > 0
                  ? conversation.messages[conversation.messages.length - 1]
                  : conversation.lastMessage;

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
                          <Image
                            src={otherParticipant.user.profileImage}
                            alt={otherParticipant.user.name || "User"}
                            width={40}
                            height={40}
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
            id: msg.messageId, // Use messageId as id
            senderId: msg.sender?.userId, // Add required senderId
            receiverId: msg.receiverId,
            content: msg.content,
            messageType: msg.messageType,
            createdAt: msg.createdAt || new Date().toISOString(),
            status: msg.seen ? "seen" : "delivered",
            updatedAt: msg.createdAt, // Using createdAt if updatedAt is not available,
            sender: {
              userId: msg.sender?.userId,
              name: msg.sender?.name,
              profileImage: msg.sender?.profileImage,
            },
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
          conversationId={currentConversation.id}
        />
      )}
    </div>
  );
}

export default Messages;
