import NotificationService from '../../services/NotificationService';
import { Medication } from '../../types/models';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn(),
  createChannel: jest.fn(),
  createTriggerNotification: jest.fn(),
  getTriggerNotificationIds: jest.fn(),
  cancelTriggerNotification: jest.fn(),
  cancelAllNotifications: jest.fn(),
  AndroidImportance: {
    HIGH: 4,
  },
  AndroidVisibility: {
    PUBLIC: 1,
  },
  TriggerType: {
    TIMESTAMP: 1,
  },
}));

describe('NotificationService', () => {
  const mockMedication: Medication = {
    id: '1',
    name: 'Test Medication',
    dosage: '10mg',
    frequency: '12 horas',
    amount: 30,
    startTime: {
      toDate: () => new Date('2024-01-01T08:00:00'),
    } as any,
    expirationDate: {
      toDate: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    } as any,
    userId: 'testUser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (notifee.createChannel as jest.Mock).mockResolvedValue('medication-reminders');
    (notifee.requestPermission as jest.Mock).mockResolvedValue(true);
  });

  describe('initialization', () => {
    it('should request permissions and create channel on Android', async () => {
      // Force initialization by calling a method
      await NotificationService.scheduleMedicationReminder(mockMedication);
      
      expect(notifee.requestPermission).toHaveBeenCalled();
      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: 'medication-reminders',
        name: 'Lembretes de Medicamentos',
        lights: true,
        vibration: true,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });
    });
  });

  describe('scheduleMedicationReminder', () => {
    it('should schedule a medication reminder with correct trigger', async () => {
      await NotificationService.scheduleMedicationReminder(mockMedication);

      const expectedNotification = {
        id: '1-MEDICATION_REMINDER',
        title: 'Hora do Medicamento',
        body: 'Está na hora de tomar Test Medication - 10mg',
        data: {
          medicationId: '1',
          type: 'MEDICATION_REMINDER',
        },
        android: {
          channelId: 'medication-reminders',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
      };

      const expectedTrigger = {
        type: 1,
        timestamp: new Date('2024-01-01T08:00:00').getTime(),
        repeatFrequency: 12 * 60 * 60 * 1000,
      };

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expectedNotification,
        expectedTrigger
      );
    });
  });

  describe('cancelMedicationReminder', () => {
    it('should cancel all notifications for a medication', async () => {
      const mockNotificationIds = ['1-reminder', '1-stock', '2-reminder'];
      (notifee.getTriggerNotificationIds as jest.Mock).mockResolvedValue(mockNotificationIds);

      await NotificationService.cancelMedicationReminder('1');

      expect(notifee.cancelTriggerNotification).toHaveBeenCalledTimes(2);
      expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('1-reminder');
      expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('1-stock');
    });
  });

  describe('scheduleStockAlert', () => {
    it('should schedule a stock alert when amount is low', async () => {
      const lowStockMedication = {
        ...mockMedication,
        amount: 3,
      };

      await NotificationService.scheduleStockAlert(lowStockMedication);

      const expectedNotification = {
        id: '1-LOW_STOCK_ALERT',
        title: 'Estoque Baixo',
        body: 'O medicamento Test Medication está com estoque baixo',
        data: {
          medicationId: '1',
          type: 'LOW_STOCK_ALERT',
        },
        android: {
          channelId: 'medication-reminders',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
      };

      const expectedTrigger = {
        type: 1,
        timestamp: expect.any(Number),
      };

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expectedNotification,
        expectedTrigger
      );
    });

    it('should not schedule a stock alert when amount is sufficient', async () => {
      const sufficientStockMedication = {
        ...mockMedication,
        amount: 10,
      };

      await NotificationService.scheduleStockAlert(sufficientStockMedication);

      expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
    });
  });

  describe('scheduleExpirationAlert', () => {
    it('should schedule an expiration alert when medication is near expiration', async () => {
      const nearExpirationMedication = {
        ...mockMedication,
        expirationDate: {
          toDate: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
        } as any,
      };

      await NotificationService.scheduleExpirationAlert(nearExpirationMedication);

      const expectedNotification = {
        id: '1-EXPIRATION_ALERT',
        title: 'Medicamento Próximo do Vencimento',
        body: expect.stringContaining(nearExpirationMedication.name),
        data: {
          medicationId: '1',
          type: 'EXPIRATION_ALERT',
        },
        android: {
          channelId: 'medication-reminders',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
      };

      const expectedTrigger = {
        type: 1,
        timestamp: expect.any(Number),
      };

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expectedNotification,
        expectedTrigger
      );
    });

    it('should not schedule an expiration alert when medication is not near expiration', async () => {
      const notNearExpirationMedication = {
        ...mockMedication,
        expirationDate: {
          toDate: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
        } as any,
      };

      await NotificationService.scheduleExpirationAlert(notNearExpirationMedication);

      expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
    });
  });

  describe('clearAllNotifications', () => {
    it('should cancel all notifications', async () => {
      await NotificationService.clearAllNotifications();

      expect(notifee.cancelAllNotifications).toHaveBeenCalled();
    });
  });
});
