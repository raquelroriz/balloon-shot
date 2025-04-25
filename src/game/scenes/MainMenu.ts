import { GameObjects, Scene } from 'phaser';

import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
import Sprite = Phaser.Physics.Arcade.Sprite;





export class MainMenu extends Scene
{
    background: GameObjects.Image;
    star: GameObjects.Image;
    bombs: Phaser.Physics.Arcade.Group;
    ground: GameObjects.Image;
    logo: GameObjects.Image;
    platforms: StaticGroup;
    player: SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys|undefined;
    stars: Phaser.Physics.Arcade.Group;
    scoreText: GameObjects.Text;
    gameOver: boolean;
    score: number;
    
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        this.background = this.add.image(512, 384, 'background');
        // this.star = this.add.image(400, 300, 'star');
        
        this.platforms = this.physics.add.staticGroup();
        
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //this.player.body.setGravityY(300);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.cursors = this.input.keyboard?.createCursorKeys();
        
        
        this.physics.add.collider(this.player, this.platforms);

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });


        this.stars.children.iterate(function(child) {
            const sprite = child as unknown as Phaser.Physics.Arcade.Sprite;
            sprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            sprite.setScale(0.5); // 50% original size
            return true; // or return null;
        });


        this.physics.add.collider(this.stars, this.platforms);

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });
        
        const collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_player, star) => {
            (star as Sprite).disableBody(true, true);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);

            if (this.stars.countActive(true) === 0)
            {
                this.stars.children.iterate( (star) => {
                    const child = star as Sprite
                    child.enableBody(true, child.x, 0, true, true);
                    return null
                });

                const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                const bomb = this.bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }

        this.physics.add.overlap(this.player, this.stars, collectStar, undefined, this);

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);
        
        const hitBomb = (player : any, _bomb: any) => {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');

            this.gameOver = true;
        }
        
        this.physics.add.collider(this.player, this.bombs, hitBomb, undefined, this);


    }
    
    preload () {
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('bomb', 'assets/bomb.png');
    }
    
    update () {
        if (this.cursors?.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors?.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors?.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}
