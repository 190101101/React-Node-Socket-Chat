import React, { useEffect, useState, useRef } from 'react';
import client from '../client';

const ChatBlock = ({ users, messages, username, roomId, onAddMessage }) => {
  const [messageValue, setMessageValue] = useState('');
  const messagesRef = useRef(null);

  const onSendMessage = () => {
    if (!messageValue) return alert('empty form');
    const obj = {
      roomId,
      username,
      text: messageValue,
    };

    client.emit('ROOM:NEW_MESSAGE', obj);
    onAddMessage(obj);

    setMessageValue('');
  };

  useEffect(() => {
    messagesRef.current.scrollTo(0, 99999999);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        <p>@{username}</p>
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message) => (
            <div className="message">
              <p>{message.text}</p>
              <div>
                <span>{message.username}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            onChange={(e) => setMessageValue(e.currentTarget.value)}
            className="form-control"
            value={messageValue}
            rows="3"
          ></textarea>
          <button
            onClick={onSendMessage}
            type="button"
            className="btn btn-success"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBlock;
