/** 
====================================================================================
* Note: all the sprite here assumes, it has been decorated by the spawner.js
====================================================================================
====================================================================================
* Public Methods:
====================================================================================
* AI:
*
*     enableAI( sprite )
*        create AIObject and maintain it, 
*        @return newly created AIObject
*
*     getAI( sprite )
*        @returns the AIObject associated if exists
*
*     disableAI( sprite )
*        delete the AI associated with the sprite if one exists
*
*     update ()
*        steps the AI behavior by 1 unit of time
*        should be called all the time in the game update method
*    
*
* AIObject:
*
*     getState( statename )
*         @returns the behavior object owned by the AIObject
*     setState( statename )
*         sets the behavior of the AIObject
*     addState( statename , behaviorObj )
*         add a new behavior to the AIObject
*
*
====================================================================================
* All behaviors should have:
* -ownerAIObject //reference to the owner AI
* -update() //method
====================================================================================
====================================================================================
* Available behavior objects and their public properties:
====================================================================================
*
*   'idle'
*   'meander'
*           -radius
*           -x
*   'pursue'
*           -target
*/

function _AIObject ( sprite ) { 
    this.sprite = sprite;  
    this.update = function() {};  
    this.states = {};
}
_AIObject.prototype.constructor = _AIObject;

var AI = {
    list : [],

    update : function (){
        AI.list.forEach( function ( e ) { e.update(); } );
    },
    
    
    enableAI : function ( sprite ) {
        
        //validate sprite
        if( !sprite.entitydata ){
            console.debug("Sprite is not decorated with entitydata");
            return undefined;
        }
        
        //create AIObject
        var newAI = new _AIObject( sprite );
        sprite.ai = newAI;
        
        //add behaviors
        newAI.states.meander = AI.BehaviorFactory.createMeander( newAI.sprite.x , Math.random()*400+100, newAI );
        newAI.states.pursue = AI.BehaviorFactory.createPursue( newAI );
        newAI.states.idle = AI.BehaviorFactory.createIdle( newAI );
        
        //create more behaviors in the BehaviorFactory, then add them here
        
        //set up more methods
        newAI.getState = function ( stateName ) { 
            return newAI.states[stateName] ;
        };
        newAI.setState = function ( stateName ) { 
            var state;
            if ( (state = newAI.getState( stateName )) ){
                newAI.update = state.update;
            }
            return state;
        };
        newAI.addState = function ( name, behavior ){
            newAI.state[name] = behavior;
        };
        
        //initial state
        newAI.setState('meander');
        
        //keep track for maintenance
        AI.list.push( newAI );
        return newAI;
    },
    
    getAI : function ( sprite ) {
        for ( var i = 0; i < AI.list.length; i++ ){
            if( AI.list[i].sprite === sprite ){
                return AI.list[i];
            }
        }
        return undefined;
    },
    
    
    disableAI : function ( sprite ) {
        var index;
        for ( var i = 0; i < AI.list.length; i++ ){
            if( AI.list[i].sprite === sprite ){
                index = i;
                break;
            }
        }
        if(index)
            AI.list.splice(index, 1);
    },
    
    
    //create more behaivors here, though you don't have to
    BehaviorFactory : {
        
        //idle behavior
        createIdle : function ( ownerAIObject ) {
            var behavior = {};

            behavior.ownerAIObject = ownerAIObject;

            behavior.update = function (){
                ownerAIObject.sprite.body.velocity.x = 0;
                ownerAIObject.sprite.animations.play('idle');
            };

            return behavior;
        },

        //meander behavior
        createMeander : function (x, radius, ownerAIObject) {
            var behavior = {};

            behavior.x = x;
            behavior.radius = radius;
            behavior.ownerAIObject = ownerAIObject;

            behavior.update = function (){
                var owner = behavior.ownerAIObject;
                if( owner.sprite.entitydata.facingLeft ){
                    if( owner.sprite.body.x < behavior.x - behavior.radius || 
                        (owner.sprite.body.wasTouching.left && !owner.sprite.entitydata.passthrough)
                      ) {
                        owner.sprite.scale.x *= -1;
                        owner.sprite.entitydata.facingLeft = false;
                        owner.sprite.body.velocity.x = owner.sprite.entitydata.speed;
                    }
                    else {
                        owner.sprite.body.velocity.x = -owner.sprite.entitydata.speed;
                    }
                }
                else{
                    if( owner.sprite.body.x > behavior.x + behavior.radius || 
                        (owner.sprite.body.wasTouching.right && !owner.sprite.entitydata.passthrough)
                      ) {
                        owner.sprite.scale.x *= -1;
                        owner.sprite.entitydata.facingLeft = true;
                        owner.sprite.body.velocity.x = -owner.sprite.entitydata.speed;
                    }
                    else {
                        owner.sprite.body.velocity.x = owner.sprite.entitydata.speed;
                    }
                }
                owner.sprite.animations.play('walk');
            };

            return behavior;
        },

        //pursue behavior
        createPursue : function ( ownerAIObject ) {
            var behavior = {};

            behavior.target = undefined;
            behavior.ownerAIObject = ownerAIObject;

            behavior.update = function (){
                if( behavior.target ) {
                    var owner = behavior.ownerAIObject;
                    if( owner.sprite.body.x + Math.abs(owner.sprite.body.width) < behavior.target.body.x ){
                        if( owner.sprite.entitydata.facingLeft )
                            owner.sprite.scale.x *= -1;
                        owner.sprite.entitydata.facingLeft = false;
                        owner.sprite.body.velocity.x = owner.sprite.entitydata.speed;
                    }
                    else if ( owner.sprite.body.x > behavior.target.body.x+behavior.target.body.width){
                        if( !owner.sprite.entitydata.facingLeft )
                            owner.sprite.scale.x *= -1;
                        owner.sprite.entitydata.facingLeft = true;
                        owner.sprite.body.velocity.x = -owner.sprite.entitydata.speed;
                    }
                    //else do nothing when in tolerance range
                    
                    owner.sprite.animations.play('walk');
                }
                else{
                    //invalid target, return to idle
                    ownerAIObject.setState('idle');
                }
            };

            return behavior;
        }
    },

};

