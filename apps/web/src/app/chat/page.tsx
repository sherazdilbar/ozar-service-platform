import ChatListPageListeo from './page-listeo';

export default function ChatListPage() {
  return <ChatListPageListeo />;
}

/*
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatApi } from '@ozar/shared/apiClient';
import ModernHeader from '@/components/ModernHeader';
import Avatar from '@/components/Avatar';

interface Conversation {
  id: string;
  customer: any;
  pro: any;
  booking?: any;
  lastMessage?: {
    id: string;
    text: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

function ChatListPageOld() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected, onlineUsers } = useSocket();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    loadConversations();
  }, [isAuthenticated]);

  // Listen for conversation updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdate = () => {
      loadConversations();
    };

    const handleNewMessage = () => {
      loadConversations();
    };

    socket.on('conversation_updated', handleConversationUpdate);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('conversation_updated', handleConversationUpdate);
      socket.off('new_message', handleNewMessage);
    };
  }, [socket]);

  const loadConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      console.log('Conversations API response:', response);
      
      // Backend returns { data: conversations }
      const conversationsData = response.data || response;
      console.log('Conversations data:', conversationsData);
      
      // Ensure it's an array
      if (Array.isArray(conversationsData)) {
        setConversations(conversationsData);
      } else {
        console.error('Conversations data is not an array:', conversationsData);
        setConversations([]);
      }
    } catch (error: any) {
      console.error('Failed to load conversations:', error);
      console.error('Error details:', error.response?.data || error.message);
      setConversations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ModernHeader 
        title={t('chat.title')}
        subtitle={`${conversations.length} ${conversations.length !== 1 ? t('chat.conversationsPlural') : t('chat.conversations')}`}
        showBack
        backUrl="/"
        actions={
          isConnected ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{t('chat.connected')}</span>
            </div>
          ) : null
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-6xl mb-4 block">💬</span>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('chat.noMessages')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('chat.noMessagesDesc')}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition transform hover:scale-105 active:scale-95"
            >
              {t('chat.browseProfessionals')}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              // Handle different data structures for customer vs pro
              const otherUser = user?.role === 'CUSTOMER' 
                ? (conversation.pro?.user || conversation.pro) // Pro has nested user object
                : conversation.customer; // Customer is direct
              
              // Safety check
              if (!otherUser || !otherUser.firstName || !otherUser.lastName) {
                console.error('Invalid conversation data:', conversation);
                return null;
              }
              
              const online = isUserOnline(otherUser.id);
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => router.push(`/chat/${conversation.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700 transform hover:scale-[1.01]"
                >
                  <div className="flex gap-4">
                    <div className="relative">
                      <Avatar
                        imageUrl={otherUser.avatar}
                        name={`${otherUser.firstName} ${otherUser.lastName}`}
                        size={56}
                        className="rounded-xl"
                      />
                      {online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate text-gray-900 dark:text-white">
                            {otherUser.firstName} {otherUser.lastName}
                          </h3>
                          {online && (
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {t('chat.online')}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {new Date(conversation.updatedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {conversation.booking && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {t('chat.booking')} #{conversation.booking.id.slice(0, 8)}
                        </p>
                      )}
                      {conversation.lastMessage && (
                        <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {conversation.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        )}
      </main>
    </div>
  );
}
*/
