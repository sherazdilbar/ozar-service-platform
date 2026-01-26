'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendTypingStart: (conversationId: string) => void;
  sendTypingStop: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  joinConversation: () => {},
  leaveConversation: () => {},
  sendTypingStart: () => {},
  sendTypingStop: () => {},
  markAsRead: () => {},
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        console.log('🔌 Disconnecting WebSocket (user not authenticated)');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('⚠️ No access token found for WebSocket connection');
      return;
    }

    console.log('🔌 Connecting to WebSocket...');

    // Connect to WebSocket server
    const newSocket = io('http://localhost:4000/chat', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected us (probably auth issue), try to reconnect with fresh token
        console.log('🔄 Server disconnected, will retry with fresh token...');
        setTimeout(() => {
          const freshToken = localStorage.getItem('accessToken');
          if (freshToken && freshToken !== token) {
            newSocket.auth = { token: freshToken };
            newSocket.connect();
          }
        }, 1000);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached. Please refresh the page or log in again.');
      }
    });

    // Listen for user status updates
    newSocket.on('user_status', (data: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (data.status === 'online') {
          updated.add(data.userId);
        } else {
          updated.delete(data.userId);
        }
        return updated;
      });
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', { conversationId });
      console.log('📥 Joined conversation:', conversationId);
    }
  }, [socket, isConnected]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_conversation', { conversationId });
      console.log('📤 Left conversation:', conversationId);
    }
  }, [socket, isConnected]);

  const sendTypingStart = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { conversationId });
    }
  }, [socket, isConnected]);

  const sendTypingStop = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { conversationId });
    }
  }, [socket, isConnected]);

  const markAsRead = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_read', { conversationId });
    }
  }, [socket, isConnected]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        joinConversation,
        leaveConversation,
        sendTypingStart,
        sendTypingStop,
        markAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
