const path = require('path');
const http = require('http');
const Filter = require('bad-words');
const express = require('express');
const socketio = require('socket.io');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// Challenge 2
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);
    // Emit event to particular connection.
    socket.emit('message', generateMessage('Welcome!'));
    // Emit event to everybody about that particular connection
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined.`));
  });

  socket.on('sendMessage', (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed.');
    }
    // send message to every clients
    io.to('toronto').emit('message', generateMessage(msg));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    //lat and long will coe from client side.
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback(); // for sending message to acknowledge
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('An user has left.'));
  });
});

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
