import React, { useEffect } from 'react';
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
import { formatDate, formatTime } from '../../utils/date';
import { ERROR_MESSAGES, CONFIRM_MESSAGES } from '../../constants/messages';
import { MedicationListNavigationProp } from '../../types/navigation';
import { Medication } from '../../types/models';

interface Props {
  navigation: MedicationListNavigationProp;
}

const MedicationList: React.FC<Props> = ({ navigation }) => {
  const { medications, deleteMedication } = useApp();

  const handleDeleteMedication = (medicationId: string) => {
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
              await deleteMedication(medicationId);
            } catch (error) {
              Alert.alert('Erro', ERROR_MESSAGES.DELETE_MEDICATION);
            }
          },
        },
      ]
    );
  };

  const renderMedicationItem = ({ item }: { item: Medication }) => (
    <TouchableOpacity
      style={styles.medicationItem}
      onPress={() => navigation.navigate('MedicationDetails', { medicationId: item.id })}
    >
      <View style={styles.medicationContent}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationInfo}>
          Dosagem: {item.dosage} | Frequência: {item.frequency}
        </Text>
        <Text style={styles.medicationTime}>
          Próxima dose: {formatTime(item.startTime)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMedication(item.id)}
      >
        <Icon name="delete" size={24} color="#FF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
        renderItem={renderMedicationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedication')}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  medicationItem: {
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
  medicationContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  medicationInfo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  medicationTime: {
    fontSize: 14,
    color: '#4CAF50',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default MedicationList;
