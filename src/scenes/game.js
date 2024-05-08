import Phaser from '../lib/phaser.js';


export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }
    preload() {
        this.load.image('background', 'assets/PNG/Background/bg_layer1.png')
        this.load.image('platform', "assets/PNG/Environment/ground_grass.png")
    }
    create() {
        this.add.image(240, 329, 'background')
        const platforms = this.physics.add.staticGroup();

        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;

            const platform = platforms.create(x, y, 'platform');
            platform.scale = 0.5

            const body = platform.body
            body.updateFromGameObject()
        }
    }
}