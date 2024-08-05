import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const TrainerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTrainerLogin = async (e) => {
    e.preventDefault();
    const trainersCollection = collection(db, 'trainers');
    const trainersSnapshot = await getDocs(query(trainersCollection, where('email', '==', email)));
    const trainers = trainersSnapshot.docs.map(doc => doc.data());
    const trainer = trainers.find(trainer => trainer.email === email);

    if (trainer) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/trainer-dashboard');
      } catch (err) {
        console.error('Error logging in as trainer: ', err);
        setError('Failed to login. Please try again.');
      }
    } else {
      setError('User is not a trainer');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute top-4 left-4 text-primary text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        FitTech
      </div>
      <div className="bg-dark p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Trainer Login</h2>
        <form onSubmit={handleTrainerLogin}>
          <div className="mb-4">
            <label htmlFor="trainerEmail" className="block text-gray-400">Email</label>
            <input
              type="email"
              id="trainerEmail"
              className="w-full p-2 border border-gray-700 rounded mt-2 bg-gray-800 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="trainerPassword" className="block text-gray-400">Password</label>
            <input
              type="password"
              id="trainerPassword"
              className="w-full p-2 border border-gray-700 rounded mt-2 bg-gray-800 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white py-2 rounded mt-4 hover:bg-secondary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default TrainerLogin;
