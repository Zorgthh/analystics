import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBr47xSirDJYme1lbFMgVRgOQh9ICd8mlk",
  authDomain: "nexo-literario.firebaseapp.com",
  projectId: "nexo-literario",
  storageBucket: "nexo-literario.appspot.com", 
  messagingSenderId: "929196790251",
  appId: "1:929196790251:web:f4358151bf3a994008c9ae",
  measurementId: "G-G76EX6333D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;