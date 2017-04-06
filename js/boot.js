var game;
function init(){
    game = new Phaser.Game(1200,700,Phaser.AUTO,'');
    game.state.add('menu',menuState);
    game.state.add('play',playState);
    game.state.start('menu');
}
