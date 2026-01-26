import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
    read: boolean;
  };
  isOwnMessage: boolean;
  showTimestamp?: boolean;
}

export function ChatMessage({ message, isOwnMessage, showTimestamp = false }: ChatMessageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isOwnMessage ? styles.ownText : styles.otherText,
          ]}
        >
          {message.text}
        </Text>

        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              isOwnMessage ? styles.ownTime : styles.otherTime,
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>

          {isOwnMessage && (
            <Ionicons
              name={message.read ? 'checkmark-done' : 'checkmark'}
              size={14}
              color={message.read ? '#00BCD4' : '#FFF'}
              style={styles.checkmark}
            />
          )}
        </View>
      </View>

      {/* Message tail */}
      <View
        style={[
          styles.tail,
          isOwnMessage ? styles.ownTail : styles.otherTail,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ownBubble: {
    backgroundColor: '#00BCD4',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownText: {
    color: '#FFF',
  },
  otherText: {
    color: '#1A1A1A',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 11,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTime: {
    color: '#999',
  },
  checkmark: {
    marginLeft: 2,
  },
  tail: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  ownTail: {
    right: 16,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderTopColor: '#00BCD4',
  },
  otherTail: {
    left: 16,
    borderLeftWidth: 0,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderRightColor: 'transparent',
    borderTopColor: '#F0F0F0',
  },
});
