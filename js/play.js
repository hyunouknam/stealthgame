var health = 194;
var stamina = 194;
var sanity = 194;
var healthBar,staminaBar,sanityBar,isPaused=false,
    pausedMenu, locked, resumeButton;
var escKey, shiftKey, spaceKey;
var player, cursors;// platforms;
var level;
var collideDown = true;

var playState = {
    preload: function(){
        game.load.image('hud','../assets/HUD.png');
        game.load.image('health_bar','../assets/Health_Bar.png');
        game.load.image('stamina_bar','../assets/Stamina_Bar.png');
        game.load.image('sanity_bar','../assets/Sanity_Bar.png');
        game.load.image('paused_image','../assets/Paused_Menu.png');
        game.load.image('resume_button','../assets/Resume_Button.png');

        game.load.image('sky', '../assets/sky.png');
        game.load.image('platform', '../assets/platform.png');
        game.load.spritesheet('player', '../assets/player.png', 64, 96);
        
        level = loadLevel( game, 'forest_level_json', 'forest_level_tilemap');
    },
    create: function(){
        level.create();
        
        escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.add.sprite(0, 0, 'sky');
        //platforms = game.add.group();
        //platforms.enableBody = true;
        //var ground = platforms.create(0, game.world.height - 182, 'platform');
        //ground.scale.setTo(3, 1);
        //ground.body.immovable = true;

        var hud = game.add.sprite(0,550,'hud');
        healthBar = game.add.sprite(87,612,'health_bar');
        staminaBar = game.add.sprite(331,612,'stamina_bar');
        sanityBar = game.add.sprite(576,612,'sanity_bar');
        
        hud.fixedToCamera = true;
        healthBar.fixedToCamera = true;
        staminaBar.fixedToCamera = true;
        sanityBar.fixedToCamera = true;

        cursors = game.input.keyboard.createCursorKeys();
        shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        playerCreate();
    },
    update: function(){
        if(!isPaused){
            if(escKey.isDown && !locked){
                locked = true;
                isPaused = true;
                pausedMenu = game.add.sprite(0,0,'paused_image');
                resumeButton = game.add.button(425,130,'resume_button',function(){resumeButton.isPressed=true;resume()});
                game.time.events.add(Phaser.Timer.SECOND,function(){locked = false;});
            }
        }else if(escKey.isDown && !locked){
               resume();
        }

        //  Collide the player with platform
        //game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, level.solidGroup);

        if(collideDown){
            game.physics.arcade.collide(player, level.platformGroup);
        }

        game.camera.follow( player );
        playerMove();
        
    }
    
}
function playerCreate(){
    player = game.add.sprite(level.playerSpawnPoint.x , level.playerSpawnPoint.y, 'player');
    game.physics.arcade.enable(player);

    // player physics
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // player animations
    player.animations.add('default', [0], 10, true);

    player.animations.add('walk left', [0, 1, 2, 3], 10, true);
    player.animations.add('walk right', [4, 5, 6, 7], 10, true);
    player.animations.add('walk left hold item', [8, 9, 10, 11], 10, true);
    player.animations.add('walk right hold item', [12, 13, 14, 15], 10, true);
    player.animations.add('jump right', [16], 10, true);
    player.animations.add('jump left', [20], 10, true);
    player.animations.add('jump left hold item', [24], 10, true);
    player.animations.add('jump right hold item', [28], 10, true);
    player.animations.add('throw left', [32, 33, 34, 35], 10, false);
    player.animations.add('throw right', [36, 37, 38, 39], 10, false);
    player.animations.add('death', [40, 41, 42, 43], 10, false);

    player.animations.add('run left', [0, 1, 2, 3], 15, true);
    player.animations.add('run right', [4, 5, 6, 7], 15, true);
    player.animations.add('run left hold item', [8, 9, 10, 11], 15, true);
    player.animations.add('run right hold item', [12, 13, 14, 15], 15, true);

}

function playerMove(){
    player.body.velocity.x = 0;
    if (spaceKey.isDown && player.body.touching.down && cursors.right.isDown) {
        player.body.velocity.y = -300;
        player.animations.play("jump right");
    }
    else if (spaceKey.isDown && player.body.touching.down && cursors.left.isDown) {
        player.body.velocity.y = -300;
        player.animations.play("jump left");
    }else if (spaceKey.isDown && player.body.touching.down){
        player.body.velocity.y = -300;
        player.animations.play("default");
    }else if(shiftKey.isDown){
        if(!player.body.touching.down){
            if (cursors.left.isDown){
                player.body.velocity.x = -300;
            }else if (cursors.right.isDown){
                player.body.velocity.x = 300;
            }else{
                player.animations.play('default');
            }
        }else{
            if (cursors.left.isDown){
                player.body.velocity.x = -300;
                player.animations.play('run left');
            }else if (cursors.right.isDown){
                player.body.velocity.x = 300;
                player.animations.play('run right');
            }else{
                player.animations.play('default');
            }
        }
    }else if(cursors.down.isDown && collideDown){
        collideDown = false;
        game.time.events.add(Phaser.Timer.SECOND*.2,function(){collideDown = true;});
    }else{
        if(!player.body.touching.down){
            if (cursors.left.isDown){
                player.body.velocity.x = -150;
            }else if (cursors.right.isDown)
            {
                player.body.velocity.x = 150;
            }else{
                player.animations.play('default');
            }
        }else{
            if (cursors.left.isDown){
                player.body.velocity.x = -150;
                player.animations.play('walk left');
            }else if (cursors.right.isDown)
            {
                player.body.velocity.x = 150;
                player.animations.play('walk right');
            }else{
                player.animations.play('default');
            }
        }
    }

}

function playerHoldItem(){
    
}

function resume(){
    if((escKey.isDown && !locked) || (resumeButton.isPressed)){
        resumeButton.isPressed = false;
        game.time.events.add(Phaser.Timer.SECOND*.2,function(){pausedMenu.destroy();resumeButton.destroy();isPaused = false;}); 
    }
}