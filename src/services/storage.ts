import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, MedicationHistory, Alert, User } from '../types/models';

const STORAGE_KEYS = {
  USER: '@MedControl:user',
  MEDICATIONS: '@MedControl:medications',
  HISTORY: '@MedControl:history',
  ALERTS: '@MedControl:alerts',
  SETTINGS: '@MedControl:settings',
};

export const StorageService = {
  // User
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Medications
  async saveMedications(medications: Medication[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
    } catch (error) {
      console.error('Error saving medications:', error);
      throw error;
    }
  },

  async getMedications(): Promise<Medication[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting medications:', error);
      throw error;
    }
  },

  async addMedication(medication: Medication): Promise<void> {
    try {
      const medications = await this.getMedications();
      medications.push(medication);
      await this.saveMedications(medications);
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  },

  async updateMedication(medication: Medication): Promise<void> {
    try {
      const medications = await this.getMedications();
      const index = medications.findIndex(m => m.id === medication.id);
      if (index !== -1) {
        medications[index] = medication;
        await this.saveMedications(medications);
      }
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  },

  async deleteMedication(medicationId: string): Promise<void> {
    try {
      const medications = await this.getMedications();
      const filtered = medications.filter(m => m.id !== medicationId);
      await this.saveMedications(filtered);
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  // History
  async saveHistory(history: MedicationHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
      throw error;
    }
  },

  async getHistory(): Promise<MedicationHistory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      throw error;
    }
  },

  async addHistoryEntry(entry: MedicationHistory): Promise<void> {
    try {
      const history = await this.getHistory();
      history.push(entry);
      await this.saveHistory(history);
    } catch (error) {
      console.error('Error adding history entry:', error);
      throw error;
    }
  },

  // Alerts
  async saveAlerts(alerts: Alert[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving alerts:', error);
      throw error;
    }
  },

  async getAlerts(): Promise<Alert[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ALERTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  },

  async addAlert(alert: Alert): Promise<void> {
    try {
      const alerts = await this.getAlerts();
      alerts.push(alert);
      await this.saveAlerts(alerts);
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  },

  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<void> {
    try {
      const alerts = await this.getAlerts();
      const index = alerts.findIndex(a => a.id === alertId);
      if (index !== -1) {
        alerts[index] = { ...alerts[index], ...updates };
        await this.saveAlerts(alerts);
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  },

  // Settings
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async getSettings(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  },

  // Utility functions
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
