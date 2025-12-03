import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return 'http://localhost:8000';
  
  const debuggerHost = hostUri.split(':')[0];
  return `http://${debuggerHost}:8000`;
};

const BASE_URL = getBaseUrl();

export interface Habit {
  id: number;
  name: string;
  frequency: string;
  color: string;
  icon: string;
  is_deleted: boolean;
  updated_at: string;
}

export interface Completion {
  habit_id: number;
  date: string;
  status: boolean;
}

const HABITS_KEY = '@habits';
const COMPLETIONS_KEY = '@completions';
const DEVICE_TOKEN_KEY = '@device_token';

export const SyncService = {
  async getLocalHabits(): Promise<Habit[]> {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveLocalHabits(habits: Habit[]) {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  async getLocalCompletions(): Promise<Completion[]> {
    const data = await AsyncStorage.getItem(COMPLETIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveLocalCompletions(completions: Completion[]) {
    await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  },

  async sync() {
    try {
      const habits = await this.getLocalHabits();
      const completions = await this.getLocalCompletions();
      const deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY) || 'emulator_token';

      const response = await fetch(`${BASE_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_token: deviceToken,
          habits: habits,
          completions: completions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await this.saveLocalHabits(data.habits);
        await this.saveLocalCompletions(data.completions);
        console.log('Sync successful');
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  },

  async registerUser(notificationTime: string) {
    try {
      const deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY) || 'emulator_token';
      const response = await fetch(`${BASE_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_token: deviceToken,
          notification_time: notificationTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('User registration failed:', error);
      return false;
    }
  },
};
