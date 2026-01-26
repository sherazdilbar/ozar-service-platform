import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { chatApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

interface Conversation {
  id: string;
  customerId: string;
  proId: string;
  customer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  pro: {
    user: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    businessName?: string;
  };
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reload conversations when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  useEffect(() => {
    loadConversations();
  }, []);

  // Listen for new messages via socket to update conversation list
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      // Reload conversations when a new message arrives
      loadConversations();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  const loadConversations = async () => {
    try {
      const result = await chatApi.getConversations();
      setConversations(result.data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadConversations();
  }, []);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  const isPro = user?.role === 'PRO';
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {totalUnread > 0 && (
          <View style={styles.unreadBadgeHeader}>
            <Text style={styles.unreadBadgeHeaderText}>{totalUnread}</Text>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00BCD4']} />
        }
      >
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              {isPro 
                ? 'Customer messages will appear here'
                : 'Start a conversation with a professional'
              }
            </Text>
            {!isPro && (
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.browseButtonText}>Browse Professionals</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          conversations.map((conversation) => {
            const otherUser = isPro ? conversation.customer : conversation.pro.user;
            const displayName = isPro 
              ? `${otherUser.firstName} ${otherUser.lastName}`
              : conversation.pro.businessName || `${otherUser.firstName} ${otherUser.lastName}`;
            const initials = `${otherUser.firstName[0]}${otherUser.lastName[0]}`.toUpperCase();
            const isUnread = conversation.unreadCount > 0;
            const isSentByMe = conversation.lastMessage?.senderId === user?.id;

            return (
              <TouchableOpacity
                key={conversation.id}
                style={[styles.conversationCard, isUnread && styles.conversationCardUnread]}
                onPress={() => router.push(`/chat/${conversation.id}`)}
              >
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, isPro && styles.avatarCustomer]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  {isUnread && (
                    <View style={styles.unreadDot} />
                  )}
                </View>

                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={[styles.proName, isUnread && styles.proNameUnread]}>
                      {displayName}
                    </Text>
                    {conversation.lastMessage && (
                      <Text style={[styles.timestamp, isUnread && styles.timestampUnread]}>
                        {formatTimestamp(conversation.lastMessage.createdAt)}
                      </Text>
                    )}
                  </View>
                  
                  {conversation.lastMessage && (
                    <View style={styles.lastMessageRow}>
                      <Text 
                        style={[
                          styles.lastMessage, 
                          isUnread && styles.lastMessageUnread
                        ]} 
                        numberOfLines={1}
                      >
                        {isSentByMe && 'You: '}
                        {conversation.lastMessage.text}
                      </Text>
                      {isUnread && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  unreadBadgeHeader: {
    marginLeft: 12,
    backgroundColor: '#00BCD4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadBadgeHeaderText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 64,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  conversationCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  conversationCardUnread: {
    backgroundColor: '#f0f9ff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCustomer: {
    backgroundColor: '#e5e7eb',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00BCD4',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  proName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  proNameUnread: {
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 8,
  },
  timestampUnread: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  lastMessageUnread: {
    color: '#374151',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#00BCD4',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
