import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/theme';
import { HabitCard } from '../../src/components/HabitCard';
import { ProgressRing } from '../../src/components/ProgressRing';
import { SyncService, Habit, Completion } from '../../src/services/SyncService';
import { format } from 'date-fns';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const loadData = async () => {
    const h = await SyncService.getLocalHabits();
    const c = await SyncService.getLocalCompletions();
    setHabits(h.filter(item => !item.is_deleted));
    setCompletions(c);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await SyncService.sync();
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    SyncService.sync().then(loadData);
  }, []);

  const toggleHabit = async (habitId: number) => {
    const isCompleted = completions.some(c => c.habit_id === habitId && c.date === today);
    let newCompletions: Completion[];

    if (isCompleted) {
      newCompletions = completions.filter(c => !(c.habit_id === habitId && c.date === today));
    } else {
      newCompletions = [...completions, { habit_id: habitId, date: today, status: true }];
    }

    setCompletions(newCompletions);
    await SyncService.saveLocalCompletions(newCompletions);
    SyncService.sync().then(loadData);
  };

  const calculateProgress = () => {
    if (habits.length === 0) return 0;
    const completedToday = habits.filter(h => 
      completions.some(c => c.habit_id === h.id && c.date === today)
    ).length;
    return completedToday / habits.length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={Typography.caption}>{format(new Date(), 'EEEE, MMMM do')}</Text>
          <Text style={Typography.h1}>Today's Goals</Text>
        </View>
        <ProgressRing progress={calculateProgress()} size={70} strokeWidth={6} />
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        renderItem={({ item }) => (
          <HabitCard
            name={item.name}
            icon={item.icon}
            streak={7} // Placeholder for streak calculation logic
            completed={completions.some(c => c.habit_id === item.id && c.date === today)}
            onToggle={() => toggleHabit(item.id)}
            onPress={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={Typography.body}>No habits found. Add one in the Habits tab!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
});
