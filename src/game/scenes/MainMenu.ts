import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    star: GameObjects.Image;
    ground: GameObjects.Image;
    logo: GameObjects.Image;
    platforms: StaticGroup;
    player: SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys|undefined;
    
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        this.background = this.add.image(512, 384, 'background');
        this.star = this.add.image(400, 300, 'star');
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

        EventBus.emit('current-scene-ready', this);
    }
    
    preload () {
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
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
