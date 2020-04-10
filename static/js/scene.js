
/******* Add the create scene function ******/
var createScene = function (engine, canvas) {
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

  // Add and manipulate meshes in the scene

  var myBox = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 2, diameterTop: 1, diameterBottom: 1.5}, scene);
  myBox.position = new BABYLON.Vector3(10, 3, 0);
  myBox.addRotation(0, -Math.PI/2, 0);

  var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60, subdivisions: 1}, scene);
  var billBoard = BABYLON.MeshBuilder.CreatePlane("plane", {height:2, width: 4, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
  billBoard.position = new BABYLON.Vector3(4.5, 1, 0);
  billBoard.addRotation(0, Math.PI/2, 0);

  // Add material to the meshes
  var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
  myMaterial.specularColor = new BABYLON.Color3(1, 0, 0);
  myMaterial.emissiveColor = new BABYLON.Color3(0.3, 0, 0);
  myMaterial.ambientColor = new BABYLON.Color3(0, 0.3, 0);

  myBox.material = myMaterial;

  var grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
  grassMaterial.specularColor = new BABYLON.Color3(0.5, 1, 0.5);
  grassMaterial.diffuseTexture = new BABYLON.Texture("public/assets/grass.png", scene);
  grassMaterial.diffuseTexture.uScale = 15;
  grassMaterial.diffuseTexture.vScale = 15;
  myGround.material = grassMaterial;


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
  camera.lockedTarget = myBox;
  camera.detachControl(canvas);

  // Shadow Generator
  // var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  // shadowGenerator.getShadowMap().renderList.push(myBox);
  // myGround.receiveShadows = true;
  // shadowGenerator.useExponentialShadowMap = true;
  // shadowGenerator.usePoissonSampling = true;
  // shadowGenerator.useBlurExponentialShadowMap = true;
  // shadowGenerator.usePercentageCloserFiltering = true;
  // shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

  // Assets Manager
  // var assetsManager = new BABYLON.AssetsManager(scene);
  // var meshTask = assetsManager.addMeshTask("loadMesh", "", "public/assets/", "solus_knight.gltf");
  //
  // meshTask.onSuccess = function (task) {
  //   task.loadedMeshes.forEach((item, i) => {
  //     item.position = BABYLON.Vector3.Zero();
  //     item.addRotation(0, Math.PI, 0);
  //     item.translate(new BABYLON.Vector3(0, 1, 0).normalize(), -0.85, BABYLON.Space.LOCAL);
  //     item.parent = myBox;
  //   });
  //
  //   console.log("Mesh loaded!");
  //   console.log(scene.animationGroups);
  //   // scene.stopAllAnimations();
  //   scene.getAnimationGroupByName("knight_idle").play(true);
  // }
  //
  // meshTask.onError = function (task, message, exception) {
  //     console.log(message, exception);
  // }
  //
  // assetsManager.onFinish = function (tasks) {
  // 	engine.runRenderLoop(function () {
  // 		scene.render();
  // 	});
  // };
  //
  // myBox.isVisible = false;
  // // myMaterial.alpha = 0.5;
  //
  // assetsManager.load();

  // Physics engine
  var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);

  myBox.physicsImpostor = new BABYLON.PhysicsImpostor(myBox, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 2, restitution: 0.1 }, scene);
  myGround.physicsImpostor = new BABYLON.PhysicsImpostor(myGround, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, scene);

  myEnemy = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 2, diameterTop: 1, diameterBottom: 1.5}, scene);
  myEnemy.position = new BABYLON.Vector3(1, 2, 0);
  myEnemy.physicsImpostor = new BABYLON.PhysicsImpostor(myEnemy, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 2, restitution: 0.1 }, scene);

  // Action Manager
  var map ={}; //object for multiple key presses
  var lightsOn = true;
  scene.actionManager = new BABYLON.ActionManager(scene);
  myBox.actionManager = new BABYLON.ActionManager(scene);

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

  var isMoving = false;

  scene.registerAfterRender(function(){

    // Controls
    isMoving = false;

    if(map["w"] || map["W"]) {
      myBox.translate(new BABYLON.Vector3(0, 0, 1).normalize(), -0.1, BABYLON.Space.LOCAL);
      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map["s"] || map["S"]) {
      myBox.translate(new BABYLON.Vector3(0, 0, 1).normalize(), 0.1, BABYLON.Space.LOCAL);
      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map["a"] || map["A"]) {
      myBox.addRotation(0, -rot, 0);
      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map["d"] || map["D"]) {
      myBox.addRotation(0, rot, 0);
      // if(!scene.getAnimationGroupByName("knight_walk_in_place").isPlaying) {
      //   if(scene.getAnimationGroupByName("knight_idle").isPlaying) {
      //     scene.getAnimationGroupByName("knight_idle").stop();
      //   }
      //   scene.getAnimationGroupByName("knight_walk_in_place").play(true);
      // }
      isMoving = true;
    }
    if(map[" "]) {
      if(myBox.position.y <= 1.1) {
        myBox.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,4,0));
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

  });

  return scene;
};
/******* End of the create scene function ******/
