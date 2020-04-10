
function createPlayer(scene, material, position, playerId, rotation) {
  var newPlayer = BABYLON.MeshBuilder.CreateCylinder(`${playerId}`, {height: 2, diameterTop: 1, diameterBottom: 1.5}, scene);
  newPlayer.position = new BABYLON.Vector3(position.x, position.y, position.z);
  newPlayer.rotation = rotation;
  newPlayer.material = material;
  newPlayer.id = "player";
  newPlayer.physicsImpostor = new BABYLON.PhysicsImpostor(newPlayer, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 2, restitution: 0.1 }, scene);
  return newPlayer;
}
