import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3008/chat';

export const createChatSocket = (userId: string): Socket => {
  const socket = io(URL, {
    query: { userId },
    transports: ['websocket'],
    autoConnect: false,
  });

  return socket;
};
