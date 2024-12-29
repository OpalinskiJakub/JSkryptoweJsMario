class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#87CEFA');

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
    let welcomeText = this.add.text(
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y - 40,
      'Witaj w grze',
      style
    );
    welcomeText.setOrigin(0.5);

    let startButton = this.add.text(
      this.cameras.main.midPoint.x,
      this.cameras.main.midPoint.y + 20,
      'NACIŚNIJ SPACJĘ',
      { fontSize: '24px', fill: '#0f0' }
    );
    startButton.setOrigin(0.5);
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('BigMapScene');
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('BigMapScene');
    });
  }
}
