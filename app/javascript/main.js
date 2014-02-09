/**
 * @name configuration file
 * @author Denis Baskovsky
 */

require.config({
    baseUrl: './app/javascript/usr',
    removeCombined : true,
    optimize : 'none',

    paths: {
        //cdn or local
        jquery : [
//                  '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
                  '../lib/jquery-2.0.3.min'
                  ],
        //only local
        kinetic : '../lib/kinetic-v5.0.1.min',
        domReady : '../lib/domReady'
    }
});

require([
    'game'
    ,'controls'
    ,'lvlGame'
    ,'jquery'
    ,'kinetic'
    ,'domReady'
        ], function(game, controls, lvlGame, $) {
        "use strict";

        //считывание собыий с клавиатуры или прочих устройств I/O
        var anchor = window.document.getElementById('anchor');
	       	anchor.focus();
	    	anchor.addEventListener('keydown', controls.keyDown);

        //создание canvas контейнера
        game.stage = new Kinetic.Stage({
            container: 'container',
            width: 640,
            height: 360
        });

        //создание игры
        lvlGame.initialize(function() {
            $('#loading-info').remove();
        });
    }
);