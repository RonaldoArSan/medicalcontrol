import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { User as FirebaseUser } from 'firebase/auth'; // Importando o tipo User do Firebase
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import './firebase'; // Importando a configuração do Firebase
import { User } from './src/types/user'; // Importando a interface User

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Usando a interface User

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(userState => {
      if (initializing) {
        setInitializing(false);
        if (userState) {
          // Mapeando as propriedades do FirebaseUser para a interface User
          const userMapped: User = {
            uid: userState.uid,
            email: userState.email!,
            displayName: userState.displayName!,
            // Adicione outras propriedades conforme necessário
          };
          setUser(userMapped);
        }
      }
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
