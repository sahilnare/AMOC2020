
/******* Add the create scene function ******/
var createScene = function (engine, canvas, playerInfo) {
  // Create the scene space
  var scene = new BABYLON.Scene(engine);

  // Add lights to the scene
  var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0.4, -1, 0.5), scene);
  light.intensity = 1.3;
  light.position = new BABYLON.Vector3(-80, 50, -100);
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
  var lightSphere = BABYLON.MeshBuilder.CreateSphere("lightSphere", {diameter: 10}, scene);
  lightSphere.position = new BABYLON.Vector3(-80, 50, -100);
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);

  // Physics engine
  var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);

  // Add and manipulate meshes in the scene
  // Add material to the meshes

  var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
  myMaterial.specularColor = new BABYLON.Color3(1, 0, 0);
  myMaterial.emissiveColor = new BABYLON.Color3(0.3, 0, 0);
  myMaterial.ambientColor = new BABYLON.Color3(0, 0.3, 0);

  var playerTorsoMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
  playerTorsoMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);

  var playerLegsMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
  playerLegsMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);

  // The player
  var myPlayer = createPlayer(scene, myMaterial, {x: playerInfo.x, y: playerInfo.y, z: playerInfo.z}, playerInfo.playerId, playerInfo.rotation);

  // var enemyPlayer = createPlayer(scene, myMaterial, {x: -10, y: 3, z: 0});

  var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60, subdivisions: 1}, scene);
  var grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
  grassMaterial.specularColor = new BABYLON.Color3(0.5, 1, 0.5);
  grassMaterial.diffuseTexture = new BABYLON.Texture("public/assets/grass.png", scene);
  grassMaterial.diffuseTexture.uScale = 15;
  grassMaterial.diffuseTexture.vScale = 15;
  myGround.material = grassMaterial;

  var billBoard = BABYLON.MeshBuilder.CreatePlane("plane", {height:2, width: 4, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
  billBoard.position = new BABYLON.Vector3(4.5, 1, 0);
  billBoard.addRotation(0, Math.PI/2, 0);
  var billBoardTexture = new BABYLON.DynamicTexture("dynamic texture", {width:512, height:256}, scene);
  var billBoardMaterial = new BABYLON.StandardMaterial("billBoardMaterial", scene);
  billBoardMaterial.diffuseTexture = billBoardTexture;
  billBoard.material = billBoardMaterial;
  // Dynamic texture
  var font = "bold 35px monospace";
  billBoardTexture.drawText("F-Society welcomes you", 20, 135, font, "green", "white", true, true);

  // Add a camera to the scene and attach it to the canvas
  var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-5, 3, 0), scene);
  camera.radius = 7;
  camera.heightOffset = 4;
  camera.rotationOffset = 0;
  camera.cameraAcceleration = 0.03
  camera.maxCameraSpeed = 30
  camera.attachControl(canvas, true);
  camera.lockedTarget = myPlayer;
  camera.detachControl(canvas);

  // Gravity and collisions
  // scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
  // scene.collisionsEnabled = true;
  // myGround.checkCollisions = true;
  // myPlayer.checkCollisions = true;

  // Shadow Generator
  // var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  // shadowGenerator.getShadowMap().renderList.push(myPlayer);
  // myGround.receiveShadows = true;
  // shadowGenerator.useExponentialShadowMap = true;
  // shadowGenerator.usePoissonSampling = true;
  // shadowGenerator.useBlurExponentialShadowMap = true;
  // shadowGenerator.usePercentageCloserFiltering = true;
  // shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

  // Assets Manager
  var assetsManager = new BABYLON.AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask("loadMesh", "", "public/assets/", "Minotaur.obj");

  meshTask.onSuccess = function (task) {
    task.loadedMeshes.forEach((item, i) => {
      item.position = BABYLON.Vector3.Zero();
      item.addRotation(0, Math.PI, 0);
      // item.translate(new BABYLON.Vector3(0, 1, 0).normalize(), -0.2, BABYLON.Space.LOCAL);
      item.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
      if(item.name == "Body_mesh") {
        item.material = playerTorsoMaterial;
      }
      else {
        item.material = playerLegsMaterial;
      }
      item.parent = myPlayer;
      console.log(item.name);
    });
    // Eyes_mesh Body_mesh Teeth_mesh Pants_mesh

    console.log(task.loadedMeshes);
    // console.log(scene.animationGroups);
    // scene.stopAllAnimations();
    // scene.getAnimationGroupByName("knight_idle").play(true);
  }

  meshTask.onError = function (task, message, exception) {
      console.log(message, exception);
  }

  assetsManager.onFinish = function (tasks) {
  	engine.runRenderLoop(function () {
  		scene.render();
  	});
  };

  myPlayer.isVisible = false;
  // myMaterial.alpha = 0.6;

  assetsManager.load();

  myGround.physicsImpostor = new BABYLON.PhysicsImpostor(myGround, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1, friction: 0.1 }, scene);
  // var myEnemy = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 2, diameterTop: 1, diameterBottom: 1.5}, scene);
  // myEnemy.position = new BABYLON.Vector3(1, 2, 0);
  // myEnemy.physicsImpostor = new BABYLON.PhysicsImpostor(myEnemy, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 2, restitution: 0.1 }, scene);
  // var myCollide = function(collider, collideAgainst) {
  //   console.log("Collide!");
  // }
  // myPlayer.physicsImpostor.registerOnPhysicsCollide(myEnemy.physicsImpostor, myCollide);

  // Action Manager
  var map ={}; //object for multiple key presses
  var lightsOn = true;
  scene.actionManager = new BABYLON.ActionManager(scene);

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));

  // Translating meshes
  var sign = -1;
  var count = 0;
  var rot = 0.02;
  var tor = 0.0;
  var yaw = 0.0;

  var isMoving = false;

  // save old position data
  var oldPosition = {
    x: myPlayer.position.x,
    y: myPlayer.position.y,
    z: myPlayer.position.z,
    rotation: myPlayer.rotation
  };

  scene.registerAfterRender(function(){

    // Controls
    isMoving = false;

    if(map["w"] || map["W"]) {
      myPlayer.translate(new BABYLON.Vector3(0, 0, 1).normalize(), -0.1, BABYLON.Space.LOCAL);
      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map["s"] || map["S"]) {
      myPlayer.translate(new BABYLON.Vector3(0, 0, 1).normalize(), 0.1, BABYLON.Space.LOCAL);
      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map["a"] || map["A"]) {
      yaw -= rot;
      myPlayer.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);

      // myPlayer.addRotation(0, -rot, 0);

      // myPlayer.rotate(BABYLON.Axis.Y, -rot, BABYLON.Space.WORLD);

      // tor = myPlayer.rotation.y - rot;
      // myPlayer.rotation = new BABYLON.Vector3(0, tor, 0);

      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map["d"] || map["D"]) {
      yaw += rot;
      myPlayer.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);

      // myPlayer.addRotation(0, rot, 0);

      // myPlayer.rotate(BABYLON.Axis.Y, rot, BABYLON.Space.WORLD);

      // tor = myPlayer.rotation.y + rot;
      // myPlayer.rotation = new BABYLON.Vector3(0, tor, 0);

      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map[" "]) {
      if(myPlayer.position.y <= 1.1) {
        myPlayer.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,4,0));
      }
      isMoving = true;
    }
    else {
      // if(meshTask.isCompleted && !isMoving) {
      //   if(!scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     if(scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //       scene.getAnimationGroupByName("knight_walk_in_place").stop();
      //     }
      //     scene.getAnimationGroupByName("knight_idle").play(true);
      //   }
      // }
    }

    if (Math.abs(myPlayer.position.x - oldPosition.x) >= 0.02 || Math.abs(myPlayer.position.y - oldPosition.y) >= 0.02 || Math.abs(myPlayer.position.z - oldPosition.z) >= 0.02 || Math.abs(myPlayer.rotationQuaternion.toEulerAngles().y - oldPosition.rotation.y) >= 0.01) {
      // console.log(myPlayer.rotationQuaternion.toEulerAngles().y);
      socket.emit('playerMovement', { x: myPlayer.position.x, y: myPlayer.position.y, z: myPlayer.position.z, rotation: { x: 0, y: myPlayer.rotationQuaternion.toEulerAngles().y, z: 0 } });
    }
    // console.log(myPlayer.rotationQuaternion.toEulerAngles().y, yaw);

    oldPosition = {
      x: myPlayer.position.x,
      y: myPlayer.position.y,
      z: myPlayer.position.z,
      rotation: {
        x: 0,
        y: myPlayer.rotationQuaternion.toEulerAngles().y,
        z: 0,
      }
    };

  });

  return scene;
};
/******* End of the create scene function ******/
