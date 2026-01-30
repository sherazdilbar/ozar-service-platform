'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { chatApi, templatesApi } from '@ozar/shared/apiClient';
import { Paperclip, Image as ImageIcon, X, Download, FileText, Zap } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { getImageUrl } from '@/utils/imageUrl';

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
    avatar?: string;
  };
}

interface Conversation {
  id: string;
  customer: any;
  pro: any;
  booking?: any;
}

interface QuickMessage {
  id: string;
  title: string;
  message: string;
}

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected, onlineUsers, joinConversation, leaveConversation, sendTypingStart, sendTypingStop, markAsRead } = useSocket();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([]);
  const [loadingQuickMessages, setLoadingQuickMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const conversationId = params.id as string;

  const isPro = user?.role === 'PRO';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    loadConversation();
    loadMessages();
  }, [conversationId, isAuthenticated]);

  // Join conversation room when socket connects
  useEffect(() => {
    if (socket && isConnected && conversationId) {
      joinConversation(conversationId);
      
      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [socket, isConnected, conversationId]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        scrollToBottom();
        
        // Mark as read if not from me
        if (data.message.senderId !== user?.id) {
          markAsRead(conversationId);
        }
      }
    };

    const handleUserTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    const handleMessagesRead = (data: { conversationId: string; readBy: string }) => {
      if (data.conversationId === conversationId && data.readBy !== user?.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === user?.id ? { ...msg, read: true } : msg
          )
        );
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, conversationId, user?.id]);

  // Check if other user is online
  useEffect(() => {
    if (conversation) {
      // Handle different data structures for customer vs pro
      const otherUser = user?.role === 'CUSTOMER' 
        ? (conversation.pro?.user || conversation.pro) // Pro has nested user object
        : conversation.customer; // Customer is direct
      
      if (otherUser && otherUser.id) {
        setIsOtherUserOnline(onlineUsers.includes(otherUser.id));
      }
    }
  }, [conversation, onlineUsers, user?.role]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadQuickMessages = async () => {
    if (!isPro) return;
    
    setLoadingQuickMessages(true);
    try {
      const result = await templatesApi.getQuickMessages();
      setQuickMessages(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to load quick messages:', error);
      setQuickMessages([]);
    } finally {
      setLoadingQuickMessages(false);
    }
  };

  const handleQuickMessageClick = () => {
    if (quickMessages.length === 0) {
      loadQuickMessages();
    }
    setShowQuickMessages(true);
  };

  const handleSelectQuickMessage = (message: QuickMessage) => {
    setNewMessage(message.message);
    setShowQuickMessages(false);
  };

  const loadConversation = async () => {
    try {
      const data = await chatApi.getConversation(conversationId);
      setConversation(data);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await chatApi.getMessages(conversationId);
      setMessages(data.data || []);
      
      // Mark as read
      if (socket && isConnected) {
        markAsRead(conversationId);
      } else {
        await chatApi.markAsRead(conversationId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = useCallback(() => {
    if (!socket || !isConnected) return;

    sendTypingStart(conversationId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop(conversationId);
    }, 2000);
  }, [socket, isConnected, conversationId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setSelectedFile(null); // Clear any selected document
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, Word, Excel, and text files are allowed');
      return;
    }

    setSelectedFile(file);
    setSelectedImage(null); // Clear any selected image
    setImagePreview(null);
  };

  const handleRemoveAttachment = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');
    
    // Use different endpoint based on file type
    const endpoint = file.type.startsWith('image/') 
      ? 'http://localhost:4000/api/v1/upload/image'
      : 'http://localhost:4000/api/v1/upload/document';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'txt':
        return '📃';
      default:
        return '📎';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasAttachment = selectedImage || selectedFile;
    if ((!newMessage.trim() && !hasAttachment) || sending) return;

    try {
      setSending(true);
      setUploading(true);
      sendTypingStop(conversationId);
      
      let fileUrl: string | undefined;
      let messageText = newMessage.trim();
      
      // Upload file if selected
      if (selectedImage) {
        fileUrl = await uploadFile(selectedImage);
        if (!messageText) messageText = '📷 Image';
      } else if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
        if (!messageText) messageText = `${getFileIcon(selectedFile.name)} ${selectedFile.name}`;
      }

      await chatApi.sendMessage(conversationId, messageText, fileUrl);
      setNewMessage('');
      handleRemoveAttachment();
      
      // Message will be added via WebSocket event
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Conversation not found</p>
          <button
            onClick={() => router.push('/chat')}
            className="mt-4 text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            Back to chats
          </button>
        </div>
      </div>
    );
  }

  // Handle different data structures for customer vs pro
  const otherUser = user?.role === 'CUSTOMER' 
    ? (conversation.pro?.user || conversation.pro) // Pro has nested user object
    : conversation.customer; // Customer is direct
  
  // Safety check
  if (!otherUser || !otherUser.firstName || !otherUser.lastName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Invalid conversation data</p>
          <button
            onClick={() => router.push('/chat')}
            className="mt-4 text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            Back to chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/chat')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar
                imageUrl={otherUser.avatar}
                name={`${otherUser.firstName} ${otherUser.lastName}`}
                size={48}
              />
              {isOtherUserOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                {otherUser.firstName} {otherUser.lastName}
              </h1>
              <div className="flex items-center gap-2">
                {isOtherUserOnline ? (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Offline</span>
                )}
                {conversation.booking && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • Booking #{conversation.booking.id.slice(0, 8)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isConnected && (
            <div className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span>Connecting... (If stuck, please log out and log back in)</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-2">💬</p>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isMe = message.senderId === user?.id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              const hasImage = message.imageUrl && (message.text === '📷 Image' || message.imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i));
              const hasDocument = message.imageUrl && !hasImage;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                    {showAvatar ? (
                      <Avatar
                        imageUrl={message.sender.avatar}
                        name={`${message.sender.firstName} ${message.sender.lastName}`}
                        size={32}
                      />
                    ) : (
                      <div className="w-8 h-8 flex-shrink-0"></div>
                    )}
                    <div>
                      <div
                        className={`rounded-2xl overflow-hidden shadow-sm ${
                          isMe
                            ? 'bg-teal-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {hasImage && (
                          <div className="relative group">
                            <img
                              src={getImageUrl(message.imageUrl) || message.imageUrl}
                              alt="Attachment"
                              className="max-w-xs max-h-64 object-cover cursor-pointer hover:opacity-90 transition"
                              onClick={() => window.open(getImageUrl(message.imageUrl) || message.imageUrl, '_blank')}
                            />
                            <a
                              href={getImageUrl(message.imageUrl) || message.imageUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                        {hasDocument && (
                          <a
                            href={getImageUrl(message.imageUrl) || message.imageUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-4 py-3 hover:opacity-80 transition ${
                              isMe ? 'bg-teal-700' : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                          >
                            <FileText className="w-8 h-8 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{message.text}</p>
                              <p className="text-xs opacity-75">Click to download</p>
                            </div>
                            <Download className="w-5 h-5 flex-shrink-0" />
                          </a>
                        )}
                        {message.text && message.text !== '📷 Image' && !hasDocument && (
                          <p className="text-sm px-4 py-2">{message.text}</p>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {isMe && (
                          <span className="text-xs">
                            {message.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-2 max-w-[70%]">
                <Avatar
                  imageUrl={otherUser.avatar}
                  name={`${otherUser.firstName} ${otherUser.lastName}`}
                  size={32}
                />
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 rounded-lg border-2 border-teal-500"
              />
              <button
                onClick={handleRemoveAttachment}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* File Preview */}
          {selectedFile && (
            <div className="mb-3 inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border-2 border-teal-500">
              <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleRemoveAttachment}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} className="flex gap-2">
            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Attachment buttons */}
            <div className="flex gap-1">
              {isPro && (
                <button
                  type="button"
                  onClick={handleQuickMessageClick}
                  disabled={sending || uploading}
                  className="p-3 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-full transition disabled:opacity-50"
                  title="Quick messages"
                >
                  <Zap className="w-5 h-5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={sending || uploading}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition disabled:opacity-50"
                title="Attach image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending || uploading}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition disabled:opacity-50"
                title="Attach document"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder={
                selectedImage 
                  ? "Add a caption (optional)..." 
                  : selectedFile 
                  ? "Add a message (optional)..."
                  : "Type a message..."
              }
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              disabled={sending || uploading}
            />
            
            <button
              type="submit"
              disabled={(!newMessage.trim() && !selectedImage && !selectedFile) || sending || uploading}
              className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : sending ? (
                '...'
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Quick Messages Modal */}
      {showQuickMessages && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQuickMessages(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Messages</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Select a template to use</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickMessages(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingQuickMessages ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
                </div>
              ) : quickMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    No quick messages yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create templates in Quick Messages settings to respond faster
                  </p>
                  <button
                    onClick={() => {
                      setShowQuickMessages(false);
                      router.push('/pro/quick-messages');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
                  >
                    <Zap className="w-5 h-5" />
                    Create Templates
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {quickMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectQuickMessage(msg)}
                      className="text-left p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 border-2 border-transparent hover:border-teal-500 rounded-xl transition group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                          {msg.title}
                        </h3>
                        <Zap className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {msg.message}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {quickMessages.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <button
                  onClick={() => router.push('/pro/quick-messages')}
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition"
                >
                  Manage templates →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
