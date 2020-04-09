const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io').listen(server);

app.use('/public', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'static','index.html'));
});

io.on('connection', function (socket) {
  console.log('a user connected');
});

server.listen(port, function () {
  console.log(`Listening on ${server.address().port}`);
});
