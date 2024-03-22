import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './Firebase';

const Navbar = ({ userEmail }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <p>Signed in as: {userEmail}</p>
        </li>
        <li>
          <button onClick={handleSignOut}>Sign Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
