import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { chatApi, templatesApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { ChatMessage } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  read: boolean;
  imageUrl?: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Conversation {
  id: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  pro: {
    id: string;
    businessName?: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface QuickMessage {
  id: string;
  message: string;
  category: string;
  usageCount: number;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, isTyping, startTyping, stopTyping } = useSocket();
  const { t } = useLanguage();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([]);
  const [loadingQuickMessages, setLoadingQuickMessages] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isPro = user?.role === 'PRO';

  useEffect(() => {
    loadConversation();
    loadMessages();
  }, [id]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !id) return;

    // Join conversation room
    socket.emit('joinConversation', id);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      if (message.senderId !== user?.id) {
        setMessages((prev) => [...prev, message]);
        // Mark as read
        chatApi.markAsRead(id as string);
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === id && data.userId !== user?.id) {
        setOtherUserTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === id && data.userId !== user?.id) {
        setOtherUserTyping(false);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.emit('leaveConversation', id);
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [socket, id, user]);

  const loadConversation = async () => {
    try {
      const result = await chatApi.getConversation(id as string);
      setConversation(result);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      Alert.alert('Error', 'Failed to load conversation');
    }
  };

  const loadMessages = async () => {
    try {
      const result = await chatApi.getMessages(id as string);
      setMessages(result.data || []);
      // Mark as read
      await chatApi.markAsRead(id as string);
    } catch (error) {
      console.error('Failed to load messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadQuickMessages = async () => {
    if (!isPro) return;
    
    setLoadingQuickMessages(true);
    try {
      const result = await templatesApi.getQuickMessages();
      setQuickMessages(result || []);
    } catch (error) {
      console.error('Failed to load quick messages:', error);
    } finally {
      setLoadingQuickMessages(false);
    }
  };

  const handleQuickMessagePress = () => {
    if (quickMessages.length === 0) {
      loadQuickMessages();
    }
    setShowQuickMessages(true);
  };

  const handleSelectQuickMessage = (message: QuickMessage) => {
    setMessageText(message.message);
    setShowQuickMessages(false);
    // Increment usage count
    templatesApi.updateQuickMessage(message.id, {
      ...message,
      usageCount: message.usageCount + 1,
    }).catch(console.error);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const textToSend = messageText.trim();
    setMessageText('');
    stopTyping(id as string);

    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: textToSend,
      senderId: user?.id || '',
      createdAt: new Date().toISOString(),
      read: false,
      sender: {
        id: user?.id || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      },
    };

    // Add optimistically
    setMessages((prev) => [...prev, optimisticMessage]);
    
    // Scroll to bottom immediately
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);

    setSending(true);
    try {
      const message = await chatApi.sendMessage(id as string, textToSend);
      
      // Replace optimistic message with real one
      setMessages((prev) => 
        prev.map(m => m.id === optimisticMessage.id ? message : m)
      );
      
      // Scroll to bottom again
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m.id !== optimisticMessage.id));
      Alert.alert('Error', 'Failed to send message');
      setMessageText(textToSend);
    } finally {
      setSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);

    // Emit typing indicator
    if (text.trim()) {
      startTyping(id as string);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(id as string);
      }, 2000);
    } else {
      stopTyping(id as string);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Conversation not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const otherUser = isPro ? conversation.customer : conversation.pro.user;
  const displayName = isPro
    ? `${otherUser.firstName} ${otherUser.lastName}`
    : conversation.pro.businessName || `${otherUser.firstName} ${otherUser.lastName}`;
  const initials = `${otherUser.firstName[0]}${otherUser.lastName[0]}`.toUpperCase();

  const CATEGORY_ICONS: Record<string, string> = {
    ON_MY_WAY: '🚗',
    RUNNING_LATE: '⏰',
    COMPLETED: '✅',
    FOLLOW_UP: '📞',
    GREETING: '👋',
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Chat Header Info - No back button, Expo provides it */}
      <View style={styles.chatInfo}>
        <View style={[styles.avatar, isPro && styles.avatarCustomer]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{displayName}</Text>
          {otherUserTyping && (
            <Text style={styles.typingText}>typing...</Text>
          )}
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatMessage
            message={item}
            isOwnMessage={item.senderId === user?.id}
          />
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
        ListFooterComponent={
          otherUserTyping ? (
            <View style={styles.typingContainer}>
              <TypingIndicator />
            </View>
          ) : null
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {isPro && (
          <TouchableOpacity
            style={styles.quickMessageButton}
            onPress={handleQuickMessagePress}
          >
            <Ionicons name="flash" size={20} color="#00BCD4" />
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          value={messageText}
          onChangeText={handleTextChange}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!messageText.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.sendButtonText}>➤</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Messages Modal */}
      <Modal
        visible={showQuickMessages}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQuickMessages(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Messages</Text>
              <TouchableOpacity onPress={() => setShowQuickMessages(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {loadingQuickMessages ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#00BCD4" />
                <Text style={styles.modalLoadingText}>Loading...</Text>
              </View>
            ) : quickMessages.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyIcon}>💬</Text>
                <Text style={styles.modalEmptyText}>No quick messages yet</Text>
                <Text style={styles.modalEmptySubtext}>
                  Create quick messages in Professional Tools
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.modalBody}>
                {quickMessages.map((msg) => (
                  <TouchableOpacity
                    key={msg.id}
                    style={styles.quickMessageItem}
                    onPress={() => handleSelectQuickMessage(msg)}
                  >
                    <View style={styles.quickMessageHeader}>
                      <Text style={styles.quickMessageIcon}>
                        {CATEGORY_ICONS[msg.category] || '💬'}
                      </Text>
                      <Text style={styles.quickMessageCategory}>
                        {msg.category.replace(/_/g, ' ')}
                      </Text>
                    </View>
                    <Text style={styles.quickMessageText} numberOfLines={2}>
                      {msg.message}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chatInfo: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarCustomer: {
    backgroundColor: '#e5e7eb',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  typingText: {
    fontSize: 12,
    color: '#00BCD4',
    fontStyle: 'italic',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  typingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  quickMessageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
  },
  sendButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  modalLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  modalEmpty: {
    padding: 40,
    alignItems: 'center',
  },
  modalEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  modalEmptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalBody: {
    padding: 16,
  },
  quickMessageItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickMessageIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  quickMessageCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  quickMessageText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 20,
  },
});
