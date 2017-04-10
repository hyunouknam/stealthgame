
/**
* Create a level object.
*
* @method loadLevel
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {string} jsonFileKey - The key of the tiledmap json file in the cache loaded with game.load.json.
* @param {string} tiledmapKey - The key of the tiledmap in the cache loaded with game.load.tilemap
* @return {object} Level object.
*/
var loadLevel = function( game, jsonFileKey, tiledmapKey ){
    
    var level = {};
    
    level.game = game;
    level.tiledmapKey = tiledmapKey;
    level.tilesetList = [];
    level.mapJSON = game.cache.getJSON(jsonFileKey);
    level.background = game.add.group();
    level.solidGroup = game.add.group();
    level.platformGroup = game.add.group();
    level.spawnGroup = game.add.group();
    level.playerSpawnPoint = { x : 64, y : 64 };    //temporary
    
    
    game.load.image('level_background', 'assets/forestlevelbackground.png');    //temporary, to be changed so it loads from JSON
    
    //load tileset images
    var mapTileSets = level.mapJSON.tilesets;
    for( var i = 0; i < mapTileSets.length; i++){
        var iterObject = mapTileSets[i];
        if( iterObject.hasOwnProperty( 'image' ) ){
            var newURL = iterObject.image.replace( '../', 'assets/tiled/' );
            game.load.image( iterObject.name, newURL );
            level.tilesetList.push( iterObject.name );
        }
    }
    
    //create level function
    level.create = function () {
        level.game.stage.backgroundColor = '#ffffff';

        //create map images
        var tilemap = game.add.tilemap( level.tiledmapKey );
        for(var i = 0; i < level.tilesetList.length; i++)
            tilemap.addTilesetImage( level.tilesetList[i] );
        
        //create layers
        var layerlist = level.mapJSON.layers;
        for(var i = 0; i < layerlist.length; i++){
            if( layerlist[i].type === 'tilelayer' )
                tilemap.createLayer( layerlist[i].name ).resizeWorld();
        }

        //create objects 
        for(var i = 0; i < level.mapJSON.layers.length; i++){
            if(level.mapJSON.layers[i].hasOwnProperty('objects')){
                var objectarray = level.mapJSON.layers[i].objects;
                switch(level.mapJSON.layers[i].name){
                    case 'platform object': 
                        for(var j = 0; j < objectarray.length; j++){
                            var collisionObject = level.game.add.sprite(objectarray[j].x, objectarray[j].y, null);
                            level.game.physics.enable(collisionObject);
                            collisionObject.body.setSize(objectarray[j].width, objectarray[j].height );
                            collisionObject.body.immovable =  true;
                            collisionObject.body.checkCollision.left = false;
                            collisionObject.body.checkCollision.right = false;
                            collisionObject.body.checkCollision.down = false;
                            level.platformGroup.add(collisionObject);

                        }
                        break;
                    case 'solid object' : 
                        for(var j = 0; j < objectarray.length; j++){
                            var collisionObject = level.game.add.sprite(objectarray[j].x, objectarray[j].y, null);
                            level.game.physics.enable(collisionObject);
                            collisionObject.body.setSize(objectarray[j].width, objectarray[j].height );
                            collisionObject.body.immovable =  true;
                            level.solidGroup.add(collisionObject);
                        }
                        break;
                    case 'player spawn' :                               //temporary
                        level.playerSpawnPoint.x = objectarray[0].x;
                        level.playerSpawnPoint.y = objectarray[0].y;
                        break;
                    default : break;
                }
            }
        }

        //create background
        var bg = level.game.add.sprite(0,0,'level_background');         ///temporary
        bg.fixedToCamera = true;
        bg.scale.setTo(0.7, 0.7);
        game.world.sendToBack( bg );
    };
    
    return level;
};