// Socket config
var socket;

function socketInit() {
  socket = io().connect();
  socket.on('connect', function() {
    babylonInit(socket);
  });
}

window.addEventListener('DOMContentLoaded', function() {
  socketInit();
});
