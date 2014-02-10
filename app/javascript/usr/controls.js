/**
 * @name: Key handler
 */
define(
    'controls',
    ['lvlGame'],
    function(lvlGame) {
        "use strict";

        return {
            keyDown : function(event) {
                var keyCode = event.keyCode;

                switch (keyCode) {
                    //enter, space or P-key
                    case 13 :
                    case 32 :
                    case 80 : {
                        //запуск игры
                        lvlGame.play();
                        break;
                    }

                    default: break;
                }
            },
			click : function(event) {
				lvlGame.play();
			}
        };
    }
);