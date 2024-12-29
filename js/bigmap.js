class BigMapScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BigMapScene' });
    }
  
    preload() {
      this.load.image('ground', 'assets/ground.png');
      this.load.image('block', 'assets/block.png');
      this.load.image('coin', 'assets/coin.png');
      this.load.image('playerFrame0', 'assets/playerFrame0.png');
      this.load.image('playerFrame1', 'assets/playerFrame1.png');
    }
  
    create() {
      this.cameras.main.setBackgroundColor('#87CEFA');
      this.physics.world.setBounds(0, 0, 3000, 400);
      this.cameras.main.setBounds(0, 0, 3000, 400);
  
      this.cursors = this.input.keyboard.createCursorKeys();
  
      this.platforms = this.physics.add.staticGroup();
      for (let x = 0; x < 3000; x += 32) {
        if (!((x >= 600 && x < 664) || (x >= 1200 && x < 1264) || (x >= 2000 && x < 2064))) {
          let tile = this.platforms.create(x + 16, 400, 'ground');
          tile.setOrigin(0.5, 1).refreshBody();
        }
      }
  
      this.obstacles = this.physics.add.staticGroup();
      this.obstacles.create(350, 368, 'block').setOrigin(0.5, 1).refreshBody();
      this.obstacles.create(800, 368, 'block').setOrigin(0.5, 1).refreshBody();
      this.obstacles.create(1500, 368, 'block').setOrigin(0.5, 1).refreshBody();
      this.obstacles.create(2200, 368, 'block').setOrigin(0.5, 1).refreshBody();
  
      this.coins = this.physics.add.group({ allowGravity: false });
      this.placeCoin(200, 340);
      this.placeCoin(700, 340);
      this.placeCoin(1300, 340);
      this.placeCoin(1800, 340);
      this.placeCoin(2500, 340);
  
      this.player = this.physics.add.sprite(50, 340, 'playerFrame0');
      this.player.setCollideWorldBounds(false);
  
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
  
      this.anims.create({
        key: 'run',
        frames: [
          { key: 'playerFrame0' },
          { key: 'playerFrame1' }
        ],
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'playerFrame0' }],
        frameRate: 10
      });
  
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
      this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  
      this.score = 0;
      this.scoreText = this.add.text(16, 16, 'Wynik: 0', { fontSize: '20px', fill: '#000' });
      this.scoreText.setScrollFactor(0);
  
      this.gameOver = false;
    }
  
    update() {
      if (this.gameOver) return;
  
      if (this.player.y > 400) {
        this.endGame('Koniec gry');
        return;
      }
  
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.setFlipX(true);
        this.player.anims.play('run', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.setFlipX(false);
        this.player.anims.play('run', true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
      }
  
      if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
        this.player.setVelocityY(-400);
      }
  
      if (this.player.x > 2900) {
        this.endGame('Przeszedłeś poziom, gratulacje!');
      }
    }
  
    placeCoin(x, y) {
      let c = this.physics.add.sprite(x, y, 'coin');
      c.setScale(0.5).refreshBody();
      c.body.setAllowGravity(false);
      this.coins.add(c);
    }
  
    hitObstacle(player, obstacle) {
      this.endGame('Koniec gry');
    }
  
    collectCoin(player, coin) {
      coin.disableBody(true, true);
      this.score += 1;
      this.scoreText.setText('Wynik: ' + this.score);
    }
  
    endGame(message) {
      this.physics.pause();
      this.gameOver = true;
      this.player.setTint(0xff0000);
  
      let overlay = this.add.rectangle(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.6
      );
      overlay.setOrigin(0.5);
  
      let style = { fontSize: '32px', fill: '#fff', align: 'center' };
      let endText = this.add.text(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y - 40,
        message + '\nZdobyte punkty: ' + this.score,
        style
      );
      endText.setOrigin(0.5);
  
      let restartButton = this.add.text(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y + 20,
        'RESTART',
        { fontSize: '24px', fill: '#0f0' }
      );
      restartButton.setOrigin(0.5);
      restartButton.setInteractive();
      restartButton.on('pointerdown', () => {
        this.scene.restart();
      });
    }
  }
  