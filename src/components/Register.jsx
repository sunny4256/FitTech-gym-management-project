import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        first_name: firstName,
        last_name: lastName,
        email: user.email,
      });

      alert("User registered successfully. Kindly login.");
      navigate('/login');
    } catch (error) {
      console.error("Error registering user: ", error);
      alert("Error registering user. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute top-4 left-4 text-primary text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        FitTech
      </div>
      <div className="bg-dark p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-400">First Name</label>
            <input
              type="text"
              id="firstName"
              className="w-full p-2 border border-gray-700 rounded mt-2 bg-gray-800 text-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-400">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="w-full p-2 border border-gray-700 rounded mt-2 bg-gray-800 text-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
          <button type="submit" className="w-full bg-primary text-white py-2 rounded mt-4 hover:bg-secondary">Register</button>
        </form>
        <div className="mt-4 text-gray-400">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
