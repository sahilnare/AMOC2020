
function babylonInit(socket) {

  var canvas = document.getElementById("renderCanvas"); // Get the canvas element
  var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
  var scene;
  var playersArray = [];

  socket.on('currentPlayers', function (players) {
    let myFirstPromise = new Promise((resolve, reject) => {
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
      setTimeout( function() {
        resolve("Success!")  // Yay! Everything went well!
      }, 1000)
    })

    myFirstPromise.then((successMessage) => {
      console.log("Yay! " + successMessage);
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId !== socket.id) {
          players[id].rotation = new BABYLON.Vector3(0, 0, 0);
          console.log("Other Player", players[id]);
          var newPlayer = createPlayer(scene, scene.getMaterialByName("myMaterial"), {x: players[id].x, y: players[id].y, z: players[id].z}, players[id].playerId, players[id].rotation);
          meshInstance(scene, players[id].playerId);
          playersArray.push(players[id]);
        }
      });
    });

  });

  socket.on('playerMoved', function (playerInfo) {
    scene.getMeshByName(playerInfo.playerId).position = new BABYLON.Vector3(playerInfo.x, playerInfo.y, playerInfo.z);
    // scene.getMeshByName(playerInfo.playerId).rotation = new BABYLON.Vector3(playerInfo.rotation.x, playerInfo.rotation.y, playerInfo.rotation.z);

    // var rotDiff = playerInfo.rotation.y - scene.getMeshByName(playerInfo.playerId).rotationQuaternion.toEulerAngles().y;
    // scene.getMeshByName(playerInfo.playerId).addRotation(0, rotDiff, 0);
    scene.getMeshByName(playerInfo.playerId).rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(playerInfo.rotation.y, 0, 0);
  });

  socket.on('newPlayer', function (playerInfo) {
    // addOtherPlayers(self, playerInfo);
    playerInfo.rotation = new BABYLON.Vector3(0, 0, 0);
    var newPlayer = createPlayer(scene, scene.getMaterialByName("myMaterial"), {x: playerInfo.x, y: playerInfo.y, z: playerInfo.z}, playerInfo.playerId, playerInfo.rotation);
    meshInstance(scene, playerInfo.playerId);
    playersArray.push(playerInfo);
    console.log("New Player", playerInfo);
    console.log(playersArray);
    // console.log("Scene Meshes", scene.meshes);
  });

  this.socket.on('disconnect', function (playerId) {
    playersArray.forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        scene.getMeshByName(otherPlayer.playerId).physicsImpostor.dispose();
        // scene.removeMesh(scene.getMeshByName(otherPlayer.playerId), true);
        scene.getMeshByName(otherPlayer.playerId).dispose();
        console.log("Removed Player", otherPlayer);
        playersArray.splice(playersArray.indexOf(otherPlayer), 1);
      }
    });
    console.log(playersArray);
    console.log("Scene Meshes", scene.meshes);
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
