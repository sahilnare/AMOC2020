
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
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 1, diameterY: 2, segments: 16}, scene);
    sphere.position.y = 2;
    sphere.rotation.x = Math.PI/2;
    sphere.scaling = new BABYLON.Vector3(2, 2, 2);

    var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {width: 1, height: 1, depth: 2}, scene);
    myBox.position = new BABYLON.Vector3(0, 0.5, 0);
    myBox.addRotation(0, Math.PI/2, 0);

    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 6, subdivisions: 1}, scene);
    var rockGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 6, subdivisions: 1}, scene);
    rockGround.translate(new BABYLON.Vector3(1, 0, 0).normalize(), 6, BABYLON.Space.WORLD);

    var myPoints = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0, 5, 5),
      new BABYLON.Vector3(0, 5, 0)
    ];
    var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
    // var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 2, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

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
    grassMaterial.bumpTexture = new BABYLON.Texture("public/assets/grassn.png", scene);
    grassMaterial.diffuseTexture.uScale = 2;
    grassMaterial.diffuseTexture.vScale = 2;
    myGround.material = grassMaterial;

    var rockMaterial = new BABYLON.StandardMaterial("rockMaterial", scene);
    rockMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    rockMaterial.diffuseTexture = new BABYLON.Texture("public/assets/rock.png", scene);
    rockMaterial.bumpTexture = new BABYLON.Texture("public/assets/rockn.png", scene);
    rockMaterial.diffuseTexture.uScale = 6;
    rockMaterial.diffuseTexture.vScale = 6;
    rockGround.material = rockMaterial;

    // Translating meshes
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
