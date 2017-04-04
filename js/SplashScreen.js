var game;
var eye_iris;
var eye_white;
var eye_scale = 4;
function init(){
    game = new Phaser.Game(1200,700,Phaser.AUTO,'',{preload: preload, create: create, update: update});
}
function preload(){
    game.load.image('title','../assets/Id_Title.png');
    game.load.image('eye_white', '../assets/Eye_White.png');
    game.load.image('eye_iris', '../assets/Eye_Iris.png')
}
function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#444";
    var titleImage = game.add.sprite(600,90,'title')
    titleImage.anchor.setTo(.5);
    eye_white = game.add.sprite(600,270,'eye_white')
    eye_white.anchor.setTo(.5);
    eye_iris = game.add.sprite(600,270,'eye_iris');
    eye_iris.anchor.setTo(.5);
    
    game.stage.smoothed = false;
    eye_iris.scale.setTo(eye_scale);
    eye_white.scale.setTo(eye_scale);
}
function update(){
    var mouseX = game.input.mousePointer.x;
    var mouseY = game.input.mousePointer.y;
    var dx = mouseX-eye_white.x;
    var dy = mouseY-eye_white.y;

    if(dx*dx+dy*dy <= 225*eye_scale*eye_scale){             // 225 is area using 15 below
        eye_iris.x = mouseX;
        eye_iris.y = mouseY;
    }else{
        if(dx*dx+dy*dy>6){ 
            var angle=Math.atan2(dy,dx);    //Get the angle
            eye_iris.x = eye_white.x + 15*eye_scale * Math.cos(angle);
            eye_iris.y = eye_white.y + 15*eye_scale * Math.sin(angle);
        }
    }
}