import socket from 'socket.io-client';

const client = socket.connect('http://localhost:5000');

export default client;
