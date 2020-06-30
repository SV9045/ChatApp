const path = require('path');
const http = require('http');
const Filter = require('bad-words');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

// server (emit) -> client (recieve) - countUpdated
// client (emit) -> server (recieve) - increment

// io.on('connection', (socket) => {
//   console.log('New WebSocket connection');

//   socket.emit('countUpdated', count);

//   socket.on('increment', () => {
//     count++;
//     // this is emitting an event from single connection.
//     // socket.emit('countUpdated', count);

//     // this is emitting an event from every client.
//     io.emit('countUpdated', count);
//   })
// })

// Challenge 1
// io.on('connection', (socket) => {
//   console.log('New WebSocket connection');
//   socket.emit('message', 'Welcome!');

//   socket.on('sendMessage', (msg) => {
//     // send message to every client
//     io.emit('message', msg);
//   })
// })

// Challenge 2 
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  // Emit event to particular connection.
  socket.emit('message', 'Welcome!');
  // Emit event to everybody about that particular connection
  socket.broadcast.emit('message', 'A new user has Joined!');

  socket.on('sendMessage', (msg, callback) => {
    const filter = new Filter();

    if(filter.isProfane(msg)) {
      return callback('Profanity is not allowed');
    }
    // send message to every clients
    io.emit('message', msg);
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    //lat and long will coe from client side.
    io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    callback(); // for sending message to acknowledge
  });

  socket.on('disconnect', () => {
    io.emit('message', 'An user has left')
  });
})

server.listen(port, () => {
  console.log(`server is running on ${port}`);
})