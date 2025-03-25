import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addUser, deleteUser, editUser } from 'slices/userSlice';
import { UserData } from 'models';

interface userListProps {
  users: UserData[];
  onUserSelect: (user: UserData) => void;
}

export const UserList = ({ users, onUserSelect }: userListProps) => {
  const dispatch = useDispatch();

  const [newUserName, setNewUserName] = useState('');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editProfilePic, setEditProfilePic] = useState<string>('');

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newId = Date.now();
      dispatch(addUser({ id: newId, name: newUserName, profilePic: null }));
      setNewUserName('');
    }
  };

  const handleEditUser = () => {
    if (editUserId !== null && editUserName.trim()) {
      dispatch(editUser({ id: editUserId, name: editUserName, profilePic: editProfilePic }));
      setEditUserId(null);
      setEditUserName('');
      setEditProfilePic('');
    }
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          setEditProfilePic(reader.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteUser = (id: number) => {
    dispatch(deleteUser(id));
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserName(e.target.value);
  };

  const handleEditUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserName(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => handleUserNameChange(e)}
          className="border p-2 rounded-lg w1/2 mr-4 bg-yellow-50"
        />
        <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add User
        </button>
      </div>

      {editUserId !== null && (
        <div className="flex flex-col items-center mb-6">
          <input
            className="border p-2 rounded-lg w-1/2 mb-4"
            type="text"
            value={editUserName}
            onChange={(e) => handleEditUserNameChange(e)}
          />
          <input className="mb-4" type="file" accept="image/*" onChange={handleProfilePicChange} />
          {editProfilePic && (
            <img className="w-24 h-24 rounded-full mb-4" src={editProfilePic} width={100} height={100} />
          )}
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleEditUser}>
            Save Changes
          </button>
        </div>
      )}

      <div>
        {users.map(({ id, name, profilePic,todos }) => (
          <div key={id} className="flex items-center justify-between mb-4 p-4 border rounded-lg shadow-md bg-lime-100">
            <div className="flex items-center">
              <img
                className="w-16 h-16 rounded-full mr-4"
                src={profilePic || import.meta.env.VITE_NO_PROFILE_PIC}
                alt={name}
                onClick={() => onUserSelect({ id, name, profilePic,todos })}
              />
              <span className="font-semibold" onClick={() => onUserSelect({ id, name, profilePic,todos })}>
                {name}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                onClick={() => {
                  setEditUserId(id);
                  setEditUserName(name);
                }}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => handleDeleteUser(id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
