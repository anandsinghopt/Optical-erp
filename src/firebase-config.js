import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTvr8DSab1vRXOqLT_JDurZrZiSUDTu7E",
  authDomain: "optical-erp-4f195.firebaseapp.com",
  projectId: "optical-erp-4f195",
  storageBucket: "optical-erp-4f195.appspot.com",
  messagingSenderId: "147729593640",
  appId: "1:147729593640:web:b78810f1017535412d8c1d",
  measurementId: "G-644776QSFD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };