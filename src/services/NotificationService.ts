import { Platform } from 'react-native';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { Medication } from '../types/models';
import { formatTime } from '../utils/date';

interface NotificationPayload {
  medicationId: string;
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private channelId: string | null = null;
  private initialized: boolean = false;

  private constructor() {
    // Initialize is called when needed, not in constructor
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initialize() {
    if (this.initialized) return;
    
    if (Platform.OS === 'android') {
      try {
        // Solicitar permissões para Android
        await notifee.requestPermission();

        // Criar canal de notificação para Android
        this.channelId = await notifee.createChannel({
          id: 'medication-reminders',
          name: 'Lembretes de Medicamentos',
          lights: true,
          vibration: true,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        });
        this.initialized = true;
      } catch (error) {
        console.error('Error initializing notifications:', error);
        throw error;
      }
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  public async scheduleMedicationReminder(medication: Medication): Promise<void> {
    try {
      await this.ensureInitialized();

      const notification: NotificationPayload = {
        medicationId: medication.id,
        title: 'Hora do Medicamento',
        body: `Está na hora de tomar ${medication.name} - ${medication.dosage}`,
        data: {
          medicationId: medication.id,
          type: 'MEDICATION_REMINDER',
        },
      };

      const startTime = medication.startTime.toDate();
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: startTime.getTime(),
        repeatFrequency: this.getRepeatFrequency(medication.frequency),
      };

      await this.createTriggerNotification(notification, trigger);
    } catch (error) {
      console.error('Error scheduling medication reminder:', error);
      throw error;
    }
  }

  private getRepeatFrequency(frequency: string): number {
    // Converter a frequência em milissegundos
    if (frequency.includes('24') || frequency.toLowerCase().includes('dia')) {
      return 24 * 60 * 60 * 1000; // 24 horas
    } else if (frequency.includes('12')) {
      return 12 * 60 * 60 * 1000; // 12 horas
    } else if (frequency.includes('8')) {
      return 8 * 60 * 60 * 1000; // 8 horas
    } else if (frequency.includes('6')) {
      return 6 * 60 * 60 * 1000; // 6 horas
    } else if (frequency.includes('4')) {
      return 4 * 60 * 60 * 1000; // 4 horas
    }
    return 24 * 60 * 60 * 1000; // Padrão: 24 horas
  }

  private async createTriggerNotification(
    notification: NotificationPayload,
    trigger: TimestampTrigger
  ) {
    try {
      await notifee.createTriggerNotification(
        {
          id: `${notification.medicationId}-${notification.data?.type || 'general'}`,
          title: notification.title,
          body: notification.body,
          data: notification.data,
          android: {
            channelId: this.channelId || 'medication-reminders',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
          },
        },
        trigger
      );
    } catch (error) {
      console.error('Error creating trigger notification:', error);
      throw error;
    }
  }

  public async cancelMedicationReminder(medicationId: string): Promise<void> {
    try {
      await this.ensureInitialized();
      
      // Cancelar todas as notificações relacionadas ao medicamento
      const notifications = await notifee.getTriggerNotificationIds();
      for (const notificationId of notifications) {
        if (notificationId.startsWith(medicationId)) {
          await notifee.cancelTriggerNotification(notificationId);
        }
      }
    } catch (error) {
      console.error('Error canceling medication reminder:', error);
      throw error;
    }
  }

  public async scheduleStockAlert(medication: Medication): Promise<void> {
    if (medication.amount <= 5) {
      try {
        await this.ensureInitialized();

        const notification: NotificationPayload = {
          medicationId: medication.id,
          title: 'Estoque Baixo',
          body: `O medicamento ${medication.name} está com estoque baixo`,
          data: {
            medicationId: medication.id,
            type: 'LOW_STOCK_ALERT',
          },
        };

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: Date.now(), // Notificar imediatamente
        };

        await this.createTriggerNotification(notification, trigger);
      } catch (error) {
        console.error('Error scheduling stock alert:', error);
        throw error;
      }
    }
  }

  public async scheduleExpirationAlert(medication: Medication): Promise<void> {
    const expirationDate = medication.expirationDate.toDate();
    const today = new Date();
    const daysUntilExpiration = Math.floor(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration <= 30) {
      try {
        await this.ensureInitialized();

        const notification: NotificationPayload = {
          medicationId: medication.id,
          title: 'Medicamento Próximo do Vencimento',
          body: `O medicamento ${medication.name} vencerá em ${daysUntilExpiration} dias`,
          data: {
            medicationId: medication.id,
            type: 'EXPIRATION_ALERT',
          },
        };

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: Date.now() + (1000 * 60 * 60 * 24), // Notificar no dia seguinte
        };

        await this.createTriggerNotification(notification, trigger);
      } catch (error) {
        console.error('Error scheduling expiration alert:', error);
        throw error;
      }
    }
  }

  public async clearAllNotifications(): Promise<void> {
    try {
      await this.ensureInitialized();
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }
}

export default NotificationService.getInstance();
