import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditMemberForm = ({ member, onClose }) => {
  const [name, setName] = useState(member.name);
  const [passType, setPassType] = useState(member.pass_type);

  const handleSave = async () => {
    const memberRef = doc(db, 'members', member.id);
    await updateDoc(memberRef, {
      name,
      pass_type: passType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg text-black">
        <h2 className="text-2xl mb-4">Edit Member</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Pass Type</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={passType}
            onChange={(e) => setPassType(e.target.value)}
          />
        </div>
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default EditMemberForm;
