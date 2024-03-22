import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from './Firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getFirestore, getDoc } from 'firebase/firestore'; // Import getDoc here

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      // Create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
  
      // Get the user ID
      const userId = auth.currentUser.uid;
  
      // Define the leagueId you want to associate with the user
      const leagueId = 'yourLeagueId'; // Replace 'yourLeagueId' with the actual leagueId
  
      // Create a document for the user in Firestore
      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
  
      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (!userDocSnapshot.exists()) {
        // User document doesn't exist, create a new document
        await setDoc(userDocRef, {
          userId: userId,
          email: email,
          leagueId: leagueId,  // Include leagueId in the document
          // Include any additional user data if needed
        });
      }
  
      // Continue with other actions, e.g., redirect to team selection
      navigate('/team-selection');
      console.log('Sign-up successful!');
    } catch (error) {
      console.error('Sign-up error:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <label>Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
