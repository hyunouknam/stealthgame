var healthBar,staminaBar,sanityBar,selected, isPaused=false,
    pausedMenu, locked, resumeButton, nextLevelButton, mainMenuButtonIngame,controlsMenu, resumeVelocity = false, levelCompleted = false;

var escKey, shiftKey, aKey, sKey, dKey, ekey, kKey,oneKey,twoKey,threeKey;
var player, cursors, mask, largeMask;
var music;
var hudGroup;


var level;
var spawner;
var lightManager;
var itemManager;
var terrainDestructor;

var staticLantern, staticBomb;
var lantern, bomb; //= "lantern", flashlight = "flashlight", rock = "rock", bomb = "bomb", oil = "oil";

var lanternRadius = 300;
var defaultLightRaidus = 100;

var playState = {
    collectionSound: null,walkingSound: null,runningSound: null,enlargedSign: null,charGroup: null,
    preload: function(){
        game.load.image('hud','../assets/hud/HUD.png');
        game.load.image('health_bar','../assets/hud/Health_Bar.png');
        game.load.image('stamina_bar','../assets/hud/Stamina_Bar.png');
        //game.load.image('sanity_bar','../assets/hud/Sanity_Bar.png');
        game.load.image('paused_image','../assets/menus/Paused_Menu.png');
        game.load.image('controls_screen','../assets/menus/Controls_Screen.png');
        game.load.image('selected_tool','../assets/hud/Selected_Tool.png');
        game.load.image('next_level_menu','../assets/menus/Level_Complete_Menu.png');
        game.load.image('enlarged_sign','../assets/menus/enlargedSign.png');
        game.load.spritesheet('chars','../assets/chars.png', 155,330);
        game.load.image('xButton','../assets/buttons/xButton.png');

        game.load.spritesheet('resume_button','../assets/buttons/Resume_Button.png',350,150);
        game.load.spritesheet('main_menu_button','../assets/buttons/Main_Menu_Button_Ingame.png',350,150);
        game.load.spritesheet('next_level_button','../assets/buttons/Next_Level_Button.png',350,150);

        game.load.image('mask','../assets/mask.png');
        game.load.image('mask large','../assets/mask large.png');
        game.load.spritesheet('player', '../assets/player.png', 48, 72);

        game.load.image('lantern', '../assets/lantern.png');
        game.load.image('flashlight', '../assets/flashlight.png');
        game.load.image('rock', '../assets/rock.png');
        game.load.image('bomb', '../assets/bomb.png');
        game.load.image('oil', '../assets/oil.png');
        
        game.load.spritesheet('enemy1', '../assets/enemy.png', 48, 72);
        game.load.image('key', '../assets/key.png');
        game.load.image('sign','../assets/sign.png');
        game.load.image('door', '../assets/door.png');
        
        
        game.load.image('rockparticle', '../assets/rockparticle.png');
        game.load.image('dirtparticle', '../assets/dirtparticle.png');

        
        game.load.audio('collection_sound','../assets/sounds/collection_sound.mp3');
        game.load.audio('walking_sound','../assets/sounds/walking_sound.mp3');
        game.load.audio('running_sound','../assets/sounds/run_sound.mp3');
        game.load.audio('music','../assets/sounds/music.wav');
        

        spawner = loadSpawner( game, 'monster_profile_json');
        level = loadLevel( game, game.level_json, game.level_tilemap);

    },
    create: function(){
        lightManager = createLightingManager(game);
        level.create( spawner );
        AI.initTerrain( level.layers['solids'] );
        terrainDestructor = createDestructor(game, level.solidGroup, level.layers.solids, level.tilemap);///////////////////////////////////////////////////////////////
        
        //game.camera.height = 550;
        game.camera.height = 576;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        playState.collectionSound = game.add.audio('collection_sound');
        playState.walkingSound = game.add.audio('walking_sound');
        playState.walkingSound.volume = .75
        playState.runningSound = game.add.audio('running_sound');
        music = game.add.audio('music');
        music.play(null,0,.15,true);
        var hud = game.add.sprite(0,550,'hud');
        healthBar = game.add.sprite(87,612,'health_bar');
        staminaBar = game.add.sprite(331,612,'stamina_bar');
        //sanityBar = game.add.sprite(576,612,'sanity_bar');
        selected = game.add.sprite(855,609,'selected_tool');
        
        hud.fixedToCamera = true;
        healthBar.fixedToCamera = true;
        staminaBar.fixedToCamera = true;
        //sanityBar.fixedToCamera = true;
        selected.fixedToCamera = true;

        // create a mask over player
        //mask = game.add.sprite(level.playerSpawnPoint.x + 24, level.playerSpawnPoint.y + 36, 'mask');
        //mask.anchor.setTo(.5);

        //largeMask = game.add.sprite(level.playerSpawnPoint.x + 24, level.playerSpawnPoint.y + 36, 'mask large');
        //largeMask.anchor.setTo(.5);


        // spawn test lantern

        lantern = game.add.sprite(level.playerSpawnPoint.x + 100, level.playerSpawnPoint.y, 'lantern');
        game.physics.arcade.enable(lantern);
        lantern.body.gravity.y = 700;

        // spawn test bomb

        bomb = game.add.sprite(level.playerSpawnPoint.x + 500, level.playerSpawnPoint.y, 'bomb');
        game.physics.arcade.enable(bomb);
        bomb.body.gravity.y = 700;
        

        hudGroup = game.add.group();
        //hudGroup.add(mask);
        //hudGroup.add(largeMask);
        hudGroup.add(lightManager.lightSprite);
        hudGroup.add(hud);
        hudGroup.add(healthBar);
        hudGroup.add(staminaBar);
        //hudGroup.add(sanityBar);
        hudGroup.add(selected);

        cursors = game.input.keyboard.createCursorKeys();
        shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        iKey = game.input.keyboard.addKey(Phaser.Keyboard.I);
        kKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
        oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);

        playerCreate();
        itemManager = createItemManager(game,player);
        level.renderSort ( player , hudGroup);
        AI.setTarget( player );
        
        lightManager.requestLight(player, defaultLightRaidus);
    },
    render: function(){
        //level.debugRender();
        lightManager.update();
    },
    update: function(){
        //game.time.advancedTiming = true; 
        //console.debug(game.time.fps) ;

        game.physics.arcade.collide(player, level.solidGroup);
        game.physics.arcade.collide(level.platformGroup, level.collidableSpawnGroup);
        game.physics.arcade.collide(level.solidGroup, level.collidableSpawnGroup);

        game.physics.arcade.collide(bomb, level.solidGroup);
        game.physics.arcade.collide(lantern, level.solidGroup);
        game.physics.arcade.collide(level.keyGroup, level.solidGroup);
        game.physics.arcade.collide(level.nextLevelGroup,level.solidGroup);
        game.physics.arcade.collide(level.signGroup,level.solidGroup);
        terrainDestructor.collideParticles();
        
        pause();
        resume();
        
        AI.update();

        if(!isPaused && !levelCompleted){

            //AI.debugRaycast(game);
            game.physics.arcade.collide(player, level.doorGroup);
            game.physics.arcade.overlap(player, level.keyGroup, openDoor, null, this);
            game.physics.arcade.overlap(player, level.nextLevelGroup,playState.levelTransition,null,this);
            
            game.physics.arcade.collide(level.doorGroup, level.collidableSpawnGroup);
            game.physics.arcade.overlap(player, lantern, itemManager.collectItem, null, this);  // testing lantern
            game.physics.arcade.overlap(player, bomb, itemManager.collectItem, null, this);  // testing bomb
            game.physics.arcade.overlap(player, level.collidableSpawnGroup, playerDamaged, null, this);
            game.physics.arcade.overlap(player, level.passthroughSpawnGroup, playerDamaged, null, this);
            if(eKey.isDown){
                game.physics.arcade.overlap(player, level.signGroup, playState.openSign, null, this);
            }

            if(player.collideDown){
                game.physics.arcade.collide(player, level.platformGroup);
            }
            if(iKey.isDown && !player.godMode.locked){
                player.godMode.locked = true;
                player.godMode.enabled = !player.godMode.enabled;
                if(player.godMode.enabled){
                    //mask.alpha = 0;
                    //largeMask.alpha = 0;
                    lightManager.lightAll();
                }else{
                    lightManager.lightDown();
                    //mask.alpha = 1;
                    //largeMask.alpha = 1;
                }
                game.time.events.add(200,function(){player.godMode.locked = false;});
            }

            if(kKey.isDown && player.godMode.enabled){
                killDoorAndKeys();
            }
            if(oneKey.isDown){
                music.stop();
                game.level_json='forest_level_json';
                game.level_tilemap = 'forest_level_tilemap';
                game.world.removeAll();
                resumeVelocity = false;
                game.state.start('play');
            }else if(twoKey.isDown){
                music.stop();
                game.level_json='dungeon_level_json';
                game.level_tilemap = 'dungeon_level_tilemap';
                game.world.removeAll();
                resumeVelocity = false;
                game.state.start('play');
            }else if(threeKey.isDown){
                music.stop();
                game.level_json='final_level_json';
                game.level_tilemap = 'final_level_tilemap';
                game.world.removeAll();
                resumeVelocity = false;
                game.state.start('play');
            }




            playerDeath();
            if(!player.dead){
                playerMove();
            }
            game.camera.follow( player );
            //maskFollowPlayer();
            itemManager.switchItem();
            itemManager.holdItem();
            itemManager.useItem();

            player.body.gravity.y = 700;
            if(resumeVelocity){
                player.body.velocity.x = player.currentVelocityX;
                player.body.velocity.y = player.currentVelocityY;
            }


            player.currentVelocityX = player.body.velocity.x;
            player.currentVelocityY = player.body.velocity.y;

            // return velocity if it was not 0, based on right before pausing / player.currentVelocityX etc.
        }else{
            if(player.body.velocity.x > 0){
                player.currentVelocityX = player.body.velocity.x;
            }

            if(player.body.velocity.y > 0){
                player.currentVelocityY = player.body.velocity.y;
            }


            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.body.gravity.y = 0;

        }
        
        
    },
    levelTransition: function(){

        levelCompleted = true;
        AI.pause();
        nextLevelMenu = game.add.sprite(0,0,'next_level_menu');
        nextLevelMenu.fixedToCamera = true;
        if(game.level_json != 'final_level_json'){
            nextLevelButton = game.add.button(425,130,'next_level_button',function(){
                game.world.removeAll();
                music.stop();
                levelCompleted = false;
                game.state.start('play');
            },this,0,0,1,0);
            nextLevelButton.fixedToCamera = true;
            mainMenuButtonIngame = game.add.button(425, 300,'main_menu_button',function(){
                game.world.removeAll();
                isPaused = false;
                locked = false;
                music.stop();
                resumeVelocity = false;
                game.state.start('menu');
                levelCompleted = false;
            },this,0,0,1,0);
            mainMenuButtonIngame.fixedToCamera = true;
        }else{
            mainMenuButtonIngame = game.add.button(425, 130,'main_menu_button',function(){
            game.world.removeAll();
            isPaused = false;
            locked = false;
            music.stop();
            resumeVelocity = false;
            game.state.start('menu');
            levelCompleted = false;
            },this,0,0,1,0);
            mainMenuButtonIngame.fixedToCamera = true;
        }
        
        
        switch(game.level_json){
            case 'forest_level_json':
                game.level_json = 'dungeon_level_json';
                game.level_tilemap = 'dungeon_level_tilemap';
                game.level2Locked = false;
                break;
            case 'dungeon_level_json':
                game.level_json = 'final_level_json';
                game.level_tilemap = 'final_level_tilemap';
                game.level3Locked = false;
            default:
        }
    },
    openSign: function(player,sign){
        charGroup = game.add.group();
        enlargedSign = game.add.sprite(100,100,'enlarged_sign');
        enlargedSign.fixedToCamera = true;
        xButton = game.add.button(110,110,'xButton',function(){
            xButton.destroy();
            playState.closeSign();
        });
        xButton.fixedToCamera = true;
        charGroup.add(enlargedSign);
        levelCompleted = true;
        AI.pause();
        index = 0;
        row = 0;
        counter = 0;
        sign.text.forEach(function(char){
            newChar = playState.createChar(char,index++,row);
            charGroup.add(newChar);
            counter++;
        });
        console.log(counter);
    },
    closeSign: function(){
        levelCompleted = false;
        AI.start();
        var length = charGroup.children.length;
        for(var i = 0;i<length;i++){
            charGroup.children[0].destroy();
        }
    },
    createChar: function(char,col){
        var newChar = game.add.sprite(150+(col*40),150+(row *70),'chars');
        newChar.scale.setTo(.2);
        newChar.fixedToCamera = true;
        switch(char.toLowerCase()){
            case 'a':
                newChar.frame = 0;
                break;
            case 'b':
                newChar.frame = 1;
                break;
            case 'c':
                newChar.frame = 2;
                break;
            case 'd':
                newChar.frame = 3;
                break;
            case 'e':
                newChar.frame = 4;
                break;
            case 'f':
                newChar.frame = 5;
                break;
            case 'g':
                newChar.frame = 6;
                break;
            case 'h':
                newChar.frame = 7;
                break;
            case 'i':
                newChar.frame = 8;
                break;
            case 'j':
                newChar.frame = 9;
                break;
            case 'k':
                newChar.frame = 10;
                break;
            case 'l':
                newChar.frame = 11;
                break;
            case 'm':
                newChar.frame = 12;
                break;
            case 'n':
                newChar.frame = 13;
                break;
            case 'o':
                newChar.frame = 14;
                break;
            case 'p':
                newChar.frame = 15;
                break;
            case 'q':
                newChar.frame = 16;
                break;
            case 'r':
                newChar.frame = 17;
                break;
            case 's':
                newChar.frame = 18;
                break;
            case 't':
                newChar.frame = 19;
                break;
            case 'u':
                newChar.frame = 20;
                break;
            case 'v':
                newChar.frame = 21;
                break;
            case 'w':
                newChar.frame = 22;
                break;
            case 'x':
                newChar.frame = 23;
                break;
            case 'y':
                newChar.frame = 24;
                break;
            case 'z':
                newChar.frame = 25;
                break;
            case '.':
                newChar.frame = 26;
                break;
            case ',':
                newChar.frame = 27;
                break;
            case '!':
                newChar.frame = 28;
                break;
            case '|':
                row++;
                index=0;
            default:
                newChar.frame = 29;
            break;
        }
        return newChar;
    }
}
function playerCreate(){
    player = game.add.sprite(level.playerSpawnPoint.x, level.playerSpawnPoint.y, 'player');
    game.physics.arcade.enable(player);

    // player physics
    player.body.gravity.y = 700;
    player.body.collideWorldBounds = true;

    // player animations
    player.animations.add('default right', [12], 10, true);
    player.animations.add('default left', [8], 10, true);

    player.animations.add('walk left', [0, 1, 2, 3], 5, true);
    player.animations.add('walk right', [4, 5, 6, 7], 5, true);
    player.animations.add('walk left hold item', [8, 9, 10, 11], 5, true);
    player.animations.add('walk right hold item', [12, 13, 14, 15], 5, true);
    player.animations.add('jump right', [16], 10, true);
    player.animations.add('jump left', [20], 10, true);
    player.animations.add('jump left hold item', [24], 10, true);
    player.animations.add('jump right hold item', [28], 10, true);
    player.animations.add('throw left', [32, 33, 34, 35], 10, false);
    player.animations.add('throw right', [36, 37, 38, 39], 10, false);
    player.animations.add('death', [40, 41, 42, 43], 7, false);

    player.animations.add('run left', [0, 1, 2, 3], 10, true);
    player.animations.add('run right', [4, 5, 6, 7], 10, true);
    player.animations.add('run left hold item', [8, 9, 10, 11], 10, true);
    player.animations.add('run right hold item', [12, 13, 14, 15], 10, true);

    player.health = 194;
    player.stamina = 194;
    player.sanity = 194;
    player.maxHealth = 194;
    player.maxStamina = 194;
    player.rested = true;
    player.dead = false;
    player.isFacingLeft = false;
    player.godMode = {enabled:false,locked:false};
    player.collideDown = true;
    player.currentVelocityX = 0;
    player.currentVelocityY = 0;
}

