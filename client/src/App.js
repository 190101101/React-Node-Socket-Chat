import React, { useEffect, useReducer } from 'react';
import client from './client';
import axios from 'axios';
import reducer from './reducer';
import JoinBlock from './components/JoinBlock';
import ChatBlock from './components/ChatBlock';

function App() {
  const initialState = {
    joined: false,
    roomId: null,
    username: null,
    users: [],
    messages: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const onLogin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });

    client.emit('ROOM:JOIN', obj);

    const { data } = await axios.get(
      `http://localhost:5000/rooms/${obj.roomId}`
    );

    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  useEffect(() => {
    client.on('ROOM:SET_USERS', setUsers);
    client.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  window.socket = client;

  return (
    <div className="wrapper">
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <ChatBlock {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
