
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
    var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {width: 1, height: 1, depth: 2}, scene);
    myBox.position.y = 0.5;
    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 4, subdivisions: 4}, scene);
    var myPoints = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0, 5, 5),
      new BABYLON.Vector3(0, 5, 0)
    ];
    var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
    // var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 2, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

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
