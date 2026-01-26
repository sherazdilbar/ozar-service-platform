import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
}

export function SlideInView({ 
  children, 
  direction = 'right',
  duration = 400, 
  delay = 0,
  style 
}: SlideInViewProps) {
  const slideAnim = useRef(new Animated.Value(
    direction === 'left' ? -width : 
    direction === 'right' ? width : 
    direction === 'up' ? -100 : 100
  )).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const transform = direction === 'left' || direction === 'right'
    ? [{ translateX: slideAnim }]
    : [{ translateY: slideAnim }];

  return (
    <Animated.View
      style={[
        style,
        {
          transform,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
