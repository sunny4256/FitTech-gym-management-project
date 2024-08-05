import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FaEdit, FaTrashAlt, FaPlus, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ adminEmail }) => {
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', pass_type: '', membership_start: '', membership_ends: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editedUser, setEditedUser] = useState({ first_name: '', last_name: '', email: '' });
  const [editedMember, setEditedMember] = useState({ name: '', email: '', pass_type: '', membership_start: '', membership_ends: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchMembers();
    fetchTestimonials();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const membersCollection = collection(db, 'members');
      const membersSnapshot = await getDocs(membersCollection);
      setMembers(membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching members: ", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const testimonialsCollection = collection(db, 'testimonials');
      const testimonialsSnapshot = await getDocs(testimonialsCollection);
      setTestimonials(testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching testimonials: ", error);
    }
  };

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, 'users'), newUser);
      setNewUser({ first_name: '', last_name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  const handleAddMember = async () => {
    try {
      await addDoc(collection(db, 'members'), {
        ...newMember,
        membership_start: Timestamp.fromDate(new Date(newMember.membership_start)),
        membership_ends: Timestamp.fromDate(new Date(newMember.membership_ends)),
      });
      setNewMember({ name: '', email: '', pass_type: '', membership_start: '', membership_ends: '' });
      fetchMembers();
    } catch (error) {
      console.error("Error adding member: ", error);
    }
  };

  const handleDeleteUser = async id => {
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleDeleteMember = async id => {
    try {
      await deleteDoc(doc(db, 'members', id));
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member: ", error);
    }
  };

  const handleDeleteTestimonial = async id => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial: ", error);
    }
  };

  const handleEditUser = async id => {
    try {
      await updateDoc(doc(db, 'users', id), editedUser);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error editing user: ", error);
    }
  };

  const handleEditMember = async id => {
    try {
      await updateDoc(doc(db, 'members', id), {
        ...editedMember,
        membership_start: Timestamp.fromDate(new Date(editedMember.membership_start)),
        membership_ends: Timestamp.fromDate(new Date(editedMember.membership_ends)),
      });
      setEditingMemberId(null);
      fetchMembers();
    } catch (error) {
      console.error("Error editing member: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>{adminEmail}</span>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        </div>
      </div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveSection('users')}
          className={`px-4 py-2 rounded ${activeSection === 'users' ? 'bg-primary' : 'bg-gray-700'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveSection('members')}
          className={`px-4 py-2 rounded ${activeSection === 'members' ? 'bg-primary' : 'bg-gray-700'}`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveSection('testimonials')}
          className={`px-4 py-2 rounded ${activeSection === 'testimonials' ? 'bg-primary' : 'bg-gray-700'}`}
        >
          Testimonials
        </button>
      </div>

      {activeSection === 'users' && (
        <div>
          <div className="mt-4 mb-4">
            <h3 className="text-xl">Add New User</h3>
            <input
              type="text"
              placeholder="First Name"
              value={newUser.first_name}
              onChange={e => setNewUser({ ...newUser, first_name: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.last_name}
              onChange={e => setNewUser({ ...newUser, last_name: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <button onClick={handleAddUser} className="bg-primary p-2 rounded">
              <FaPlus />
            </button>
          </div>

          <h2 className="text-2xl mb-4">Users</h2>
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="py-2 px-4">First Name</th>
                <th className="py-2 px-4">Last Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedUser.first_name}
                        onChange={e => setEditedUser({ ...editedUser, first_name: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      user.first_name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedUser.last_name}
                        onChange={e => setEditedUser({ ...editedUser, last_name: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      user.last_name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <button onClick={() => handleEditUser(user.id)} className="text-green-500 mx-2">
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingUserId(user.id);
                          setEditedUser(user);
                        }}
                        className="text-blue-500 mx-2"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 mx-2"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'members' && (
        <div>
          <div className="mt-4 mb-4">
            <h3 className="text-xl">Add New Member</h3>
            <input
              type="text"
              placeholder="Name"
              value={newMember.name}
              onChange={e => setNewMember({ ...newMember, name: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={e => setNewMember({ ...newMember, email: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <input
              type="text"
              placeholder="Pass Type"
              value={newMember.pass_type}
              onChange={e => setNewMember({ ...newMember, pass_type: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <input
              type="datetime-local"
              placeholder="Membership Start"
              value={newMember.membership_start}
              onChange={e => setNewMember({ ...newMember, membership_start: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <input
              type="datetime-local"
              placeholder="Membership Ends"
              value={newMember.membership_ends}
              onChange={e => setNewMember({ ...newMember, membership_ends: e.target.value })}
              className="mr-2 p-2 text-black"
            />
            <button onClick={handleAddMember} className="bg-primary p-2 rounded">
              <FaPlus />
            </button>
          </div>

          <h2 className="text-2xl mb-4">Members</h2>
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Pass Type</th>
                <th className="py-2 px-4">Membership Start</th>
                <th className="py-2 px-4">Membership Ends</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td className="py-2 px-4">
                    {editingMemberId === member.id ? (
                      <input
                        type="text"
                        value={editedMember.name}
                        onChange={e => setEditedMember({ ...editedMember, name: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      member.name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingMemberId === member.id ? (
                      <input
                        type="email"
                        value={editedMember.email}
                        onChange={e => setEditedMember({ ...editedMember, email: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      member.email
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingMemberId === member.id ? (
                      <input
                        type="text"
                        value={editedMember.pass_type}
                        onChange={e => setEditedMember({ ...editedMember, pass_type: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      member.pass_type
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingMemberId === member.id ? (
                      <input
                        type="datetime-local"
                        value={new Date(editedMember.membership_start).toISOString().substring(0, 16)}
                        onChange={e => setEditedMember({ ...editedMember, membership_start: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      member.membership_start && member.membership_start.seconds 
                      ? new Date(member.membership_start.seconds * 1000).toLocaleString()
                      : 'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingMemberId === member.id ? (
                      <input
                        type="datetime-local"
                        value={new Date(editedMember.membership_ends).toISOString().substring(0, 16)}
                        onChange={e => setEditedMember({ ...editedMember, membership_ends: e.target.value })}
                        className="p-2 text-black"
                      />
                    ) : (
                      member.membership_ends && member.membership_ends.seconds
                      ? new Date(member.membership_ends.seconds * 1000).toLocaleString()
                      : 'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingMemberId === member.id ? (
                      <button onClick={() => handleEditMember(member.id)} className="text-green-500 mx-2">
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingMemberId(member.id);
                          setEditedMember({
                            ...member,
                            membership_start: member.membership_start && member.membership_start.seconds
                              ? new Date(member.membership_start.seconds * 1000).toISOString().substring(0, 16)
                              : '',
                            membership_ends: member.membership_ends && member.membership_ends.seconds
                              ? new Date(member.membership_ends.seconds * 1000).toISOString().substring(0, 16)
                              : '',
                          });
                        }}
                        className="text-blue-500 mx-2"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-500 mx-2"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'testimonials' && (
        <div>
          <h2 className="text-2xl mb-4">Testimonials</h2>
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="py-2 px-4">Author</th>
                <th className="py-2 px-4">Quote</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(testimonial => (
                <tr key={testimonial.id}>
                  <td className="py-2 px-4">{testimonial.author}</td>
                  <td className="py-2 px-4">{testimonial.quote}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="text-red-500 mx-2"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
