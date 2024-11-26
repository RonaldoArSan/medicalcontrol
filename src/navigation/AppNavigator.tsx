import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MedicationList from '../screens/Medication/MedicationList';
import AddMedication from '../screens/Medication/AddMedication';
import MedicationDetails from '../screens/Medication/MedicationDetails';
import Profile from '../screens/Profile/Profile';
import MedicationHistory from '../screens/History/MedicationHistory';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MedicationStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MedicationList"
      component={MedicationList}
      options={{ title: 'Meus Medicamentos' }}
    />
    <Stack.Screen
      name="AddMedication"
      component={AddMedication}
      options={{ title: 'Adicionar Medicamento' }}
    />
    <Stack.Screen
      name="MedicationDetails"
      component={MedicationDetails}
      options={{ title: 'Detalhes do Medicamento' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Medications') {
            iconName = focused ? 'medical-services' : 'medical-services';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Medications"
        component={MedicationStack}
        options={{ headerShown: false, title: 'Medicamentos' }}
      />
      <Tab.Screen
        name="History"
        component={MedicationHistory}
        options={{ title: 'Histórico' }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
