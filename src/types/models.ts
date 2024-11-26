import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  birthDate: FirebaseFirestoreTypes.Timestamp;
  phone: string;
  height: string;
  weight: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  amount: number;
  expirationDate: FirebaseFirestoreTypes.Timestamp;
  startTime: FirebaseFirestoreTypes.Timestamp;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  userId: string;
}

export interface MedicationHistory {
  id: string;
  medicationId: string;
  medicationName: string;
  takenAt: FirebaseFirestoreTypes.Timestamp;
  userId: string;
}

export interface Alert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRATION';
  medicationId: string;
  medicationName: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  read: boolean;
  userId: string;
}
