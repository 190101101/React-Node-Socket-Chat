import { Server } from 'socket.io';
import http from 'http';

export const WebSocketServer = (app, rooms) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, username }) => {
      socket.join(roomId);
      rooms.get(roomId).get('users').set(socket.id, username);
      const users = [...rooms.get(roomId).get('users').values()];
      socket.to(roomId).emit('ROOM:SET_USERS', users);
    });

    socket.on('ROOM:NEW_MESSAGE', ({ roomId, username, text }) => {
      const obj = {
        username,
        text,
      };

      rooms.get(roomId).get('messages').push(obj);
      socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
    });

    socket.on('disconnect', () => {
      rooms.forEach((value, roomId) => {
        if (value.get('users').delete(socket.id)) {
          const users = [...value.get('users').values()];
          socket.to(roomId).emit('ROOM:SET_USERS', users);
        }
      });
    });
  });

  return server;
};
