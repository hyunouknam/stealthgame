var health = 194;
var stamina = 194;
var sanity = 194;
var healthBar,staminaBar,sanityBar,isPaused=false,
    pausedMenu, locked;
var escKey;
var playState = {
    preload: function(){
        game.load.image('hud','../assets/HUD.png');
        game.load.image('health_bar','../assets/Health_Bar.png');
        game.load.image('stamina_bar','../assets/Stamina_Bar.png');
        game.load.image('sanity_bar','../assets/Sanity_Bar.png');
        game.load.image('paused_image','../assets/Paused_Menu.png');
    },
    create: function(){
        game.add.sprite(0,550,'hud');
        healthBar = game.add.sprite(87,612,'health_bar');
        staminaBar = game.add.sprite(331,612,'stamina_bar');
        sanityBar = game.add.sprite(576,612,'sanity_bar');
        escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    },
    update: function(){
        if(!isPaused){
            if(escKey.isDown && !locked){
                locked = true;
                isPaused = true;
                pausedMenu = game.add.sprite(0,0,'paused_image');
                game.time.events.add(Phaser.Timer.SECOND*.2,function(){locked = false;});
            }
        }else if(escKey.isDown && !locked){
                game.time.events.add(Phaser.Timer.SECOND*.2,function(){pausedMenu.kill();isPaused = false;});
        }
    }
}