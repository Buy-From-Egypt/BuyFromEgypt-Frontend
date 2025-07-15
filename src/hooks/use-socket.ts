"use client";
import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.userId) return;

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
      console.log("Socket ID:", socket.id);
      socket.emit("userOnline", { userId: user.userId });
      console.log("Set user as online:", user.userId);
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
    });

    socket.on("receiveMessage", (message) => {
      console.log("Global receiveMessage in useSocket:", message);
    });

    socket.on("messageStatusUpdated", (data) => {
      console.log("Global messageStatusUpdated in useSocket:", data);
    });

    socket.on("messageSent", (data) => {
      console.log("Global messageSent confirmation in useSocket:", data);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.emit("userOffline", { userId: user.userId });
        console.log("Set user as offline:", user.userId);
        socket.disconnect();
      }
    };
  }, [user?.userId]);

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

  const onMessage = useCallback((callback: (message: unknown) => void) => {
    if (!socketRef.current) return () => {};

    socketRef.current.on("receiveMessage", callback);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage", callback);
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    onMessage,
    isConnected: socketRef.current?.connected || false,
  };
};

export default useSocket;
