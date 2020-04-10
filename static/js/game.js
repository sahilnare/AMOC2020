
function babylonInit(socket) {

  var canvas = document.getElementById("renderCanvas"); // Get the canvas element
  var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

  socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      // if (players[id].playerId === socket.id) {
      //   addPlayer(self, players[id]);
      // }
      // else {
      //   addOtherPlayers(self, players[id]);
      // }
      console.log(players[id]);
    });
  });

  socket.on('newPlayer', function (playerInfo) {
    // addOtherPlayers(self, playerInfo);
    console.log(playerInfo);
  });

  var scene = createScene(engine, canvas); //Call the createScene function

  // Register a render loop to repeatedly render the scene
  // engine.displayLoadingUI();
  engine.runRenderLoop(function () {
    // engine.hideLoadingUI();
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });

}
