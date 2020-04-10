const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io').listen(server); // Socket

// Players object
const players = {};

app.use('/public', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'static','index.html'));
});

io.on('connection', function (socket) {
  console.log(`User connected: ${socket.id}`);

  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 15) + 10,
    y: 3,
    z: Math.floor(Math.random() * 15) + 10,
    playerId: socket.id
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].z = movementData.z;
    players[socket.id].rotation = movementData.rotation;
    
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('disconnect', function () {
    console.log(`User disconnected: ${socket.id}`);
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
});

server.listen(port, function () {
  console.log(`Listening on ${server.address().port}`);
});
