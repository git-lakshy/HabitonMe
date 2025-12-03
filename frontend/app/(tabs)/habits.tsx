import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { SyncService } from '../../src/services/SyncService';

export default function HabitsScreen() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('heart');

  const addHabit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const habits = await SyncService.getLocalHabits();
    const newHabit = {
      id: Date.now(),
      name,
      frequency: 'daily',
      color: Colors.primary,
      icon,
      is_deleted: false,
      updated_at: new Date().toISOString(),
    };

    const newHabits = [...habits, newHabit];
    await SyncService.saveLocalHabits(newHabits);
    SyncService.sync();
    setName('');
    Alert.alert('Success', 'Habit added! Check the Home tab.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={Typography.h1}>Manage Habits</Text>
      <Text style={[Typography.body, { marginBottom: Spacing.xl }]}>Create your daily routines</Text>

      <View style={styles.card}>
        <Text style={[Typography.body, { fontWeight: 'bold', marginBottom: Spacing.sm }]}>Habit Name</Text>
        <TextInput
          placeholder="e.g. Read for 30 mins"
          placeholderTextColor="gray"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={[Typography.body, { fontWeight: 'bold', marginVertical: Spacing.sm }]}>Choose Icon</Text>
        <View style={styles.iconRow}>
          {['heart', 'book', 'fitness', 'cafe', 'code-working', 'moon'].map((i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setIcon(i)}
              style={[
                styles.iconButton,
                { backgroundColor: icon === i ? Colors.primary : Colors.gray },
              ]}
            >
              <Ionicons name={i as any} size={24} color={icon === i ? Colors.secondary : Colors.text} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={addHabit} style={styles.addButton}>
          <Text style={[Typography.body, { color: Colors.secondary, fontWeight: 'bold' }]}>Add Habit</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  input: {
    backgroundColor: Colors.gray,
    color: Colors.text,
    padding: Spacing.md,
    borderRadius: 8,
    fontSize: 16,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.xl,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
});
