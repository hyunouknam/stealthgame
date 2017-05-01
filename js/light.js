/*
Methods:

requestLight(sprite);   //attach light to a sprite
removeLight(sprite);    //remove light from a sprite
lightAll();     //wipes out shadow
lightDown();    //reenable shadow

*/
var createLightingManager = function (game) {
    var manager = {};
    manager.wholeMask = game.add.bitmapData(this.game.width, this.game.height);
    manager.litSprites = game.add.group();
    manager.game = game;
    
    
    manager.lightSprite = game.add.image(0,0,manager.wholeMask);
    manager.lightSprite.fixedToCamera = true;
    manager.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    
    manager.cameraRect = new Phaser.Rectangle(game.camera.x, game.camera.y, game.camera.width, game.camera.height);
    manager.lightCircle = new Phaser.Circle(0,0,0);
    
    manager.stop = false;
    
    manager.requestLight = function (sprite, radius){
        var light = {};
        light.radius = radius;
        sprite.light = light;
        manager.litSprites.add(sprite);
    };
    
    manager.removeLight = function ( sprite ) {
        manager.litSprites.remove(sprite);
    };
    
    manager.lightAll = function(){
        manager.stop = true;
        manager.lightSprite.alpha = 0;
    };
    
    manager.lightDown = function () {
        manager.stop = false;
        manager.lightSprite.alpha = 1;
    };
    
    //optimizers
    manager.counter = 2;
    manager.maxCounter = 2;
    
    manager.update = function () { 
        if(manager.stop)
            return;
        
        //set up calculation vars
        manager.cameraRect.x = manager.game.camera.x;
        manager.cameraRect.y = manager.game.camera.y;
        manager.cameraRect.width = manager.game.camera.width;
        manager.cameraRect.height = manager.game.camera.height;
        
        //set up mask
        manager.wholeMask.context.fillStyle = 'rgb(0,0,0)';
        manager.wholeMask.context.fillRect(0, 0, manager.cameraRect.width, manager.cameraRect.height);
        var randOffset =  manager.game.rnd.integerInRange(-10,10);
        
        for(var i = 0; i < manager.litSprites.children.length; i++){
            var sprite = manager.litSprites.children[i];
            var radius = sprite.light.radius;
            
            var randomRadius = radius + randOffset;
            
            if(manager.onScreen(sprite)){
                
                var finalX = sprite.x-manager.cameraRect.x;
                var finalY = sprite.y-manager.cameraRect.y;
            

                var g= manager.wholeMask.context.createRadialGradient( 
                    finalX,  
                    finalY, 
                    randomRadius * 0.5, 
                    finalX, 
                    finalY, 
                    randomRadius);
                
                //g.addColorStop(0.5, 'rgba(255,215, 0, 1)');
                //g.addColorStop(0.5, 'rgba(0,180, 180, 1)');
                //g.addColorStop(0.5, 'rgba(255,0,0, 1)');
                g.addColorStop(0, 'rgba(255,255, 15, 1)');
                g.addColorStop(1, 'rgba(255,255, 15,0)');

                manager.wholeMask.context.beginPath(); 
                manager.wholeMask.context.fillStyle = g;
                manager.wholeMask.context.arc(finalX, finalY,randomRadius,0,Math.PI*2);
                manager.wholeMask.context.fill();
            }
        }
        
        //optimzers
        manager.counter--;
        if(manager.counter<=0){
            manager.counter = manager.maxCounter;
            manager.wholeMask.dirty = true;
        }
    };
    
    manager.onScreen = function (sprite) {
        manager.lightCircle.x = sprite.x;
        manager.lightCircle.y = sprite.y;
        manager.lightCircle.radius = sprite.light.radius;
        return Phaser.Circle.intersectsRectangle(manager.lightCircle, manager.cameraRect );
    };
    
    manager.lightSprite.bringToTop();
    return manager;
};