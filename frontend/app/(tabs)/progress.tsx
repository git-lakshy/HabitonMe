import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/theme';
import { SyncService, Habit, Completion } from '../../src/services/SyncService';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export default function ProgressScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  const loadData = async () => {
    const h = await SyncService.getLocalHabits();
    const c = await SyncService.getLocalCompletions();
    setHabits(h.filter(item => !item.is_deleted));
    setCompletions(c);
  };

  useEffect(() => {
    loadData();
  }, []);

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={Typography.h1}>Weekly Progress</Text>
      <Text style={[Typography.body, { marginBottom: Spacing.xl }]}>Your consistency this week</Text>

      {habits.map((habit) => (
        <View key={habit.id} style={styles.habitRow}>
          <Text style={[Typography.body, { fontWeight: 'bold' }]}>{habit.name}</Text>
          <View style={styles.weekGrid}>
            {daysInWeek.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isDone = completions.some(c => c.habit_id === habit.id && c.date === dateStr);
              return (
                <View key={dateStr} style={styles.dayContainer}>
                  <Text style={[Typography.caption, { color: 'gray' }]}>{format(day, 'E')[0]}</Text>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isDone ? Colors.primary : Colors.gray },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      ))}

      {habits.length === 0 && (
        <Text style={[Typography.body, { textAlign: 'center', marginTop: 100 }]}>
          No progress to show. Add habits first!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  habitRow: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 4,
  },
});
