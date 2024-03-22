import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addLeagueSelectionToFirebase, auth } from './Firebase'; // Import the function to add league selection to Firebase

const LeagueSelection = () => {
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState(null);

  const handleLeagueSelection = async (league) => {
    setSelectedLeague(league);
    try {
      // Send league selection to Firebase
      const user = auth.currentUser; // Get the current user
      if (user) {
        const userId = user.uid;
        await addLeagueSelectionToFirebase(userId, league);
        navigate('/team-selection'); // Redirect to team selection page after selecting a league
      } else {
        console.error('User not found.');
      }
    } catch (error) {
      console.error('Error selecting league:', error);
      // Handle error if needed
    }
  };

  return (
    <div>
      <h2>Choose Your League</h2>
      <button onClick={() => handleLeagueSelection('Jackpot Football')}>Jackpot Football</button>
    </div>
  );
};

export default LeagueSelection;
