import Phaser from "../lib/phaser.js"

export default class GameOver extends Phaser.Scene {
    constructor(){
        super('game-over')
    }
    preload(){
        this.load.image('background', 'assets/PNG/Background/bg_layer1.png')
    }
    create(){
        this.add.image( 240, 300,'background').setScrollFactor(1,0)
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(width*0.5,height*0.5,'Game Over',{color:'#000',fontSize: 48})
        .setOrigin(0.5)

        this.add.text(width*0.5, height*0.6, 'Press SPACE to try again', {color:'#000',fontSize:30})
        .setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE',()=>{
           this.scene.start('game')
       })
    }
}