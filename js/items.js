

/**
 * 
 */

var createItemManager = function(game,player){
    var manager = {};
    manager.player = player;

    player.items = [null,null,null,null,null];
    player.currentItem = null;
    player.currentItemIndex = 0;
    player.amtOfItems = 0;

    manager.collectItem = function(player,item){
        if(player.amtOfItems<5){
            player.amtOfItems++;
            item.kill();
            playState.collectionSound.play();
            var index = 0;;
            for(var i = 0; i < player.items.length; i++){
                if(player.items[i] == null){
                    index = i;
                    break;
                }
            }
            switch(item.key){
                case 'lantern':
                    player.items[index] = game.add.sprite(860 + (index*55), 615, 'lantern');
                    player.items[index].fixedToCamera = true;
                    break;
                case 'bomb':
                    player.items[index] = game.add.sprite(860 + (index*55), 615, 'bomb')
                    player.items[index].fixedToCamera = true;
                    break;
            }
            
        }
    }

    manager.useItem = function(){
        if(player.currentItem != null){
            switch(player.currentItem.key){
                case 'lantern':
                    lightManager.removeLight(player);
                    lightManager.requestLight(player, lanternRadius);
                    break;
                case 'bomb':
                    if(!player.godMode.enabled){
                        lightManager.removeLight(player);
                        lightManager.requestLight(player,defaultLightRaidus);
                        lightManager.lightDown();
                    }
                    break;
            }
        }else{
            if(!player.godMode.enabled){
                lightManager.removeLight(player);
                lightManager.requestLight(player,defaultLightRaidus);
                lightManager.lightDown();
            }
        }
    }

    manager.holdItem = function(){
        if(player.items[player.currentItemIndex] != null){
            switch(player.items[player.currentItemIndex].key) {
                case "lantern":
                    if(player.currentItem != null && player.currentItem.key != 'lantern'){
                        player.currentItem.kill();
                        player.currentItem = null;
                    }

                break;
                case "bomb":
                    if(player.currentItem != null && player.currentItem.key != 'bomb'){
                        player.currentItem.kill();
                        player.currentItem = null;
                    }
                break;

            }
            if(player.currentItem == null){
                if(player.isFacingLeft){
                    player.currentItem = game.add.sprite(player.position.x + 1,player.position.y + 26,player.items[player.currentItemIndex].key);
                    player.currentItem.scale.setTo(.75,.75);
                }else{
                    player.currentItem = game.add.sprite(player.position.x + 25, player.position.y + 26, player.items[player.currentItemIndex].key);
                    player.currentItem.scale.setTo(.75, .75);
                }
            }else{
                if(player.isFacingLeft){
                    player.currentItem.position.x = player.position.x + 1;
                    player.currentItem.position.y = player.position.y + 26;
                }else{
                    player.currentItem.position.x = player.position.x + 25;
                    player.currentItem.position.y = player.position.y + 26;
                }
            }
        }else{
            if(player.currentItem != null){
                player.currentItem.kill();
                player.currentItem = null;
            }
        }
    }

    manager.switchItem = function(){
        if(dKey.isDown && !selected.locked){
            if(player.currentItemIndex==4){
                player.currentItemIndex=0;
                selected.cameraOffset.x = 855;
                selected.locked = true;
                game.time.events.add(200,function(){selected.locked=false;});
            }else{
                player.currentItemIndex++;
                selected.cameraOffset.x += 55;
                selected.locked = true;
                game.time.events.add(200,function(){selected.locked=false;});
            }
        }else if(aKey.isDown && !selected.locked){
            if(player.currentItemIndex==0){
                player.currentItemIndex=4;
                selected.cameraOffset.x = 855+(55*4);
                selected.locked = true;
                game.time.events.add(200,function(){selected.locked=false;});
            }else{
                player.currentItemIndex--;
                selected.cameraOffset.x -= 55;
                selected.locked = true;
                game.time.events.add(200,function(){selected.locked=false;});
            }
        }
    }

    return manager;
}