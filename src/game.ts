import 'phaser';

const height = 600;
const width = 800;

type Pipe = {
    offset: number;
    bottomPipe: Phaser.Physics.Arcade.Sprite;
    topPipe: Phaser.Physics.Arcade.Sprite;
}

export default class Demo extends Phaser.Scene {
    bird: Phaser.Physics.Arcade.Sprite = null;
    xScroll: number = 0;
    lastPipePoint: number = 0;
    aktivePipes: Pipe[] = []

    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {
        this.bird = this.physics.add.sprite(100, 400, "bird");
        this.bird.setScale(0.1);
        this.bird.setGravity(0, 200);

        this.input.keyboard.on('keydown-' + 'SPACE', (event) => {
            console.log(event);
            this.bird.setVelocityY(-240);
        });
    }

    update() {
        this.xScroll--;
        this.bird.setRotation(this.bird.body.velocity.y * 0.02 + 10)

        if(this.lastPipePoint > this.xScroll){
            this.createPips();
            this.lastPipePoint = this.xScroll - 200;
        }

        this.aktivePipes.forEach(p => {
            p.bottomPipe.setX(this.xScroll + p.offset)
            p.topPipe.setX(this.xScroll + p.offset)
        });
    }

    createPips() {
        var xRandom = Phaser.Math.Between(150, height - 150);

        let bottomPipe = this.physics.add.sprite(width, xRandom + 400, "pipe");
        bottomPipe.setScale(0.26);

        let topPipe = this.physics.add.sprite(width, xRandom - 300, "pipe");
        topPipe.setScale(0.26);
        topPipe.setRotation(Math.PI);

        this.aktivePipes.push({bottomPipe, topPipe, offset: Math.abs(this.xScroll) + width} as Pipe);
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
