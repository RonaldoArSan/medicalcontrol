import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUserProfile, saveUserProfile } from '../../services/UserService';

interface UserData {
  name: string;
  email: string;
  birthDate: Date;
  phone: string;
  height: string;
  weight: string;
}

interface FirestoreData extends Omit<UserData, 'birthDate'> {
  birthDate?: FirebaseFirestoreTypes.Timestamp;
}

interface ProfileProps {
  navigation: NativeStackNavigationProp<any>;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    birthDate: new Date(),
    phone: '',
    height: '',
    weight: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth().currentUser?.uid;
      if (!userId) return;

      const data = await getUserProfile(userId);
      if (data) {
        setUserData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          height: data.height || '',
          weight: data.weight || '',
          birthDate: data.birthDate?.toDate() || new Date(),
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await saveUserProfile(userId, userData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // A navegação será tratada pelo listener de autenticação no App.tsx
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout');
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUserData({ ...userData, birthDate: selectedDate });
    }
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.staticText}>{userData.email}</Text>

          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {format(userData.birthDate, "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            value={userData.height}
            onChangeText={(text) => setUserData({ ...userData, height: text })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={userData.weight}
            onChangeText={(text) => setUserData({ ...userData, weight: text })}
            keyboardType="numeric"
          />

          {showDatePicker && (
            <DateTimePicker
              value={userData.birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      );
    }

    return (
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Nome:</Text>
          <Text style={styles.detailValue}>{userData.name}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{userData.email}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Data de Nascimento:</Text>
          <Text style={styles.detailValue}>
            {format(userData.birthDate, "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Telefone:</Text>
          <Text style={styles.detailValue}>{userData.phone}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Altura:</Text>
          <Text style={styles.detailValue}>{userData.height} cm</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Peso:</Text>
          <Text style={styles.detailValue}>{userData.weight} kg</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderContent()}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  details: {
    padding: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    margin: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#666',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  staticText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default Profile;