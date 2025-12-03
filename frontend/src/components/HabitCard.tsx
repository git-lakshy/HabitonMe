import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { StreakCounter } from './StreakCounter';

interface HabitCardProps {
  name: string;
  icon: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
  onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  name,
  icon,
  streak,
  completed,
  onToggle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: completed ? Colors.primary : Colors.gray,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: completed ? Colors.primary : Colors.surface },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={24}
            color={completed ? Colors.secondary : Colors.text}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[Typography.body, { fontWeight: 'bold' }]}>{name}</Text>
          <Text style={Typography.caption}>Daily Target</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <StreakCounter value={streak} />
        <TouchableOpacity
          onPress={onToggle}
          style={[
            styles.checkbox,
            {
              backgroundColor: completed ? Colors.primary : 'transparent',
              borderColor: Colors.primary,
            },
          ]}
        >
          {completed && (
            <Ionicons name="checkmark" size={16} color={Colors.secondary} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
});
