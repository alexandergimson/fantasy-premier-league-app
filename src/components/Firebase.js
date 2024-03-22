// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm7EOCG6VSR1lPf8JhcxaPJxUK6bth5b4",
  authDomain: "jackpot-football.firebaseapp.com",
  projectId: "jackpot-football",
  storageBucket: "jackpot-football.appspot.com",
  messagingSenderId: "655110825468",
  appId: "1:655110825468:web:0f255f639fa0dbb939fe79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get the Firestore instance
const db = getFirestore(app);

const getCurrentUserEmail = () => {
  const user = auth.currentUser;
  return user ? user.email : null;
};

const addLeagueSelectionToFirebase = async (userId, selectedLeague) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      await updateDoc(userDocRef, {
        selectedLeague: selectedLeague,
      });
    } else {
      // Handle the case where the user document doesn't exist
      console.error('User document does not exist for userId:', userId);
    }

    console.log('League selection added to Firebase:', selectedLeague);
  } catch (error) {
    console.error('Error adding league selection to Firebase:', error);
    throw error;
  }
};







export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, addLeagueSelectionToFirebase, getCurrentUserEmail };
