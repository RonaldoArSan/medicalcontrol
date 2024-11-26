// Mock do console.log
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

// Mock do React Native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock do Firebase
jest.mock('@react-native-firebase/auth', () => ({
  default: () => ({
    currentUser: { uid: 'test-uid' },
  }),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  default: () => ({
    collection: jest.fn(),
  }),
  FieldValue: {
    serverTimestamp: jest.fn(),
  },
}));

// Mock do Notifee
jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn(),
  createChannel: jest.fn(),
  displayNotification: jest.fn(),
  createTriggerNotification: jest.fn(),
  getTriggerNotificationIds: jest.fn(),
  cancelTriggerNotification: jest.fn(),
}));
