import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../../contexts/AppContext';
import { formatDate, formatTime } from '../../utils/date';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CONFIRM_MESSAGES } from '../../constants/messages';
import { MedicationDetailsRouteProp } from '../../types/navigation';
import NotificationService from '../../services/NotificationService';

interface Props {
  route: MedicationDetailsRouteProp;
  navigation: any;
}

const MedicationDetails: React.FC<Props> = ({ route, navigation }) => {
  const { medicationId } = route.params;
  const { medications, deleteMedication, addHistoryEntry } = useApp();
  const medication = medications.find(m => m.id === medicationId);

  useEffect(() => {
    if (medication) {
      NotificationService.scheduleMedicationReminder(medication);
      NotificationService.scheduleStockAlert(medication);
      NotificationService.scheduleExpirationAlert(medication);
    }
  }, [medication]);

  const handleDelete = () => {
    Alert.alert(
      CONFIRM_MESSAGES.DELETE_MEDICATION.title,
      CONFIRM_MESSAGES.DELETE_MEDICATION.message,
      [
        {
          text: CONFIRM_MESSAGES.DELETE_MEDICATION.cancel,
          style: 'cancel',
        },
        {
          text: CONFIRM_MESSAGES.DELETE_MEDICATION.confirm,
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.cancelMedicationReminder(medicationId);
              await deleteMedication(medicationId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting medication:', error);
              Alert.alert('Erro', ERROR_MESSAGES.DELETE_MEDICATION);
            }
          },
        },
      ]
    );
  };

  const handleMedicationTaken = async () => {
    if (!medication) return;

    try {
      await addHistoryEntry({
        id: Math.random().toString(),
        medicationId: medication.id,
        medicationName: medication.name,
        takenAt: new Date(),
        userId: medication.userId,
      });
      Alert.alert('Sucesso', SUCCESS_MESSAGES.MEDICATION_TAKEN);
    } catch (error) {
      console.error('Error recording medication taken:', error);
      Alert.alert('Erro', ERROR_MESSAGES.RECORD_TAKEN);
    }
  };

  if (!medication) {
    return (
      <View style={styles.container}>
        <Text>Medicamento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{medication.name}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dosagem:</Text>
            <Text style={styles.value}>{medication.dosage}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Frequência:</Text>
            <Text style={styles.value}>{medication.frequency}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Quantidade:</Text>
            <Text style={styles.value}>{medication.amount} unidades</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Horário:</Text>
            <Text style={styles.value}>{formatTime(medication.startTime)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Validade:</Text>
            <Text style={styles.value}>{formatDate(medication.expirationDate)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.takenButton}
          onPress={handleMedicationTaken}
        >
          <Text style={styles.takenButtonText}>Registrar Medicamento Tomado</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  deleteButton: {
    padding: 8,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  label: {
    fontSize: 16,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  takenButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  takenButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicationDetails;
