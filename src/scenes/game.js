import Phaser from '../lib/phaser.js';
import Carrot from '../Game/carrot.js';


export default class Game extends Phaser.Scene {
    init(){
        this.carrotsCollected = 0
    }
    
    /**
     * @param {Phaser.GameObject.Sprite} sprite
     */
    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight
            /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot');
        carrot.setActive(true)
        carrot.setVisible(true)
        this.add.existing(carrot)
        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot);
        return carrot
    }
    constructor() {
            super('game');
        }
        /**  @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    preload() {
            this.load.image('background', 'assets/PNG/Background/bg_layer1.png')
            this.load.image('platform', "assets/PNG/Environment/ground_grass.png")
            this.load.image('bunny-stand', 'assets/PNG/Player/bunny1_stand.png')
            this.load.image('bunny-jump','assets/PNG/Player/bunny1_jump.png    ')
            this.load.image('carrot', 'assets/PNG/items/carrot.png');
            this.cursors = this.input.keyboard.createCursorKeys();

        }
     /** @type {Phaser.Physics.Arcade.Sprite} */
    player
    /**  @type {Phaser.Physics.Arcade.Sprite} */
    platforms
    /** @type {Phaser,Physics.Arcade.Group} */
    carrots

    create() {
        this.add.image(240, 320, 'background').setScrollFactor(1, 0);
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
        this.cameras.main.setDeadzone(this.scale.width * 1.5);

        this.carrots = this.physics.add.group({
                classType: Carrot
            })
            //this.carrots.get(240, 320, 'carrot');
        this.physics.add.collider(this.platforms, this.carrots)
        this.physics.add.overlap(this.player,
                                this.carrots,
                                this.handleCollectCarrot,
                                undefined,
                                this)
        const style = {color:'#000',
                       fontSize: 30 }
        this.carrotsCollectedText = this.add.text(240 , 10, 'Carrots: 0', 
            style).setScrollFactor(0)
            .setOrigin(0.5 , 0)
    }
    update(t, td) {

        this.platforms.children.iterate(child => {
            const platform = child;

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700) {

                platform.y = scrollY - Phaser.Math.Between(50, 100);
                platform.body.updateFromGameObject();

                this.addCarrotAbove(platform)
            }
            const bottomplatform = this.findBottomMostPlatfrom()
            if (this.player.y > bottomplatform.y + 200){
                this.scene.start('game-over')
            }
        })

        const touchingDown = this.player.body.touching.down;
        if (touchingDown) {
            this.player.setVelocityY(-350);
            this.player.setTexture('bunny-jump')
        }
        const vy = this.player.body.velocity.y
        if(vy > 0 && this.player.texture.key !== touchingDown){
            this.player.setTexture('bunny-stand')
        }
        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setAccelerationX(0)
        }

         this.horizontalWrap(this.player)
    }

    horizontalWrap(sprite) {

           const halfWidth = sprite.displayWidth * 0.5;
          const gameWidth = this.scale.width;

            if (sprite.x < -halfWidth) {
              sprite.x = gameWidth + halfWidth;
        } else if (sprite.x > gameWidth + halfWidth) {
          sprite.x = -halfWidth;
    }
        }

        /**
         * @param {Phaser.Physics.Arcade.Sprite} player
         * @param {Carrot} carrot
         */
        handleCollectCarrot(player,carrot){
            this.carrots.killAndHide(carrot)
            this.physics.world.disableBody(carrot.body)
            this.carrotsCollected++
            const value = `Carrots:${this.carrotsCollected}`
            this.carrotsCollectedText.text = value
        }

        findBottomMostPlatfrom(){
            const platforms = this.platforms.getChildren()
            let bottomplatform = platforms[0]

            for (let i = 1; i< platforms.length; i++){
                const platform = platforms[i]

                if (platform.y < bottomplatform.y){
                    continue
                }
                bottomplatform = platform
            }
            return bottomplatform;
        
        }
        
   
}