var game;
var eye_iris;
var eye_white;
var start;
var fade;
function init(){
    game = new Phaser.Game(1200,700,Phaser.Auto,'',{preload: preload, create: create, update: update});
}
function preload(){
    game.load.image('title','../assets/Id_Title.png');
    game.load.image('eye_white', '../assets/Eye_White.png');
    game.load.image('eye_iris', '../assets/Eye_Iris.png');
    game.load.image('start', '../assets/Click_To_Start.png');
}
function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#444";
    var titleImage = game.add.sprite(600,90,'title');
    titleImage.anchor.setTo(.5);
    start = game.add.sprite(600,600,'start');
    start.anchor.setTo(.5);
    eye_white = game.add.sprite(600,350,'eye_white')
    eye_white.anchor.setTo(.5);
    eye_white.scale.setTo(5);
    eye_iris = game.add.sprite(600,350,'eye_iris');
    eye_iris.anchor.setTo(.5);
    eye_iris.scale.setTo(5);
}
function update(){
    eyeMovement();
    if(fade){
        fadeOut(start);
        if(start.alpha <= 0){
            fade = !fade;
        }
    }else{
        fadeIn(start);
        if(start.alpha >= 1){
            fade = !fade;
        }
    }
}
function eyeMovement(){
    var mouseX = game.input.mousePointer.x;
    var mouseY = game.input.mousePointer.y;
    var dx = mouseX-eye_white.x;
    var dy = mouseY-eye_white.y;

    if(dx*dx+dy*dy <= 6400){             // 225 is area using 15 below
        eye_iris.x = mouseX;
        eye_iris.y = mouseY;
    }else{
        if(dx*dx+dy*dy>30){ 
            var angle=Math.atan2(dy,dx);    //Get the angle
            eye_iris.x = eye_white.x + 80 * Math.cos(angle);
            eye_iris.y = eye_white.y + 80 * Math.sin(angle);
        }
    }
}
function fadeOut(object){
    object.alpha -= .005;
}
function fadeIn(object){
    object.alpha += .005;
}