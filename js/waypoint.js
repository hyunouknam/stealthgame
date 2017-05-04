var preloadWaypoint = function (game) {
    game.load.image('waypointarrow','../assets/arrow.png');
};
var createWaypoint = function ( game, ownersprite, w, h, spritelist ){
    var waypointManager = {};
    waypointManager.waypointGroup = game.add.group();
    waypointManager.restrictionSprite = game.add.sprite(ownersprite.x, ownersprite.y, null);
    waypointManager.restrictionSprite.width = w;
    waypointManager.restrictionSprite.height = h;
    waypointManager.restrictionSprite.anchor.setTo(0.5, 0.5);
    waypointManager.owner = ownersprite;
    
    spritelist.forEach(function (e) {
        //var bitmap = game.add.bitmapData(e.width, e.height);
        //bitmap.
        //bitmap.draw(e);
        var group = game.add.group();
        var base = game.add.sprite(0,0,'waypointarrow');
        var waypointSprite = game.add.sprite(0,0,e.key);
        base.anchor.setTo(0.5,0.5);
        waypointSprite.anchor.setTo(0.5,0.5);
        
        group.destination = e;
        group.add(base);
        group.add(waypointSprite);
        //waypointSprite.destination = e;
        //waypointManager.waypointGroup.add(waypointSprite);
        waypointManager.waypointGroup.add(group);
    });
    
    waypointManager.hide = function () {
        waypointManager.waypointGroup.forEach(function(e){
            e.alpha = 0;
        });
    };
    
    waypointManager.show = function () {
        waypointManager.waypointGroup.forEach(function(e){
            e.alpha = 1;
        });
    };
    
    waypointManager.update = function(){
        
        //update restriction
        waypointManager.restrictionSprite.reset(waypointManager.owner.x, waypointManager.owner.y);
        
        //prepare remove dead sprites
        var removals = [];
        
        //update the position of waypoints
        waypointManager.waypointGroup.forEach(function(e){
            if(e.destination.alive){
                var waypointX = e.destination.x;
                var waypointY = e.destination.y;
                var dx = waypointX - waypointManager.restrictionSprite.x;
                var dy = waypointY - waypointManager.restrictionSprite.y;

                if(dx*dx+dy*dy <= waypointManager.restrictionSprite.width*waypointManager.restrictionSprite.width){             // 225 is area using 15 below
                    e.x = waypointX;
                    e.y = waypointY;
                    e.rotation = Math.PI/2;
                }else{
                    if(dx*dx+dy*dy>waypointManager.restrictionSprite.width){
                        var angle=Math.atan2(dy,dx);    //Get the angle
                        e.rotation = angle;
                        e.x = waypointManager.restrictionSprite.x + waypointManager.restrictionSprite.width * Math.cos(angle);
                        e.y = waypointManager.restrictionSprite.y + waypointManager.restrictionSprite.width * Math.sin(angle);
                    }
                }
            }
            else{
                removals.push(e);
            }
        });
        
        //remove dead sprite references
        removals.forEach(function(e){
            waypointManager.waypointGroup.remove(e);
        });
    };
    
    return waypointManager;
};