
class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    this.far_bui = this.add.tileSprite(0, 0, game.config.width, game.config.height, "far_bui");
    this.far_bui.setOrigin(0, 0);
    this.far_bui.setScrollFactor(0);
    // this.bg_1.setScale(2);

    this.back_bui = this.add.tileSprite(0, 0, game.config.width, game.config.height, "back_bui");
    this.back_bui.setOrigin(0, 0);
    this.back_bui.setScrollFactor(0);
    // this.bg_2.setScale(2);

    this.foreGr = this.add.tileSprite(0, 0, game.config.width, game.config.height, "foreGr");
    this.foreGr.setOrigin(0, 0);
    this.foreGr.setScrollFactor(0);
    // this.ground.setScale(2);
    // this.ground.y = 12 * 16;

    this.player = this.physics.add.sprite(game.config.width * 3, game.config.height - 30, "owl");
    // this.player.setScale(2);
    this.player.play("idle");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, game.config.width * 6, game.config.height);
    this.myCam.startFollow(this.player, false, 0.3, 0.3);
  }

  movePlayer() {
    if (this.cursors.left.isDown && this.player.x > 0) {
      // this.player.x -= 3;
      this.player.setVelocityX(-100);
      this.player.scaleX = -1;
      this.player.play("walk", true);
    } else if (this.cursors.right.isDown && this.player.x < game.config.width * 6) {
      // this.player.x += 3;
      this.player.setVelocityX(100);
      this.player.scaleX = 1;
      this.player.play("walk", true);
    } else {
      this.player.setVelocityX(0);
      this.player.play("idle", true);
    }
  }

  update() {
    this.movePlayer();

    this.far_bui.tilePositionX = this.myCam.scrollX * .3;
    this.back_bui.tilePositionX = this.myCam.scrollX * .6;
    this.foreGr.tilePositionX = this.myCam.scrollX;
  }
}
