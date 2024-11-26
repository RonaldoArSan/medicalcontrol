import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  AppNavigator: undefined;
};

export type AppTabParamList = {
  Medications: undefined;
  History: undefined;
  Profile: undefined;
};

export type MedicationStackParamList = {
  MedicationList: undefined;
  AddMedication: undefined;
  MedicationDetails: {
    medicationId: string;
  };
  EditMedication: {
    medicationId: string;
  };
};

export type AuthNavigationProp = StackNavigationProp<RootStackParamList>;
export type AppNavigationProp = BottomTabNavigationProp<AppTabParamList>;
export type MedicationNavigationProp = StackNavigationProp<MedicationStackParamList>;

export type MedicationDetailsRouteProp = RouteProp<
  MedicationStackParamList,
  'MedicationDetails'
>;

export type EditMedicationRouteProp = RouteProp<
  MedicationStackParamList,
  'EditMedication'
>;
