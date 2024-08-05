import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ScheduleForm = ({ onClose }) => {
  const [name, setName] = useState('');
  const [trainer, setTrainer] = useState('None');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      await addDoc(collection(db, 'schedules'), {
        name,
        trainer,
        date_time: Timestamp.fromDate(new Date(dateTime))
      });
      setLoading(false); 
      onClose(); 
      alert('Slot booked successfully!');
      setName('');
      setTrainer('None');
      setDateTime('');
    } catch (error) {
      console.error('Error booking slot: ', error);
      setLoading(false); 
      alert('Failed to book slot. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg text-black relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
          &times;
        </button>
        <h2 className="text-2xl mb-4">Book a Slot</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Trainer</label>
            <select
              className="w-full p-2 border border-gray-300 rounded mt-2"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
              required
            >
              <option value="None">None</option>
              <option value="John">John</option>
              <option value="Jessica">Jessica</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date and Time</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Book Slot'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
