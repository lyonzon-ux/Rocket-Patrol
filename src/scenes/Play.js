class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }
    preload(){
        this.load.image('borderleft','./assets/borderleft.png');
        this.load.image('borderright','./assets/borderright.png');
        this.load.image('rocket', './assets/goose.png');
        this.load.image('spaceship', './assets/teslagate.png');
        this.load.image('newship', './assets/bread.png');
        this.load.image('starfield', './assets/infRunbg.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create(){
        this.starfield = this.add.tileSprite(0, 0, 480, 640, 'starfield').setOrigin(0, 0);        
        this.add.rectangle(0,borderUISize+borderPadding, game.config.width, borderUISize * 2, 0x6b6868).setOrigin(0,0); //green bar
        this.add.rectangle(0,0,game.config.width,borderUISize,0x262626).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x262626).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, -30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, -20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, -10).setOrigin(0,0);
        this.ship04 = new Newship(this, game.config.width + borderUISize*2, borderUISize*5 + borderPadding*4, 'newship', 0, 20).setOrigin(0,0);
        this.borderright = this.add.tileSprite(0,0, 32, 640, 'borderright').setOrigin(0, 0); //left
        this.borderleft = this.add.tileSprite(game.config.width - borderUISize, 0, 32, 640, 'borderleft').setOrigin(0, 0);//right
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);0
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.p1time = game.settings.gameTimer;
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
          }
          this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
          scoreConfig.fixedWidth = 0;
          this.gameOver = false;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        }, null, this);
        }
    update(){
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            }
         if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        this.starfield.tilePositionY -= 4;
        if (!this.gameOver) {
        this.p1Rocket.update();
        this.ship01.update();               // update spaceships (x3)
        this.ship02.update();
        this.ship03.update();
        this.ship04.update();
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            game.settings.gameTimer -= 2000;   
          }
          if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            game.settings.gameTimer -= 2000;
          }
          if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            game.settings.gameTimer -= 2000;
          }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            
          }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });   
        game.settings.gameTimer-=2000;
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;       
        this.sound.play('sfx_explosion');
        if (this.p1Score == -50) {
          game.settings.gameTimer-2000
          this.gameOVer = true;
        }

    }
}   
