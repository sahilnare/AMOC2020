// Socket config
var socket;

function socketInit() {
  socket = io().connect();
  socket.on('connect', function() {
    babylonInit();
  });
}

window.addEventListener('DOMContentLoaded', function() {
  socketInit();
});
