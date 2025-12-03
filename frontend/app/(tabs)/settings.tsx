import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/theme';
import { SyncService } from '../../src/services/SyncService';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const [reminders, setReminders] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await SyncService.sync();
    setSyncing(false);
    Alert.alert('Success', 'Data synced with cloud');
  };

  const handleNotifications = async (value: boolean) => {
    setReminders(value);
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable notifications in settings to receive reminders');
        setReminders(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[Typography.h1, { marginTop: 60, marginLeft: Spacing.lg, marginBottom: Spacing.xl }]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[Typography.body, { fontWeight: 'bold' }]}>Notifications</Text>
        <View style={styles.row}>
          <Text style={Typography.body}>Daily Reminders</Text>
          <Switch
            value={reminders}
            onValueChange={handleNotifications}
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor={Colors.text}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[Typography.body, { fontWeight: 'bold' }]}>Data & Sync</Text>
        <TouchableOpacity onPress={handleSync} disabled={syncing} style={styles.button}>
          <Text style={[Typography.body, { color: Colors.secondary, fontWeight: 'bold' }]}>
            {syncing ? 'Syncing...' : 'Sync Data Now'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[Typography.body, { fontWeight: 'bold' }]}>About</Text>
        <Text style={Typography.caption}>Version 1.0.0</Text>
        <Text style={Typography.caption}>Personal Habit Tracker</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
