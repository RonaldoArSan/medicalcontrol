import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    phone: '',
    height: '',
    weight: '',
  });
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }

      const response = await auth().createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );

      await firestore().collection('users').doc(response.user.uid).set({
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate,
        phone: formData.phone,
        height: formData.height,
        weight: formData.weight,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('Usuário cadastrado com sucesso!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento"
          value={formData.birthDate}
          onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          value={formData.weight}
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          keyboardType="numeric"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SignIn')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Já tem uma conta? Entre aqui</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#2196F3',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    marginBottom: 30,
  },
  linkText: {
    color: '#2196F3',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SignUp;
