import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface NumberAnimationProps {
  value: number;
}

export const StreakCounter: React.FC<NumberAnimationProps> = ({ value }) => {
  const animatedValue = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={24} color={Colors.primary} />
      <Animated.Text
        style={[
          Typography.h2,
          {
            color: Colors.primary,
            marginLeft: 4,
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [value - 1, value, value + 1],
                  outputRange: [1, 1.2, 1],
                }),
              },
            ],
          },
        ]}
      >
        {value}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});
