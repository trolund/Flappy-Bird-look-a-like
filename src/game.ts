import 'phaser'

const height = 600
const width = 800
const spaceBetweenPipsX = 260
const spaceBetweenPipsY = 350

type Pipe = {
    offset: number
    bottomPipe: Phaser.Physics.Arcade.Sprite
    topPipe: Phaser.Physics.Arcade.Sprite
}

export default class Demo extends Phaser.Scene {
    bird: Phaser.Physics.Arcade.Sprite = null
    pointLabel: Phaser.GameObjects.Text = null
    xScroll: number = 0
    lastPipePoint: number = 0
    aktivePipes: Pipe[] = []
    gameOver: boolean = false
    group: any
    pipsColiders: Phaser.Physics.Arcade.Group

    constructor() {
        super('demo')
    }

    preload() {
        this.load.image('bird', 'assets/bird.png')
        this.load.image('pipe', 'assets/pipe.png')
    }

    create() {
        this.pointLabel = this.add.text(30, 30, '', {
            font: '16px Courier',
            fill: '#00ff00',
        })

        this.bird = this.physics.add
            .sprite(100, 400, 'bird')
            .setScale(0.095)
            .setGravity(0, 200)

        this.input.keyboard.on('keydown-' + 'SPACE', (event) => {
            if (!this.gameOver) {
                this.bird.setVelocityY(-240)
                this.bird.setRotation(this.bird.body.velocity.y * 0.02 + 10)
            }
        })
    }

    update() {
        if (!this.gameOver) {
            this.pointLabel.setText('Points: ' + Math.abs(this.xScroll))

            this.xScroll--

            if(this.bird.rotation < 0){
                this.bird.setRotation(this.bird.body.velocity.y * 0.02 + 10)
            }

            if (this.lastPipePoint > this.xScroll) {
                this.createPips()
                this.lastPipePoint = this.xScroll - spaceBetweenPipsX
            }

            this.aktivePipes.forEach((p) => {
                p.bottomPipe.setX(this.xScroll + p.offset)
                p.topPipe.setX(this.xScroll + p.offset)
            })

            this.gameoverCheck()
        }
    }

    gameoverCheck() {
        if (this.bird.y > height || this.bird.y < 0) {
            this.setGameOver()
        }
    }

    setGameOver() {
        this.add.text(width / 2, height / 2, 'Game Over', {
            font: '16px Courier',
            fill: '#00ff00',
        })
        this.game.loop.pause()
        this.gameOver = true
    }

    createPips() {
        var xRandom = Phaser.Math.Between(150, height - 150)

        let bottomPipe = this.physics.add
            .sprite(width + 50, xRandom + spaceBetweenPipsY, 'pipe')
            .setScale(0.26)

        let topPipe = this.physics.add
            .sprite(width + 50, xRandom - spaceBetweenPipsY, 'pipe')
            .setScale(0.26)
            .setRotation(Math.PI)

        this.physics.add.collider(this.bird, [topPipe, bottomPipe], () =>
            this.setGameOver()
        )
        this.aktivePipes.push({
            bottomPipe,
            topPipe,
            offset: Math.abs(this.xScroll) + width + 50,
        } as Pipe)
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
        arcade: { debug: false },
    },
}

const game = new Phaser.Game(config)
