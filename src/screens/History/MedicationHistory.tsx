import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../../contexts/AppContext';
import { formatDateTime } from '../../utils/date';
import { ERROR_MESSAGES } from '../../constants/messages';
import { MedicationHistoryNavigationProp } from '../../types/navigation';
import { MedicationHistory as MedicationHistoryType, Alert as AlertType } from '../../types/models';

interface Props {
  navigation: MedicationHistoryNavigationProp;
}

const MedicationHistory: React.FC<Props> = ({ navigation }) => {
  const { history, alerts, updateAlert } = useApp();

  const handleMarkAlertAsRead = async (alertId: string) => {
    try {
      await updateAlert(alertId, { read: true });
    } catch (error) {
      console.error('Error marking alert as read:', error);
      Alert.alert('Erro', ERROR_MESSAGES.UPDATE_ALERT);
    }
  };

  const renderHistoryItem = ({ item }: { item: MedicationHistoryType }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyContent}>
        <Text style={styles.medicationName}>{item.medicationName}</Text>
        <Text style={styles.historyDate}>{formatDateTime(item.takenAt)}</Text>
      </View>
      <Icon name="check-circle" size={24} color="#4CAF50" />
    </View>
  );

  const renderAlertItem = ({ item }: { item: AlertType }) => (
    <TouchableOpacity
      style={[styles.alertItem, item.read && styles.alertItemRead]}
      onPress={() => !item.read && handleMarkAlertAsRead(item.id)}
    >
      <View style={styles.alertContent}>
        <Icon
          name={item.type === 'LOW_STOCK' ? 'warning' : 'event-busy'}
          size={24}
          color={item.type === 'LOW_STOCK' ? '#FFA000' : '#F44336'}
          style={styles.alertIcon}
        />
        <View style={styles.alertTextContent}>
          <Text style={styles.alertTitle}>
            {item.type === 'LOW_STOCK' ? 'Estoque Baixo' : 'Medicamento Vencido'}
          </Text>
          <Text style={styles.alertMessage}>
            {item.type === 'LOW_STOCK'
              ? `O medicamento ${item.medicationName} está com estoque baixo`
              : `O medicamento ${item.medicationName} está próximo do vencimento`}
          </Text>
          <Text style={styles.alertDate}>{formatDateTime(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Alertas</Text>
          <FlatList
            data={alerts}
            renderItem={renderAlertItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alertsList}
          />
        </View>
      )}

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Histórico</Text>
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.historyList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  alertsSection: {
    paddingVertical: 16,
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  alertsList: {
    paddingHorizontal: 8,
  },
  historyList: {
    padding: 16,
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertItemRead: {
    opacity: 0.6,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertTextContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  alertDate: {
    fontSize: 12,
    color: '#999999',
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#666666',
  },
});

export default MedicationHistory;
