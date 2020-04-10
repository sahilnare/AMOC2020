
function babylonInit(socket) {

  var canvas = document.getElementById("renderCanvas"); // Get the canvas element
  var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
  var scene;
  var playersArray = [];

  socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === socket.id) {
        // addPlayer(self, players[id]);
        players[id].rotation = new BABYLON.Vector3(0, 0, 0);
        console.log("Current Player", players[id]);
        scene = createScene(engine, canvas, players[id]); //Call the createScene function
        startEngine(scene, engine);
        playersArray.push(players[id]);
      }
    });
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId !== socket.id) {
        players[id].rotation = new BABYLON.Vector3(0, 0, 0);
        console.log("Other Player", players[id]);
        var newPlayer = createPlayer(scene, scene.getMaterialByName("myMaterial"), {x: players[id].x, y: players[id].y, z: players[id].z}, players[id].playerId, players[id].rotation);
        playersArray.push(players[id]);
      }
    });
  });

  socket.on('playerMoved', function (playerInfo) {
    console.log("Player moved!");
  });

  socket.on('newPlayer', function (playerInfo) {
    // addOtherPlayers(self, playerInfo);
    playerInfo.rotation = new BABYLON.Vector3(0, 0, 0);
    var newPlayer = createPlayer(scene, scene.getMaterialByName("myMaterial"), {x: playerInfo.x, y: playerInfo.y, z: playerInfo.z}, playerInfo.playerId, playerInfo.rotation);
    playersArray.push(playerInfo);
    console.log("New Player", playerInfo);
    console.log(playersArray);
    console.log("Scene Meshes", scene.meshes);
  });

  this.socket.on('disconnect', function (playerId) {
    playersArray.forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        scene.getMeshByName(otherPlayer.playerId).physicsImpostor.dispose();
        scene.removeMesh(scene.getMeshByName(otherPlayer.playerId));
        console.log("Removed Player", otherPlayer);
        playersArray.splice(playersArray.indexOf(otherPlayer), 1);
      }
    });
    console.log(playersArray);
  });

}


function startEngine(scene, engine) {
  // Register a render loop to repeatedly render the scene
  engine.displayLoadingUI();
  scene.executeWhenReady(function () {
      engine.runRenderLoop(function () {
          engine.hideLoadingUI();
          scene.render();
      });
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
}