function playerMove(){
    player.body.velocity.x = 0;
    if (cursors.up.isDown && player.body.touching.down && cursors.right.isDown) {
        player.body.velocity.y = -380
        player.animations.play("jump right hold item");
    }
    else if (cursors.up.isDown && player.body.touching.down && cursors.left.isDown) {
        player.body.velocity.y = -380
        player.animations.play("jump left hold item");
    }else if (cursors.up.isDown && player.body.touching.down){
        player.body.velocity.y = -380
        if(player.isFacingLeft){
            player.animations.play('default left');
        }else{
            player.animations.play('default right');
        }
    }else if(shiftKey.isDown && player.stamina>0){
        if(!player.body.touching.down){
            if (cursors.left.isDown){
                loseStamina();
                player.body.velocity.x = -300;
            }else if (cursors.right.isDown){
                loseStamina();
                player.body.velocity.x = 300;
            }else{
                if(player.isFacingLeft){
                    player.animations.play('default left');
                }else{
                    player.animations.play('default right');
                }
            }
        }else{
            if (cursors.left.isDown){
                loseStamina();
                player.body.velocity.x = -300;
                player.animations.play('run left hold item');
                player.isFacingLeft = true;
                if(!playState.runningSound.isPlaying){
                    if(playState.runningSound.paused){
                        playState.runningSound.resume(null,true);
                    }else{
                        playState.runningSound.play(null,true);
                    }
                }
            }else if (cursors.right.isDown){
                loseStamina();
                player.body.velocity.x = 300;
                player.animations.play('run right hold item');
                player.isFacingLeft = false;
                if(!playState.runningSound.isPlaying){
                    if(playState.runningSound.paused){
                        playState.runningSound.resume(null,true);
                    }else{
                        playState.runningSound.play(null,true);
                    }
                }
            }else{
                playState.runningSound.pause();
                if(player.isFacingLeft){
                    player.animations.play('default left');
                }else{
                    player.animations.play('default right');
                }
            }
        }
    }else{
        if(player.rested)
            generateStamina();
        if(!player.body.touching.down){
            if (cursors.left.isDown){
                player.body.velocity.x = -150;
            }else if (cursors.right.isDown)
            {
                player.body.velocity.x = 150;
            }else{
                if(player.isFacingLeft){
                    player.animations.play('default left');
                }else{
                    player.animations.play('default right');
                }
            }
        }else{
            if (cursors.left.isDown){
                if(!playState.walkingSound.isPlaying){
                    if(playState.walkingSound.paused){
                        playState.walkingSound.resume(null,true);
                    }else{
                        playState.walkingSound.play(null,true);
                    }
                }
                player.body.velocity.x = -150;
                player.animations.play('walk left hold item');
                player.isFacingLeft = true;
            }else if (cursors.right.isDown)
            {   
                player.body.velocity.x = 150;
                player.animations.play('walk right hold item');
                player.isFacingLeft = false;
                if(!playState.walkingSound.isPlaying){
                    if(playState.walkingSound.paused){
                        playState.walkingSound.resume(null,true);
                    }else{
                        playState.walkingSound.play(null,true);
                    }
                }
            }else{
                playState.walkingSound.pause();
                if(player.isFacingLeft){
                    player.animations.play('default left');
                }else{
                    player.animations.play('default right');
                }
            }
        }
    }
    if(cursors.down.isDown && player.collideDown){
        player.collideDown = false;
        game.time.events.add(Phaser.Timer.SECOND*.3,function(){player.collideDown = true;});
    }
    
    if(cursors.left.isUp && cursors.right.isUp){
        player.rested = true;
    }
}

