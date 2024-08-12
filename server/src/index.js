import express from 'express';
import cors from 'cors';
import { WebSocketServer } from './server.js';

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rooms = new Map();

app.get('/', (req, res) => {
  res.send('server work');
});

app.get('/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post('/rooms', (req, res) => {
  const { roomId } = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }

  res.json([...rooms.keys()]);
});

WebSocketServer(app, rooms).listen(port, (err) => {
  console.log(`http://localhost:${port}`);
});
