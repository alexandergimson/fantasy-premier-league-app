// TeamManagement.js

import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth } from './Firebase'; // Import your Firebase authentication functions

const handleTeamCreation = async (enteredTeam) => {
  try {
    // Get the user ID
    const userId = auth.currentUser.uid;

    // Generate a team ID (replace this with actual team ID generation logic)
    const teamId = 'yourGeneratedTeamId';

    // Update the user document in Firestore with entered team and team ID
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);

    await updateDoc(userDocRef, {
      enteredTeam: enteredTeam,
      teamId: teamId,
    });

    console.log('Entered team information stored successfully!');
  } catch (error) {
    console.error('Error storing entered team information:', error);
  }
};

export { handleTeamCreation };

