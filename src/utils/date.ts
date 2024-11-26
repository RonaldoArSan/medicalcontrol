import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const formatDate = (date: FirebaseFirestoreTypes.Timestamp | null) => {
  if (!date) return '';
  const d = date.toDate();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
};

export const formatTime = (date: FirebaseFirestoreTypes.Timestamp | null) => {
  if (!date) return '';
  const d = date.toDate();
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const formatDateTime = (date: FirebaseFirestoreTypes.Timestamp | null) => {
  if (!date) return '';
  return `${formatDate(date)} às ${formatTime(date)}`;
};

export const timestampToDate = (date: FirebaseFirestoreTypes.Timestamp | null) => {
  if (!date) return new Date();
  return date.toDate();
};
