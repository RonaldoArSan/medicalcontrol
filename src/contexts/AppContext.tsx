import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { User, Medication, MedicationHistory, Alert } from '../types/models';

interface AppContextData {
  user: User | null;
  medications: Medication[];
  history: MedicationHistory[];
  alerts: Alert[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  addMedication: (medication: Medication) => Promise<void>;
  updateMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (medicationId: string) => Promise<void>;
  addHistoryEntry: (entry: MedicationHistory) => Promise<void>;
  addAlert: (alert: Alert) => Promise<void>;
  updateAlert: (alertId: string, updates: Partial<Alert>) => Promise<void>;
  clearData: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [history, setHistory] = useState<MedicationHistory[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [userData, medicationsData, historyData, alertsData] = await Promise.all([
        StorageService.getUser(),
        StorageService.getMedications(),
        StorageService.getHistory(),
        StorageService.getAlerts(),
      ]);

      setUser(userData);
      setMedications(medicationsData);
      setHistory(historyData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = async (medication: Medication) => {
    try {
      await StorageService.addMedication(medication);
      setMedications(prev => [...prev, medication]);
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  };

  const updateMedication = async (medication: Medication) => {
    try {
      await StorageService.updateMedication(medication);
      setMedications(prev =>
        prev.map(m => (m.id === medication.id ? medication : m))
      );
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  };

  const deleteMedication = async (medicationId: string) => {
    try {
      await StorageService.deleteMedication(medicationId);
      setMedications(prev => prev.filter(m => m.id !== medicationId));
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  };

  const addHistoryEntry = async (entry: MedicationHistory) => {
    try {
      await StorageService.addHistoryEntry(entry);
      setHistory(prev => [...prev, entry]);
    } catch (error) {
      console.error('Error adding history entry:', error);
      throw error;
    }
  };

  const addAlert = async (alert: Alert) => {
    try {
      await StorageService.addAlert(alert);
      setAlerts(prev => [...prev, alert]);
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  };

  const updateAlert = async (alertId: string, updates: Partial<Alert>) => {
    try {
      await StorageService.updateAlert(alertId, updates);
      setAlerts(prev =>
        prev.map(a => (a.id === alertId ? { ...a, ...updates } : a))
      );
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  };

  const clearData = async () => {
    try {
      await StorageService.clearAll();
      setUser(null);
      setMedications([]);
      setHistory([]);
      setAlerts([]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        medications,
        history,
        alerts,
        isLoading,
        setUser,
        addMedication,
        updateMedication,
        deleteMedication,
        addHistoryEntry,
        addAlert,
        updateAlert,
        clearData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
