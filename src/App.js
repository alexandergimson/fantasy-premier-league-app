import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/NavBar';
import LeagueSelection from './components/LeagueSelection';
import { getCurrentUserEmail, auth } from './components/Firebase'; // Import auth and getCurrentUserEmail
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

const App = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar userEmail={userEmail} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/team-selection" element={<Dashboard />} />
          <Route path="/league-selection" element={<LeagueSelection />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
