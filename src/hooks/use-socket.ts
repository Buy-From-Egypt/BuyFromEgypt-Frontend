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

  return {
    socket: socketRef.current,
    sendMessage,
    onMessage,
    isConnected: socketRef.current?.connected || false,
  };
};

export default useSocket;
