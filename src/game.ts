import 'phaser';

const height = 600;
const width = 800;



export default class Demo extends Phaser.Scene {
    bird: Phaser.Physics.Arcade.Sprite = null;

    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('bird', 'assets/bird.png');
        // this.load.image('libs', 'assets/libs.png');
        // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        // this.load.glsl('stars', 'assets/starfields.glsl.js');
    }



    create() {

        // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        // this.add.image(400, 300, 'libs');

        // const logo = this.add.image(width / 3, height / 2, 'bird');
        // logo.setScale(0.1);

        this.bird = this.physics.add.sprite(100, 400, "bird");
        this.bird.setScale(0.1);
        this.bird.setGravity(0, 200);

        this.input.keyboard.on('keydown-' + 'SPACE', (event) => {
            console.log(event);
            this.bird.setVelocityY(-240);
        });

        this.cameras.main.startFollow(this.bird);



        // this.tweens.add({
        //     targets: logo,
        //     y: 350,
        //     duration: 1500,
        //     ease: 'Sine.inOut', 
        //     yoyo: true,
        //     repeat: -1
        // })
    }

    update() {
        this.bird.setRotation(this.bird.body.velocity.y * 0.02 + 10)
    }

}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: width,
    height: height,
    scene: Demo,
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
};

const game = new Phaser.Game(config);
