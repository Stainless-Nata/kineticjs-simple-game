/**
 * @name configuration file
 * @author Denis Baskovsky
 */
require.config({
    baseUrl: './app/javascript/usr',
    removeCombined : true,
    optimize : 'none',
    paths: {
        jquery : [
//                 '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min', // Включите если уверены в CDN
                   '../lib/jquery-2.0.3.min'
                  ],
        kinetic :  '../lib/kinetic-v5.0.1.min',
        domReady : '../lib/domReady.min'
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
        'use strict';

        var $anchor = $('#anchor'),
		 	$container = $('#container'),
            $window = $(window),
            $loading = $('#loading-info');
            
	    $anchor.focus();
		
	    // привязка считывания собыий с клавиатуры или прочих устройств I/O
	    $anchor.on('keydown', controls.keyDown);
	    // привязка считывания клика и тапа 
		$container.on('click touchstart', controls.click);
            
        $window.resize(function (e) {
            //smooth resize
            window.selfResize = window.selfResize || setTimeout(function() {
                updateSize(e);
                clearTimeout(window.selfResize);
                delete window.selfResize;
            }, 500);
        });
            
        // обновляем размер
        // TODO добавить обновление stage 
        function updateSize(e) {
            var $content = $('.kineticjs-content');
            $content.height(e.target.innerHeight);
            $content.width(e.target.innerWidth);
        }
			
        // создание контейнера canvas игры
        // установка ширины и высоты по размеру окна браузера
        game.stage = new Kinetic.Stage({
            container: 'container',
            width: window.innerWidth - 40,//640
            height: window.innerHeight - 40//360
        });
            
        // создание игры
        lvlGame.initialize(function() {
            $loading.remove();
        });
    }
);
