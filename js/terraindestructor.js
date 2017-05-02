/*
Methods:

destroyTerrain(x, y, width, height, particleImageString);
destructor.collideParticles();  //if want collision, call this in every update to collide

*/


var createDestructor = function (game, solidgroup, tilelayer, map){
    var destructor = {};
    destructor.solidList = solidgroup;
    destructor.map = map;
    destructor.layer = tilelayer;
    destructor.game = game;
    destructor.particleRef = 'destructor_particle';
    destructor.particleEmitter = game.add.emitter();
    destructor.particleEmitter.setYSpeed(350, 400);
    destructor.particleEmitter.bounce.set(0.2, 0.2);
    
    
    destructor.destroyTerrain = function (x, y, width, height, particleImgRef){
        var rectAndTiles = destructor.removeTile(x, y, width, height);
        var rect = rectAndTiles.rect;
        var tiles = rectAndTiles.tiles;
        
        if(rect.isValid){
            destructor.particleEmitter.makeParticles(particleImgRef, null, 100, true);
            destructor.removeBody(rect.x, rect.y, rect.width, rect.height, tiles);
        }
    };
    
    destructor.removeTile = function (x, y, width, height){
        var tiles = destructor.layer.getTiles(x, y, width, height, false, false);
        var rect = {};
        rect.x = destructor.game.math.snapToFloor(x, 32);/////////////////////////////////////////////hardcoded 32
        rect.y = destructor.game.math.snapToFloor(y, 32);/////////////////////////////////////////////hardcoded 32
        rect.width = destructor.game.math.snapToCeil(x+width, 32)-rect.x;/////////////////////////////////////////////hardcoded 32
        rect.height = destructor.game.math.snapToCeil(y+height, 32)-rect.y;/////////////////////////////////////////////hardcoded 32
        rect.isValid = false;
        if(tiles.length > 0)
            rect.isValid = true;
        
        return {rect, tiles};
    };
    
    destructor.removeBody = function ( x, y, width, height, tiles ) {
        //get overlaps
        var overlappedSprites = [];
        
        //console.log(overlapper.x+ " "+overlapper.y+" "+overlapper.width+" "+ overlapper.height)
        //console.log(player.x+ " "+player.y)
        
        var inputRect = new Phaser.Rectangle(x,y,width,height);
        var solidRect = new Phaser.Rectangle(0,0,1,1);
        destructor.solidList.forEach( function (e) {
            solidRect.x = e.x;
            solidRect.y = e.y;
            solidRect.width = e.width;
            solidRect.height = e.height;
            if(Phaser.Rectangle.intersects(solidRect, inputRect)){
                //console.debug(b.x + " "+ b.y )
                //console.debug(a.x + " "+ a.y )
                //console.debug(overlapper.x + " "+ overlapper.y )
                overlappedSprites.push(e);
            }
        });
        
        //calculate the properties for the new splitted sprites
        
        var newShapes = [];
        for(var i = 0; i < overlappedSprites.length; i++){
            var solid = overlappedSprites[i];
            var rect = {x: x, y: y, width: width, height: height};
            if(rect.x > solid.x){   //left
                var newRect = {};
                newRect.x = solid.x;
                newRect.y = solid.y;
                newRect.width = rect.x - solid.x;
                newRect.height = solid.height;
                newShapes.push(newRect);
            }
            if(rect.x + rect.width < solid.x + solid.width){  //right
                var newRect = {};
                newRect.x = rect.x + rect.width;
                newRect.y = solid.y;
                newRect.width = solid.x + solid.width - (rect.x + rect.width);
                newRect.height = solid.height;
                newShapes.push(newRect);
            }
            if(rect.y > solid.y){   //top
                var newRect = {};
                newRect.x = rect.x > solid.x ? rect.x : solid.x;
                newRect.y = solid.y;
                var width;
                var rectRight = rect.x + rect.width;
                var solidRight = solid.x + solid.width;
                if(rect.x <= solid.x && rectRight >= solidRight){    //both sides
                    width = solid.width;
                }
                else if (rect.x  > solid.x && rectRight >= solidRight){  //right side
                    width = solidRight - rect.x;
                }
                else if( rect.x <= solid.x && rectRight < solidRight){   //left side
                    width = rectRight - solid.x;
                }
                else{   //inside
                    width = rect.width;
                }
                newRect.width = width;
                //newRect.height = solid.y + solid.height - rect.y;
                newRect.height = rect.y-solid.y;
                newShapes.push(newRect);
            }
            if(rect.y + rect.height < solid.y + solid.height){  //bottom
                var newRect = {};
                newRect.x = rect.x > solid.x ? rect.x : solid.x;
                newRect.y = rect.y + rect.height;
                var width;
                var rectRight = rect.x + rect.width;
                var solidRight = solid.x + solid.width;
                if(rect.x <= solid.x && rectRight >= solidRight){    //both sides
                    console.log("BOTH");
                    width = solid.width;
                }
                else if (rect.x  > solid.x && rectRight >= solidRight){  //right side
                    width = solidRight - rect.x;
                }
                else if( rect.x <= solid.x && rectRight < solidRight){   //left side
                    width = rectRight - solid.x;
                }
                else{   //inside
                    width = rect.width;
                }
                newRect.width = width;
                newRect.height = solid.y + solid.height - (rect.y + rect.height);
                newShapes.push(newRect);
            }
        }
        
        //add the splitted
        for(var i = 0; i < newShapes.length; i++){
            var newShape = newShapes[i];
            var newSprite = destructor.game.add.sprite(newShape.x, newShape.y, null);
            newSprite.width = newShape.width;
            newSprite.height = newShape.height;
            destructor.game.physics.enable(newSprite);
            newSprite.body.immovable =  true;
            destructor.solidList.add(newSprite);
        }
        
        //kill the original
        for(var i = 0; i < overlappedSprites.length; i++){
            var sprite = overlappedSprites[i];
            destructor.solidList.remove(sprite);
            
            sprite.kill();
        }
        
        
        //remove tiles
        //emit particle
        tiles.forEach( function (e) { 
            //emit
            destructor.particleEmitter.width = e.width;
            destructor.particleEmitter.height = e.height;
            destructor.particleEmitter.x = e.worldX + e.width/2;
            destructor.particleEmitter.y = e.worldY + e.height/2;
            
            //remove
            destructor.particleEmitter.start( true, 5000, null, 8);
            destructor.map.removeTile(e.x, e.y, destructor.layer)
        } );
    };
    
    destructor.collideParticles = function(){
        destructor.game.physics.arcade.collide(destructor.particleEmitter, destructor.solidList);
    };
    
    return destructor;
};