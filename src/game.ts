import 'phaser'

const height = 600
const width = 800
const spaceBetweenPipsX = 260
const spaceBetweenPipsY = 350

type Pipe = {
    offset: number
    bottomPipe: Phaser.Physics.Arcade.Sprite
    topPipe: Phaser.Physics.Arcade.Sprite
    randomX: number
}

type Coordinates = {
    x: number
    y: number
}

export default class Demo extends Phaser.Scene {
    bird: Phaser.Physics.Arcade.Sprite = null
    pipsColiders: Phaser.Physics.Arcade.Group = null

    graphics: Phaser.GameObjects.Graphics = null

    xScroll: number = 0
    lastPipePoint: number = 0
    aktivePipes: Pipe[] = []
    gameOver: boolean = false
    group: any

    birdYLabel: Phaser.GameObjects.Text = null
    distanceToPipeLabel: Phaser.GameObjects.Text = null
    pointLabel: Phaser.GameObjects.Text = null

    topPipeYLabel: Phaser.GameObjects.Text = null
    bottomPipeYLabel: Phaser.GameObjects.Text = null

    debugTopPoint: Phaser.Geom.Point = null;

    constructor() {
        super('demo')
    }

    // cleanAktivePips() {
    //     const toDestroy = this.aktivePipes.filter((p) => !p.topPipe.visible)
    //     toDestroy.forEach((p) => {
    //         p.bottomPipe.destroy()
    //         p.topPipe.destroy()
    //     })
    //     console.log(this.aktivePipes.filter((p) => p.topPipe.visible).length)
    // }

    // inputs for the ML model
    get nerestPipe() {
        return this.aktivePipes
            .filter((p) => p.bottomPipe.x > this.bird.x)
            .reduce(
                (c, p) => {
                    return c.bottomPipe.x < p.bottomPipe.x ? c : p
                },
                {
                    offset: 0,
                    bottomPipe: { x: 3000 },
                    topPipe: { x: 3000 },
                } as Pipe
            )
    }

    get distanceToPipe() {
        return this.nerestPipe.bottomPipe.x - this.bird.x
    }

    // // get topPipePos(): Phaser.Physics.Arcade.Sprite {
    // //     return this.nerestPipe.topPipe
    // // }

    // get bottomPipeY() {
    //     return 0
    //     // return this.aktivePipes
    //     //     .map(
    //     //         p => ({ y: p.bottomPipe.y, x: p.bottomPipe.y } as Coordinates)
    //     //     )
    //     //     .filter(p => p.x > this.bird.x)
    //     //     .reduce(
    //     //         (c, p) => {
    //     //             return c.x < p.x ? c : p
    //     //         },
    //     //         { x: Infinity, y: 0 } as Coordinates
    //     //     ).y
    // }

    get birdY() {
        return this.bird.y
    }

    drawDebugPoints() {
        const pips = this.nerestPipe
    }

    preload() {
        this.load.image('bird', 'assets/bird.png')
        this.load.image('pipe', 'assets/pipe.png')
    }

    drawDebugUi() {
        this.graphics.clear();
        this.debugTopPoint.x = this.nerestPipe.topPipe.x;
        this.debugTopPoint.y = this.nerestPipe.randomX;
        this.graphics.fillPointShape(this.debugTopPoint, 10);
    }

    create() {
        this.pointLabel = this.add.text(30, 30, '', {
            font: '16px Courier',
            fill: '#00ff00',
        })

        this.birdYLabel = this.add.text(30, 50, '', {
            font: '16px Courier',
            fill: '#00ff00',
        })

        this.distanceToPipeLabel = this.add.text(30, 70, '', {
            font: '16px Courier',
            fill: '#00ff00',
        })

        this.bottomPipeYLabel = this.add.text(30, 90, '', {
            font: '16px Courier',
            fill: '#00ff00',
        })

        this.topPipeYLabel = this.add.text(30, 120, '', {
            font: '16px Courier',
            fill: '#00ff00',
        })

        this.bird = this.physics.add
            .sprite(300, 400, 'bird')
            .setScale(0.095)
            .setGravity(0, 200)

        this.input.keyboard.on('keydown-' + 'SPACE', (event) => {
            if (!this.gameOver) {
                this.bird.setVelocityY(-170) // -240
                this.bird.setRotation(this.bird.body.velocity.y * 0.02 + 10)
            }
        })

        this.debugTopPoint = new Phaser.Geom.Point(300, 100);
        this.graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
    }

    update() {
        if (!this.gameOver) {
            // this.cleanAktivePips()
            this.drawDebugPoints()

            // data labels
            this.pointLabel.setText('Points: ' + Math.abs(this.xScroll))
            this.distanceToPipeLabel.setText(
                'Dis to pip: ' + this.distanceToPipe
            )
            this.birdYLabel.setText('Bird Y: ' + this.birdY)

            const pipes = this.nerestPipe
            this.topPipeYLabel.setText('top pipe Y: ' + (pipes.topPipe.displayHeight - Math.abs(pipes.topPipe.y)))
            this.bottomPipeYLabel.setText('bottom pipe Y: ' + (pipes.bottomPipe.displayHeight - Math.abs(pipes.bottomPipe.y)))

            this.xScroll--

            if (this.bird.rotation < 0) {
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
        this.drawDebugUi()
    }

    gameoverCheck() {
        if (this.bird.y > height || this.bird.y < 0) {
            this.setGameOver()
        }
    }

    setGameOver() {
        this.add.text(width / 2 - 30, height / 2, 'Game Over', {
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
            randomX: xRandom
        } as Pipe)
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: width,
    height: height,
    scene: Demo,
    fps: { min: 20 },
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
} as Phaser.Types.Core.GameConfig

const game = new Phaser.Game(config)
