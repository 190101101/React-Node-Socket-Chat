import React, { useState } from 'react';
import axios from 'axios';

const JoinBlock = ({ onLogin }) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !username) {
      return alert('please write room and username');
    }

    setIsLoading(true);

    const obj = {
      roomId,
      username,
    };

    await axios.post('http://localhost:5000/rooms', obj);
    onLogin(obj);
  };

  return (
    <div className="join-block">
      <input
        onChange={(e) => setRoomId(e.currentTarget.value)}
        value={roomId}
        type="text"
        name="room"
        placeholder="Room ID"
      />
      <input
        onChange={(e) => setUsername(e.currentTarget.value)}
        value={username}
        type="text"
        name="username"
        placeholder="username"
      />
      <button
        disabled={isLoading}
        onClick={onEnter}
        className="btn btn-success"
      >
        {isLoading ? 'entrance...' : 'login'}
      </button>
    </div>
  );
};

export default JoinBlock;
