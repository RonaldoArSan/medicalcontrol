import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { useApp } from '../../contexts/AppContext';
import { AddMedicationNavigationProp } from '../../types/navigation';
import { Medication } from '../../types/models';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';

interface Props {
  navigation: AddMedicationNavigationProp;
}

const AddMedication: React.FC<Props> = ({ navigation }) => {
  const { addMedication } = useApp();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showExpirationPicker, setShowExpirationPicker] = useState(false);

  const handleSave = async () => {
    if (!name || !dosage || !frequency || !amount) {
      Alert.alert('Erro', ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    try {
      const newMedication: Medication = {
        id: firestore().collection('medications').doc().id,
        name,
        dosage,
        frequency,
        amount: Number(amount),
        startTime: firestore.Timestamp.fromDate(startTime),
        expirationDate: firestore.Timestamp.fromDate(expirationDate),
        createdAt: firestore.Timestamp.now(),
        userId: '',  // Será preenchido pelo contexto
      };

      await addMedication(newMedication);
      Alert.alert('Sucesso', SUCCESS_MESSAGES.MEDICATION_SAVED);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Erro', ERROR_MESSAGES.SAVE_MEDICATION);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Medicamento</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome do medicamento"
        />

        <Text style={styles.label}>Dosagem</Text>
        <TextInput
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
          placeholder="Ex: 1 comprimido"
        />

        <Text style={styles.label}>Frequência</Text>
        <TextInput
          style={styles.input}
          value={frequency}
          onChangeText={setFrequency}
          placeholder="Ex: A cada 8 horas"
        />

        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Quantidade de unidades"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Horário de Início</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Data de Validade</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowExpirationPicker(true)}
        >
          <Text>{expirationDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartTimePicker(false);
              if (selectedDate) {
                setStartTime(selectedDate);
              }
            }}
          />
        )}

        {showExpirationPicker && (
          <DateTimePicker
            value={expirationDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowExpirationPicker(false);
              if (selectedDate) {
                setExpirationDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Medicamento</Text>
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
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddMedication;