function maskFollowPlayer(){
    mask.position.x = player.position.x + 24;
    mask.position.y = player.position.y + 36;
    largeMask.position.x = player.position.x + 24;
    largeMask.position.y = player.position.y + 36;
}


function playerDeath(){
    if(player.health <= 0){
        player.animations.play('death');
        player.dead = true;
        player.body.velocity.x = 0;
        player.currentItem.kill();
    }
}

function resume(){
    if(isPaused){
        if((escKey.isDown && !locked) || (resumeButton.isPressed)){
            resumeButton.isPressed = false;
            game.time.events.add(Phaser.Timer.SECOND*.2,function(){
                pausedMenu.destroy();
                resumeButton.destroy();
                mainMenuButtonIngame.destroy();
                controlsMenu.destroy();
                isPaused = false;
                AI.start();
            }); 

            game.time.events.add(Phaser.Timer.SECOND*.215,function(){
                resumeVelocity = false;
            }); 
        }
    }
}
function pause(){
    if(!isPaused && !player.dead){
        if(escKey.isDown && !locked){
            locked = true;
            isPaused = true;
            resumeVelocity = true;
            pausedMenu = game.add.sprite(0,0,'paused_image');
            pausedMenu.fixedToCamera = true;
            resumeButton = game.add.button(425,130,'resume_button',function(){
                resumeButton.isPressed=true;
                resume();
            },this,0,0,1,0);
            resumeButton.fixedToCamera = true;
            mainMenuButtonIngame = game.add.button(425, 300,'main_menu_button',function(){
                game.world.removeAll();
                isPaused = false;
                locked = false;
                resumeVelocity = false;
                game.state.start('menu');
            },this,0,0,1,0);
            mainMenuButtonIngame.fixedToCamera = true;
            controlsMenu = game.add.sprite(100,100,'controls_screen');
            controlsMenu.fixedToCamera = true;
            game.time.events.add(Phaser.Timer.SECOND,function(){
                locked = false;
            });
            AI.pause();
        }
    }
}

function playerDamaged( player, mob ){
    if(!player.godMode.enabled){
        player.health -= player.health <= 0 ? 0: 1;
        healthBar.width -= player.health <= 1 ? 0: 1;
    }
}

function loseStamina(){
    if(!player.godMode.enabled){
        player.stamina -= player.stamina <= 1 ? player.stamina: 1;
        staminaBar.width = player.stamina;
    }
}

function generateStamina(){
    player.stamina = player.stamina+1 >= player.maxStamina ? player.maxStamina: player.stamina+1;
    staminaBar.width = player.stamina
}

function openDoor( player, keySprite){
    level.openDoor( keySprite );
    playState.collectionSound.play();
    keySprite.kill();
    terrainDestructor.destroyTerrain(player.x-50, player.y+50, 100, 100, 'dirtparticle');//////////////////////////////////////////////////////////////
}

function killDoorAndKeys(){
    level.keyGroup.forEach(function (a) { a.kill(); });
    level.doorGroup.forEach(function (b) { b.kill(); });
}