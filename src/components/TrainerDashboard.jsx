import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const [trainerName, setTrainerName] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDateTime, setEditedDateTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerInfo = async (email) => {
      try {
        const trainersCollection = collection(db, 'trainers');
        const q = query(trainersCollection, where('email', '==', email));
        const trainersSnapshot = await getDocs(q);

        if (trainersSnapshot.empty) {
          setError('Trainer not found');
          setLoading(false);
          return;
        }

        const trainerDoc = trainersSnapshot.docs[0];
        const trainerData = trainerDoc.data();
        setTrainerName(trainerData.name);

        const schedulesCollection = collection(db, 'schedules');
        const scheduleQuery = query(schedulesCollection, where('trainer', '==', trainerData.name));
        const schedulesSnapshot = await getDocs(scheduleQuery);

        const schedulesList = schedulesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSchedules(schedulesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trainer info or schedules:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchTrainerInfo(currentUser.email);
      } else {
        setError('User not logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setEditedName(schedule.name);
    setEditedDateTime(new Date(schedule.date_time.seconds * 1000).toISOString().slice(0, 16));
  };

  const handleUpdate = async () => {
    try {
      const scheduleDoc = doc(db, 'schedules', editingSchedule.id);
      await updateDoc(scheduleDoc, {
        name: editedName,
        date_time: Timestamp.fromDate(new Date(editedDateTime))
      });
      setSchedules(schedules.map(sch => sch.id === editingSchedule.id ? { ...sch, name: editedName, date_time: { seconds: new Date(editedDateTime).getTime() / 1000 } } : sch));
      setEditingSchedule(null);
      alert('Schedule updated successfully!');
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      setSchedules(schedules.filter(sch => sch.id !== id));
      alert('Schedule deleted successfully!');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule. Please try again.');
    }
  };

  const handleLogoutClick = async () => {
    await signOut(auth);
    navigate('/trainer-login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Trainer Dashboard</h1>
      <h2 className="text-2xl mb-4">Welcome, {trainerName}!</h2>
      <button onClick={handleLogoutClick} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Logout</button>
      {schedules.length === 0 ? (
        <p>No schedules found.</p>
      ) : (
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4">Client Name</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td className="py-2 px-4">{schedule.name}</td>
                <td className="py-2 px-4">
                  {schedule.date_time && schedule.date_time.seconds
                    ? new Date(schedule.date_time.seconds * 1000).toLocaleString()
                    : 'Invalid date'}
                </td>
                <td className="py-2 px-4">
                  <button onClick={() => handleEdit(schedule)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(schedule.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg text-black relative">
            <button onClick={() => setEditingSchedule(null)} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              &times;
            </button>
            <h2 className="text-2xl mb-4">Edit Schedule</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Client Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date and Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                value={editedDateTime}
                onChange={(e) => setEditedDateTime(e.target.value)}
                required
              />
            </div>
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
