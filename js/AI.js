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
*
*
====================================================================================
* Available states and their properties:
====================================================================================
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
    _list : [],

    update : function (){
        AI._list.forEach( function ( e ) { e.update(); } );
    },
    
    enableAI : function ( sprite ) {
        var newAI = new _AIObject( sprite );
        
        newAI.states.meander = this.BehaviorFactory.createMeander( newAI.sprite.x , 100, newAI );
        newAI.states.pursue = this.BehaviorFactory.createPursue( newAI );
        newAI.states.idle = this.BehaviorFactory.createIdle( newAI );
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
        
        AI._list.push( newAI );
        return newAI;
    },
    
    getAI : function ( sprite ) {
        for ( var i = 0; i < AI._list.length; i++ ){
            if( AI._list[i].sprite === sprite ){
                return AI._list[i];
            }
        }
        return undefined;
    },
    
    disableAI : function ( sprite ) {
        var index;
        for ( var i = 0; i < AI._list.length; i++ ){
            if( AI._list[i].sprite === sprite ){
                index = i;
                break;
            }
        }
        if(index)
            AI._list.splice(index, 1);
    },
    
    BehaviorFactory : {
    
        createIdle : function ( ownerAIObject ) {
            var behavior = {};

            behavior.ownerAIObject = ownerAIObject;

            behavior.update = function (){
                ownerAIObject.sprite.body.velocity.x = 0;
            };

            return behavior;
        },

        createMeander : function (x, radius, ownerAIObject) {
            var behavior = {};

            behavior.x = x;
            behavior.radius = radius;
            behavior.ownerAIObject = ownerAIObject;

            behavior.update = function (){
                var owner = behavior.ownerAIObject;
                if( owner.sprite.entitydata.facingLeft ){
                    if( owner.sprite.body.x < behavior.x - behavior.radius || 
                        owner.sprite.body.blocked.left || owner.sprite.body.blocked.right
                      ) {
                        owner.sprite.entitydata.facingLeft = false;
                        owner.sprite.body.velocity.x = owner.sprite.entitydata.speed;
                    }
                    else {
                        owner.sprite.body.velocity.x = -owner.sprite.entitydata.speed;
                    }
                }
                else{
                    if( owner.sprite.body.x > behavior.x + behavior.radius || 
                        owner.sprite.body.blocked.left || owner.sprite.body.blocked.right
                      ) {
                        owner.sprite.entitydata.facingLeft = true;
                        owner.sprite.body.velocity.x = -owner.sprite.entitydata.speed;
                    }
                    else {
                        owner.sprite.body.velocity.x = owner.sprite.entitydata.speed;
                    }
                }
            };

            return behavior;
        },

        createPursue : function ( ownerAIObject ) {
            var behavior = {};

            behavior.target = undefined;
            behavior.ownerAIObject = ownerAIObject;

            behavior.update = function (){
                if( behavior.target ) {
                    var owner = behavior.ownerAIObject;
                    if( owner.sprite.body.x + owner.sprite.body.width < behavior.target.body.x ){
                        owner.sprite.entitydata.facingLeft = false;
                        owner.sprite.body.velocity.x = owner.sprite.entitydata.speed;
                    }
                    else if ( owner.sprite.body.x > behavior.target.body.x+behavior.target.body.width){
                        owner.sprite.entitydata.facingLeft = true;
                        owner.sprite.body.velocity.x = -owner.sprite.entitydata.speed;
                    }
                    //else do nothing when in tolerance range
                }
            };

            return behavior;
        }
    },

};

