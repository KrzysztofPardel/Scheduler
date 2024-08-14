// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAjMj9gbDPmUX7rM0DE98htHi0nvcoX-Zg',
	authDomain: 'scheduler-455b9.firebaseapp.com',
	projectId: 'scheduler-455b9',
	storageBucket: 'scheduler-455b9.appspot.com',
	messagingSenderId: '1047285121529',
	appId: '1:1047285121529:web:4298f21bd69d701b373d28',
	measurementId: 'G-LRRD8GCRRC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
