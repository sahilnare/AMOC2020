
class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {
    this.load.image('far_bui', 'public/assets/spritesheets/far-buildings.png');
    this.load.image('back_bui', 'public/assets/spritesheets/back-buildings.png');
    this.load.image('foreGr', 'public/assets/spritesheets/foreground.png');
    this.load.spritesheet("owl", "public/assets/spritesheets/Owlet_Monster_Walk_6.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("owl2", "public/assets/spritesheets/Owlet_Monster_Idle_4.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.add.text(20, 20, "Loading...");

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("owl"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("owl2"),
      frameRate: 20,
      repeat: -1
    });

    setTimeout(() => {
      this.scene.start("playGame");
    }, 1000);
  }
}
