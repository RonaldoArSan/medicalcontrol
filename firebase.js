// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import dotenv from 'dotenv'; // Importando dotenv para carregar as variáveis de ambiente

dotenv.config(); // Carregando as variáveis de ambiente

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // Usando a variável de ambiente
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, // Usando a variável de ambiente
  projectId: process.env.FIREBASE_PROJECT_ID, // Usando a variável de ambiente
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Usando a variável de ambiente
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID, // Usando a variável de ambiente
  appId: process.env.FIREBASE_APP_ID, // Usando a variável de ambiente
  measurementId: process.env.FIREBASE_MEASUREMENT_ID // Se necessário
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
