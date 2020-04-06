
window.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById("renderCanvas"); // Get the canvas element
  var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

  /******* Add the create scene function ******/
  var createScene = function () {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    // var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
    // camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    // camera.attachControl(canvas, true);
    // Universal camera
    // var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
    // camera.setTarget(BABYLON.Vector3.Zero());
    // camera.attachControl(canvas, true);

    // Add lights to the scene
    var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0.4, -1, 0.5), scene);
    light.intensity = 1.3;
    light.position = new BABYLON.Vector3(-80, 50, -100);
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    var lightSphere = BABYLON.MeshBuilder.CreateSphere("lightSphere", {diameter: 10}, scene);
    lightSphere.position = new BABYLON.Vector3(-80, 50, -100);
    // var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    // Add and manipulate meshes in the scene
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 1, diameterY: 2, segments: 16}, scene);
    // sphere.position.y = 2;
    // sphere.rotation.x = Math.PI/2;
    // sphere.scaling = new BABYLON.Vector3(2, 2, 2);

    var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {width: 1, height: 2, depth: 1}, scene);
    myBox.position = new BABYLON.Vector3(0, 0.5, 0);
    myBox.addRotation(0, -Math.PI/2, 0);

    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60, subdivisions: 1}, scene);
    // var rockGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 6, subdivisions: 1}, scene);
    // rockGround.translate(new BABYLON.Vector3(1, 0, 0).normalize(), 6, BABYLON.Space.WORLD);

    // var myPoints = [
    //   new BABYLON.Vector3(0, 0, 0),
    //   new BABYLON.Vector3(0, 5, 5),
    //   new BABYLON.Vector3(0, 5, 0)
    // ];
    // var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
    // var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 2, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
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
    // grassMaterial.bumpTexture = new BABYLON.Texture("public/assets/grassn.png", scene);
    grassMaterial.diffuseTexture.uScale = 15;
    grassMaterial.diffuseTexture.vScale = 15;
    // grassMaterial.bumpTexture.uScale = 10;
    // grassMaterial.bumpTexture.vScale = 10;
    myGround.material = grassMaterial;

    // var rockMaterial = new BABYLON.StandardMaterial("rockMaterial", scene);
    // rockMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    // rockMaterial.diffuseTexture = new BABYLON.Texture("public/assets/rock.png", scene);
    // rockMaterial.bumpTexture = new BABYLON.Texture("public/assets/rockn.png", scene);
    // rockMaterial.diffuseTexture.uScale = 6;
    // rockMaterial.diffuseTexture.vScale = 6;
    // rockGround.material = rockMaterial;

    var billBoardTexture = new BABYLON.DynamicTexture("dynamic texture", {width:512, height:256}, scene);
    var billBoardMaterial = new BABYLON.StandardMaterial("billBoardMaterial", scene);
    billBoardMaterial.diffuseTexture = billBoardTexture;
    billBoard.material = billBoardMaterial;
    // Dynamic texture
    var font = "bold 35px monospace";
    billBoardTexture.drawText("F-Society welcomes you", 20, 135, font, "green", "white", true, true);

    // Follow Camera
    // Parameters: name, position, scene
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-5, 3, 0), scene);
    // var camera = new BABYLON.ArcFollowCamera("Camera", 0, Math.PI / 3, 5, myBox, scene);
    camera.radius = 10;
    camera.heightOffset = 5;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.03
    camera.maxCameraSpeed = 30
    camera.attachControl(canvas, true);
    camera.lockedTarget = myBox;

    camera.detachControl(canvas);

    // Shadow Generator
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.getShadowMap().renderList.push(myBox);
    myGround.receiveShadows = true;
    // shadowGenerator.useExponentialShadowMap = true;
    // shadowGenerator.usePoissonSampling = true;
    // shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.usePercentageCloserFiltering = true;

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

    myBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function (evt) {
      lightsOn = !lightsOn;
      if(!lightsOn) {
        light1.setEnabled(false);
      } else {
        light1.setEnabled(true);
      }
    }));

    // Translating meshes
    var sign = -1;
    var count = 0;
    var rot = 0.05;
    scene.registerAfterRender(function(){
      // Controls
      if(map["w"] || map["W"]) {
        myBox.translate(new BABYLON.Vector3(0, 0, 1).normalize(), -0.1, BABYLON.Space.LOCAL);
      }
      if(map["s"] || map["S"]) {
        myBox.translate(new BABYLON.Vector3(0, 0, 1).normalize(), 0.1, BABYLON.Space.LOCAL);
      }
      if(map["a"] || map["A"]) {
        myBox.addRotation(0, -rot, 0);
      }
      if(map["d"] || map["D"]) {
        myBox.addRotation(0, rot, 0);
      }

      // if(count === 100.0) {
      //   count = 0;
      //   sign = -sign
      // }
      // count += 0.5;
      // myBox.translate(new BABYLON.Vector3(1, 0, 0).normalize(), 0.05*sign, BABYLON.Space.WORLD);
      // myBox.addRotation(0, rot, 0);
    });

    return scene;
  };
  /******* End of the create scene function ******/

  var scene = createScene(); //Call the createScene function

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });

});
