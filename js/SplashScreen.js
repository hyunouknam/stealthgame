var game;
var eye_iris;
var eye_white;
function init(){
    game = new Phaser.Game(1200,700,Phaser.Auto,'',{preload: preload, create: create, update: update});
}
function preload(){
    game.load.image('title','../assets/Id_Title.png');
    game.load.image('eye_white', '../assets/Eye_White.png');
    game.load.image('eye_iris', '../assets/Eye_Iris.png')
}
function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#333";
    var titleImage = game.add.sprite(600,90,'title')
    titleImage.anchor.setTo(.5);
    eye_white = game.add.sprite(600,200,'eye_white')
    eye_white.anchor.setTo(.5);
    eye_iris = game.add.sprite(600,200,'eye_iris');
    eye_iris.anchor.setTo(.5);
}
function update(){
    var mouseX = game.input.mousePointer.x;
    var mouseY = game.input.mousePointer.y;
    if(mouseX > eye_white.x + 10){
        mouseX = eye_white.x + 10;
    }else if(mouseX < eye_white.x-10){
        mouseX = eye_white.x - 10;
    }
    if(mouseY > eye_white.y+10){
        mouseY = eye_white.y + 10;
    }else if(mouseY < eye_white.y-10){
        mouseY = eye_white.y - 10;
    }
    var dx = Math.abs(mouseX-eye_white.x);
    dx *= dx;
    var dy = Math.abs(mouseY-eye_white.y);
    dy *= dy;
    if(dx + dy <= 784){
        eye_iris.x = mouseX;
        eye_iris.y = mouseY;
    }
}