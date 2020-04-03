
window.addEventListener('DOMContentLoaded', function() {

  var canvas = document.getElementById("renderCanvas"); // Get the canvas element
  var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

  /******* Add the create scene function ******/
  var createScene = function () {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 1, diameterY: 2, segments: 16}, scene);
    sphere.position.y = 2;
    sphere.rotation.x = Math.PI/2;
    sphere.scaling = new BABYLON.Vector3(2, 2, 2);
    var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {width: 1, height: 1, depth: 2}, scene);
    myBox.position = new BABYLON.Vector3(0, 0.5, 0);
    myBox.addRotation(0, Math.PI/2, 0);
    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 4, subdivisions: 4}, scene);
    var myPoints = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0, 5, 5),
      new BABYLON.Vector3(0, 5, 0)
    ];
    var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
    // var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 2, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

    var sign = -1;
    var count = 0;
    var rot = 0.05;
    scene.registerAfterRender(function(){
      if(count === 100.0) {
        count = 0;
        sign = -sign
      }
      count += 0.5;
      myBox.translate(new BABYLON.Vector3(1, 0, 0).normalize(), 0.05*sign, BABYLON.Space.WORLD);
      myBox.addRotation(0, rot, 0);
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
