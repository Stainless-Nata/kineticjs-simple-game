/**
 * @name: memory card
 * @author: Denis Baskovsky
 * @date: 09.02.2014
 */

define(
    'lvlGame',
    ['game'],
    function(game) {
        "use strict";

        game.init = null;// прототип инициализатора
        var timer = null;// интервал таймера
        var cardSize = { w: 110, h: 110 };
        var gameObj = {};

        // загрузка игровых объектов
        function initGameObj() {
            gameObj.layerBackground = null;
            gameObj.layerGame = null;
            gameObj.startTimer = 30.0 ; // время для игры
        }

        // перезагрузка игровых объектов
        function resetGameObj() {
            updateGameTimerText("Let's go!", 'white');
            gameObj.layerGame.removeChildren();

            gameObj.cardAnimationsName = ['type1', 'type2', 'type3', 'type4', 'type5'];
            gameObj.timer = 0.0;        // текущее значение интервала
            gameObj.tempTypes = [];     // временные типы карт
            gameObj.tempSprites = [];   // временные сохраненные карты
            gameObj.cards = [];         // карты на уровне
            gameObj.cardGroup = null;   // группа карт
            gameObj.cardAnimations = {  // анимации карт
                //      x,      y,      width,         height (1 frame)
                idle:   [ 0,    0,      cardSize.w,    cardSize.h ],
                type1:  [ 110,  0,      cardSize.w,    cardSize.h ],
                type2:  [ 220,  0,      cardSize.w,    cardSize.h ],
                type3:  [ 0,    110,    cardSize.w,    cardSize.h ],
                type4:  [ 110,  110,    cardSize.w,    cardSize.h ],
                type5:  [ 220,  110,    cardSize.w,    cardSize.h ]
            };
            gameObj.gameTime = 0.0;     //время игры

        }

        // события мыши
        function mouseOver() {
            // защита от дурака
            if(!gameObj.timer) return;

            if(document.body.style.cursor !== 'pointer') {
                document.body.style.cursor = 'pointer';
            }
        }
        function mouseOut() {
            if(document.body.style.cursor !== 'default') {
                document.body.style.cursor = 'default';
           }
        }

        // упаковочные ресурсы игры
        var sources = {
            background: 'resource/backgrounds/background.png',
            card: 'resource/sprites/cards.png'
        };

        // ассинхронная установка картинок из упаковочных ресурсов игры
        function loadImages(sources, callback) {
            var images = {},
                loadedImages = 0,
                numImages = 0,
                src = null;

            for(src in sources) {
                numImages++;
            }
            for(src in sources) {
                images[src] = new Image();
                images[src].onload = function() {
                    if(++loadedImages >= numImages) {
                        callback(images);
                    }
                };
                images[src].src = sources[src];
            }
        }

        // прототип инициализации. содержит внутриигровые объекты
        function Init() {
            gameObj.layerBackground = new Kinetic.Layer();
            gameObj.layerGame = new Kinetic.Layer();
        }
        Init.prototype.background = function(image) {
            var backImage = new Kinetic.Image({
                image: image,
                width: game.stage.getWidth(),
                height: game.stage.getHeight()
            });
            gameObj.layerBackground.add(backImage);

            return this;
        };
        Init.prototype.cards = function(img) {
            gameObj.cardGroup = new Kinetic.Group({});

            var i = gameObj.cardAnimationsName.length,
                j,
                tempElem = [],
                paddingLeft = 10,
                paddingTop = 10,
                left = 20,
                top = 20,
                tempAnimName = gameObj.cardAnimationsName;

            while(i--) {
                // выбор случайных карт
                var randElem = tempAnimName.splice(Math.floor(Math.random() * (i + 1)), 1)[0];

                // сразу вставляем по две карты
                tempElem.push(randElem);
                tempElem.push(randElem);
            }

            // псевдо-случайная сортировка карт по уровню
            tempElem.sort(function() {
                return parseInt( Math.random() * 10 ) % 2;
            });

            // распологаем карты в два ряда по пять карт
            for(i = 0; i < 2; i++) {
                for(j = 0; j < 5; j++) {
                    // очистка первой временной карты
                    var cardType = tempElem.pop();

                    if(cardType) {
                        gameObj.cards.push(
                            new card(
                                cardType,
                                img,
                                left + j * (cardSize.w + paddingLeft),
                                top + i * (cardSize.h + paddingTop)
                            )
                        );
                    }
                }
            }

            return this;
        };
        Init.prototype.text = function(text) {
            // создание текстового элемента
            var textTimer = new Kinetic.Text({
                x: 0,
                y: game.stage.getHeight() - 64, //специально для двух строк (30*2 и расстояние)
                width: game.stage.getWidth() - 10,
                text: text || '',
                fontFamily: 'Prosto One',
                fontSize: 30,
                fill: 'white',
                shadowColor: "black",
                shadowOpacity: .8,
                shadowBlur: 8,
                align: 'right',
                listening: false,
                id: 'textTimer'
            });

            // установка текста на игровой слой
            gameObj.layerBackground.add(textTimer);

            return this;
        };

        // обновление текста таймера
        function updateGameTimerText(text, color) {
            var timeElem = game.stage.get('#textTimer')[0];
            if(text) {
                timeElem.setText(text);
            }
            if(color) {
                timeElem.setFill(color);
            }

            // быстрая перерисовка сцены
            game.stage.batchDraw();
        }

        // таймер игры
        function gameTimer() {
            var timerValue = --gameObj.timer;
            updateGameTimerText('TIME:' + timerValue);

            gameObj.gameTime = gameObj.startTimer - timerValue;

            // когда таймер завершается - гамовер
            if(gameObj.timer === 0) {
                gameOver();
            }
        }

        // название карты, картинка, координаты
        var card = function(type, img, x, y) {
            var _this = this; //ссылка на текущий объект
            this.type = type; //уникальный тип карты
            this.show = false; //флаг что карта открыта

            // спрайт карты
            var cardSprite = new Kinetic.Sprite({
                x: x || 0,
                y: y || 0,
                image: img,
                animations: gameObj.cardAnimations,
                animation: 'idle',
                index: 0,
                frameRate: 0
            });

            // запил внутрь спрайта прямоугольник
            cardSprite.rectBackground = new Kinetic.Rect({
                x: x,
                y: y,
                width: cardSize.w + 2,
                height:cardSize.h + 2,
                fill: 'skyblue',
                opacity: 1,
//                kinetic bug: Можно использовать либо stroke, либо shadow
//                stroke: 'black',
//                strokeWidth: 1,
                shadowColor: 'black',
                shadowBlur: '12',
                shadowOpacity:1,
                listening: false
            });

            // событие клика внутри по текущей карте
            function cardClick() {
                // защита от дурака
                if(!gameObj.timer) return;

                if(cardSprite.getAnimation() === 'idle') {
                    cardSprite.setAnimation(_this.type);
                    cardSprite.rectBackground.setFill('white');

                    // контейнеры для карт (используются как сохранение состояний уже выбранных карт)
                    gameObj.tempSprites.push(cardSprite);
                    gameObj.tempTypes.push(_this.type);

                    // если выбраны две карты
                    if(gameObj.tempTypes.length == 2) {
                        var isSame = gameObj.tempTypes.every(function(value) {
                            return value === _this.type ? true : false;
                        });

                        // если две карты одинаковые
                        if(isSame) {
                            gameObj.tempSprites.forEach(function(value){
                                value.showed = true;
                            });
                            gameObj.cards.length -= 2;

                            // если карт не осталось - уровень пройден
                            if(gameObj.cards.length === 0) {
                                gameWin();
                            }
                        } else {
                            // иначе поворачиваем карты обратно
                            gameObj.tempSprites.forEach(function(value) {
                                if(!value.showed) {
                                    setTimeout(function() {
                                        value.setAnimation('idle');
                                        value.rectBackground.setFill('skyblue');
                                    },500);
                                }
                            });
                        }

                        // очистка контейнеров объектов карт и их типов
                        gameObj.tempSprites.length = 0;
                        gameObj.tempTypes.length = 0;
                    }

                    // перерисовка состояния уровня
                    gameObj.layerGame.batchDraw();
                }
            }

            // привязка событий
            cardSprite.on('mouseover', mouseOver);
            cardSprite.on('mouseout', mouseOut);
            cardSprite.on('click', cardClick);

            // формирование группы из карт
            gameObj.cardGroup.add(cardSprite);
            gameObj.layerGame.add(cardSprite.rectBackground)
            // установка карты на игровой слой
            gameObj.layerGame.add(cardSprite);
            // z-index надо вызывать после объекта установки на слой
            cardSprite.rectBackground.setZIndex(0);
            cardSprite.setZIndex(1);
        };

        //проигрыш
        function gameOver() {
            clearInterval(timer);

            updateGameTimerText(
                "Game Over!" +
                "\nPress enter key to restart game",
                'red'
            );
            removeCards();
        }

        // выигрыш
        function gameWin() {
            clearInterval(timer);

            updateGameTimerText(
                "CONGRATULATIONS!" +
                "\nYour time:\t" + gameObj.gameTime,
                'gold'
            );
        }

        // удаление всех карт с уровня
        function removeCards() {
            if(gameObj.cardGroup.hasChildren()) {
                //delete rectangles
                gameObj.cardGroup.children.filter(function(elem) {
                    return elem.rectBackground
                }).forEach(function(elem) {
                    elem.rectBackground.destroy();
                });
                //delete sprites
                gameObj.cardGroup.children.destroy();
            }
        }

        // обертка для вызова через require.js
        return {
            // функция инициализации игрового мира
            initialize : function() {
                initGameObj();

                // загрузка ресурсов
                // инициализация полустатических объектов
                loadImages(sources, function(sources) {
                    game.init = new Init()
                        .background(sources.background)
                        .text('Press Enter to start the game');

                    // формирование заднего слоя
                    game.stage.add(gameObj.layerBackground);
                });
            },
            play: function() {
                if(!gameObj.timer) {
                    resetGameObj();

                    // загрузка ресурсов
                    // и последующая за ним функция инициализаций уровня
                    loadImages(sources, function(sources) {
                        // инициализация игровых объектов
                        game.init.cards(sources.card);
                        // формирование игрового слоя
                        game.stage.add(gameObj.layerGame);
                        // обновляем значение интервала
                        gameObj.timer = gameObj.startTimer;
                        // перезапуск таймера
                        clearInterval(timer);
                        timer = setInterval(gameTimer, 1000);
                    });
                }
            }
        };
    }
);