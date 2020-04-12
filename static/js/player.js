
function createPlayer(scene, material, position, playerId, rotation) {
  var newPlayer = BABYLON.MeshBuilder.CreateCylinder(`${playerId}`, {height: 0.5, diameter: 2}, scene);
  // var newPlayer = BABYLON.MeshBuilder.CreateBox(`${playerId}`, {height: 2, width: 1, depth: 1}, scene);
  newPlayer.position = new BABYLON.Vector3(position.x, position.y, position.z);
  newPlayer.rotation = rotation;
  newPlayer.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(rotation.y, 0, 0);
  newPlayer.material = material;
  newPlayer.id = "player";
  newPlayer.physicsImpostor = new BABYLON.PhysicsImpostor(newPlayer, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 300, restitution: 0.1, friction: 0.1 }, scene);
  // newPlayer.physicsImpostor = new BABYLON.PhysicsImpostor(newPlayer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: 0.1 }, scene);
  // newPlayer.reIntegrateRotationIntoRotationQuaternion = true;
  newPlayer.isVisible = false;
  return newPlayer;
}

function meshInstance(scene, playerId) {
  // Eyes_mesh Body_mesh Teeth_mesh Pants_mesh

  var newEyesInstance = scene.getMeshByName("Eyes_mesh").createInstance("instanced_Eyes_mesh");
  var newBodyInstance = scene.getMeshByName("Body_mesh").createInstance("instanced_Body_mesh");
  var newTeethInstance = scene.getMeshByName("Teeth_mesh").createInstance("instanced_Teeth_mesh");
  var newPantsInstance = scene.getMeshByName("Pants_mesh").createInstance("instanced_Pants_mesh");

  // newEyesInstance.addRotation(0, Math.PI, 0);
  // newBodyInstance.addRotation(0, Math.PI, 0);
  // newTeethInstance.addRotation(0, Math.PI, 0);
  // newPantsInstance.addRotation(0, Math.PI, 0);

  newEyesInstance.parent = scene.getMeshByName(playerId);
  newBodyInstance.parent = scene.getMeshByName(playerId);
  newTeethInstance.parent = scene.getMeshByName(playerId);
  newPantsInstance.parent = scene.getMeshByName(playerId);
}
