
function createPlayer(scene, material, position, playerId, rotation) {
  var newPlayer = BABYLON.MeshBuilder.CreateCylinder(`${playerId}`, {height: 2, diameterTop: 1, diameterBottom: 1.5}, scene);
  // var newPlayer = BABYLON.MeshBuilder.CreateBox(`${playerId}`, {height: 2, width: 1, depth: 1}, scene);
  newPlayer.position = new BABYLON.Vector3(position.x, position.y, position.z);
  newPlayer.rotation = rotation;
  newPlayer.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(rotation.y, 0, 0);
  newPlayer.material = material;
  newPlayer.id = "player";
  newPlayer.physicsImpostor = new BABYLON.PhysicsImpostor(newPlayer, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 2, restitution: 0.1 }, scene);
  // newPlayer.physicsImpostor = new BABYLON.PhysicsImpostor(newPlayer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: 0.1 }, scene);
  // newPlayer.reIntegrateRotationIntoRotationQuaternion = true;
  return newPlayer;
}
