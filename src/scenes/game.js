import Phaser from '../lib/phaser.js';


export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }
    preload() {
            this.load.image('background', 'assets/PNG/Background/bg_layer1.png')
            this.load.image('platform', "assets/PNG/Environment/ground_grass.png")
            this.load.image('bunny-stand', 'assets/PNG/Player/bunny1_stand.png')
        }
        /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /**  @type {Phaser.Physics.Arcade.Sprite} */
    platforms
    create() {
        this.add.image(240, 320, 'background');
        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;


            /**  @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform');
            platform.scale = 0.5

            const body = platform.body;
            body.updateFromGameObject();
        }

        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5);
        this.physics.add.collider(this.platforms, this.player);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.right = false;
        this.player.body.checkCollision.left = false;

        this.cameras.main.startFollow(this.player);
    }
    update() {

        this.platforms.children.iterate(child => {
            const platform = child;

            const scroll
        })
        const touchingDown = this.player.body.touching.down;
        if (touchingDown) {
            this.player.setVelocityY(-300);
        }
    }
}