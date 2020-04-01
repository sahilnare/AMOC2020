
class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);
    this.background.setScale(2);
    this.ship1 = this.add.sprite(Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height), "ship");
    this.ship2 = this.add.sprite(Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height), "ship2");
    this.ship3 = this.add.sprite(Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height), "ship3");
    this.ship1.setScale(2);
    this.ship2.setScale(2);
    this.ship3.setScale(2);
    this.add.text(20, 20, "Playing Game", {font: "25px Arial", fill: "yellow"});

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    this.ship1.play("ship1_anim", true);
    this.ship2.play("ship2_anim", true);
    this.ship3.play("ship3_anim", true);

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gameobjectdown", this.destroyShip, this);

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {start: 2, end: 3}),
      frameRate: 20,
      repeat: -1
    });

    this.powerUps = this.physics.add.group();

    let maxObjects = 4;
    for(let i = 0; i <= maxObjects; i++) {
      let powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);
      if(Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }
      powerUp.setScale(2);
      powerUp.setVelocity(150, 150);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }
    this.physics.add.collider(this.powerUps, this.powerUps);
  }

  moveShip(ship, speed) {
    ship.y += speed
    if(ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    let randomX = Phaser.Math.Between(0, config.width)
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  update() {
    // this.ship1.angle += 3;
    this.moveShip(this.ship1, 4);
    this.moveShip(this.ship2, 4);
    this.moveShip(this.ship3, 4);

    this.background.tilePositionY -= 0.5;
  }
}
