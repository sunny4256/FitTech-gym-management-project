import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.error("Error logging in: ", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute top-4 left-4 text-primary text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        FitTech
      </div>
      <div className="bg-dark p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-700 rounded mt-2 bg-gray-800 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-700 rounded mt-2 bg-gray-800 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded mt-4 hover:bg-secondary">
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-gray-400">
          New user? <Link to="/register" className="text-primary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
