//
// ShatterPlatePiece.js
// 
// Author: Liv Erickson
// Copyright High Fidelity 2018
//
// Licensed under the Apache 2.0 License
// See accompanying license file or http://apache.org/
//
/* globals Entities, SoundCache */

(function() {
    var VELOCITY_TO_BREAK = 1.5;
    var EMIT_TIME = 2000;
    var breakURL = Script.resolvePath("sound/glass-break2.wav");
    var breakSound = SoundCache.getSound(breakURL);
    var volumeLevel = 0.25;
    var canBreak = false;
    var _entityID;
    
    var PlatePiece = function(){};
    var shouldBreak = function(velocity){
        return Math.abs(velocity.x) >= VELOCITY_TO_BREAK ||
            Math.abs(velocity.y) >= VELOCITY_TO_BREAK ||
            Math.abs(velocity.z) >= VELOCITY_TO_BREAK;
    };

    var createParticles = function(position) {
        var splat = Entities.addEntity({
            "type":"ParticleEffect",
            "position": position,
            "collisionless":1,
            "dynamic":0,
            "name":"Plate Particle Effect",
            "isEmitting":true,
            "lifespan":"0.2",
            "lifetime" : 0.5,
            "maxParticles":"500",
            "textures":"http://hifi-content.s3.amazonaws.com/alan/dev/Particles/Bokeh-Particle.png",
            "emitRate":"145",
            "emitSpeed": 0.05,
            "emitDimensions":{"x":"0.1","y":".1","z":".1"},
            "emitOrientation":{"x":"-90","y":"0","z":"0"},
            "emitterShouldTrail":false,
            "particleRadius":"0.02",
            "radiusSpread":"0.03",
            "radiusStart":"0.01",
            "radiusFinish":"0",
            "color":{"red":"171","blue":"171","green":"171"},
            "colorSpread":{"red":"0","blue":"0","green":"0"},
            "colorStart":{"red":"255","blue":"255","green":"255"},
            "colorFinish":{"red":"255","blue":"255","green":"255"},
            "emitAcceleration":{"x":"-0.0","y":"2.5","z":"-0.1"},
            "accelerationSpread":{"x":"0.5","y":"3","z":"0.5"},
            "alpha":"1",
            "alphaSpread":"0",
            "alphaStart":"1",
            "alphaFinish":"1",
            "polarStart":"0",
            "polarFinish":"0.296706",
            "azimuthStart":"-3.14159",
            "azimuthFinish":"3.14159"
        }, true);
        Entities.editEntity(_entityID, {visible: false, collidesWith: "", collisionless: true});
        Script.setTimeout(function() {
            Entities.deleteEntity(splat);
            Entities.deleteEntity(_entityID);
        }, EMIT_TIME); 
    };

    function makeFragile(){
        Entities.editEntity(_entityID, {
            collidesWith: "static,dynamic,kinematic,"
        });
        canBreak = true;
    }
  
    PlatePiece.prototype = {
        preload: function(entityID) {
            _entityID = entityID;
        },
        startNearGrab: function() {
            makeFragile();
        },
        mousePressOnEntity: function() {
            makeFragile();
        },
        collisionWithEntity : function(myID, theirID, collision) {
            if (canBreak) {
                var properties = Entities.getEntityProperties(myID, ['velocity', 'position']);
                var velocity = properties.velocity;
                var position = properties.position;
                if (shouldBreak(velocity)) {
                    if (breakSound.downloaded) {
                        Audio.playSound(breakSound, {
                            volume: volumeLevel,
                            position: position
                        });
                    }
                    createParticles(position);
                    canBreak = false;
                }
            }
           
        }
    };
  
    return new PlatePiece();

});
