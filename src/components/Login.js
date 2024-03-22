import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './Firebase';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/league-selection'); // Update the path as needed
      console.log('Login successful!');
    } catch (error) {
      console.error('Login error:', error.message);
    }

  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
