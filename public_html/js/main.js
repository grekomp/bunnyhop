enchant();

window.onload = function() {

	// Calculates how far up will the player go, based on initial speed per frame,
	// and speed change per frame.
	function getJumpHeight(initialSpeed, gravity) {
		if(gravity <= 0) return 0;

		var n = initialSpeed / gravity;

		return initialSpeed * n / 2;
	}
	
	// Controls
	var left = false;
	var right = false;

	// Player
	var PLAYER_W = 64;
	var PLAYER_H = 100;
	var PLAYER_IMG = "img/bunny.png";

	var Player = Class.create(Sprite, {
		initialize: function(x, y) {
			// Creating a sprite
			Sprite.call(this, PLAYER_W, PLAYER_H);

			this.image = game.assets[PLAYER_IMG];

			this.x = x; // screen x position
			this.y = y; // screen y position

			this.absY = y; // world y position

			this.jumpSpeedInitial = 20;
			this.gravity = 0.76; // How much will the y speed decrease per frame

			this.moveX = 0; // Current x movement
			this.moveY = 2; // Current y movement
			this.speedChangeX = 1.2;
			this.maxSpeedX = 16;
		},

		onenterframe: function() {
			// Horizontal movement
			if((!left && !right) || (left && right)) {
				if(this.moveX < -this.speedChangeX) {
					this.moveX += this.speedChangeX;
				}else if(this.moveX > this.speedChangeX) {
					this.moveX -= this.speedChangeX;
				}else{
					this.moveX = 0;
				}
			}else if(left) {
				this.moveX -= this.speedChangeX;
				
				if(this.moveX < -this.maxSpeedX) {
					this.moveX = -this.maxSpeedX;
				}
			}else {
				this.moveX += this.speedChangeX;
				
				if(this.moveX > this.maxSpeedX) {
					this.moveX = this.maxSpeedX;
				}
			}
			
			this.x += this.moveX;
			
			if(this.x < 0){
				this.x = 0;
				this.moveX = 0;
			}
			if(this.x > gameWidth - PLAYER_W){
				this.x = gameWidth - PLAYER_W;
				this.moveX = 0;
			}
			
			// Vertical movement
			this.moveY = this.moveY - this.gravity;
			this.absY = this.absY - this.moveY;
			this.y = this.absY - sceneOffset;
		}
	});
	
	// Platforms
	var PLATFORM_W = 80;
	var PLATFORM_H = 27;
	var PLATFORM_IMG = "img/platform.png";
	var platforms = [];
	
	var Platform = Class.create(Sprite, {
		initialize: function(x, y) {
			// Creating a sprite
			Sprite.call(this, PLATFORM_W, PLATFORM_H);

			this.image = game.assets[PLATFORM_IMG];

			this.x = x; // screen x position
			this.y = y; // screen y position

			this.absY = y; // world y position
		},
		
		onenterframe: function() {
			this.y = this.absY - sceneOffset;
		}
	});
	
	var MovingPlatform = Class.create(Sprite, {
		initialize: function(x, y) {
			// Creating a sprite
			Sprite.call(this, PLATFORM_W, PLATFORM_H);

			this.image = game.assets[PLATFORM_IMG];

			this.x = x; // screen x position
			this.y = y; // screen y position

			this.absY = y; // world y position
			this.speed = 4;
			this.direction = 1;
			this.rangeMin = 0;
			this.rangeMax = 200;
		},
		
		onenterframe: function() {
			this.y = this.absY - sceneOffset;
			
			this.x = this.x + this.speed * this.direction;
			if(this.x < this.rangeMin) {
				this.x = this.rangeMin;
				this.direction *= -1;
			}
			
			if(this.x > this.rangeMax) {
				this.x = this.rangeMax;
				this.direction *= -1;
			}
		}
	});
	
	var platformTypes = [Platform, MovingPlatform];
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	var gameWidth = 640;
	var gameHeight = 960;
	
	var jumpHeight = 200;
	
	// Scene
	var sceneOffset = 0;
	var newSceneOffset = 0;
	var sceneTransitionModifier = 1;
    var game = new Game(gameWidth, gameHeight);
	game.scale = 1;
	game.fps = 60;
	game.preload(PLATFORM_IMG, PLAYER_IMG);
	
    game.onload = function() { 
		function addNewPlatform(x, y, type) {
			
			if(typeof x === "undefined" && typeof y === "undefined") {
				x = getRandomInt(10, gameWidth - PLATFORM_W - 10);
				y = -PLATFORM_H;
				absY = sceneOffset - PLATFORM_H;
				console.log(absY);
			}else{
				absY = sceneOffset + y;
			}
			
			if(typeof type !== "undefined") {
				var platform = new Platform(x, y);
			}else{
				var platform = new Platform(x, y);
			}
			
			platform.absY = absY;
			
			platforms.push(platform);
			mainGroup.addChild(platform);
		};
		
		var player;
		var scoreText;
		var mainScene = new Scene();
		var mainGroup = new Group();
		var gameoverScene = new Scene();
		
		function setup(){
			// Setup player
			player = new Player(200, 640);

			// Setup score text
			scoreText = new Label("Score: 0");
			scoreText.x = 10; 
			scoreText.y = 10; 
			scoreText.font = "36px LuckiestGuy";

			// Setup platforms

			addNewPlatform(0, 800);
			addNewPlatform(PLATFORM_W, 800);
			addNewPlatform(PLATFORM_W*2, 800);
			addNewPlatform(PLATFORM_W*3, 800);
			addNewPlatform(PLATFORM_W*4, 800);
			
			addNewPlatform((gameWidth-PLATFORM_W)/2, 600);
			addNewPlatform((gameWidth-PLATFORM_W)/2, 400);
			addNewPlatform((gameWidth-PLATFORM_W)/2, 200);
			addNewPlatform((gameWidth-PLATFORM_W)/2, 10);

			mainScene.addChild(mainGroup);
			mainScene.addChild(player);
			mainScene.addChild(scoreText);

			mainScene.backgroundColor = 'white';

			game.pushScene(mainScene);
		}
		
		function cleanup() {
			mainscene.removeChild(mainGroup);
			mainscene.removeChild(player);
			mainscene.removeChild(scoreText);
		}
		
		setup();
		
		// Add controls
		game.addEventListener(enchant.Event.LEFT_BUTTON_DOWN, function(){
			left = true;
		});
		
		game.addEventListener(enchant.Event.LEFT_BUTTON_UP, function(){
			left = false;
		});
		
		game.addEventListener(enchant.Event.RIGHT_BUTTON_DOWN, function(){
			right = true;
		});
		
		game.addEventListener(enchant.Event.RIGHT_BUTTON_UP, function(){
			right = false;
		});
		
		
		game.addEventListener("enterframe", function(){
			// Update the score
			scoreText.text = "Score: " + Math.floor(-sceneOffset);
			
			// Move platforms
			platforms.forEach(function(platform, index) {
				
				if(platform.y >= game.height) { 
					mainGroup.removeChild(platforms[index]);
					platforms.splice(index, 1);
				};
				
				if(player.moveY <= 0) {
					if(player.y + PLAYER_H <= platform.y - player.moveY - 2 && player.y + PLAYER_H >= platform.y + player.moveY + 2) 
						if(player.x >= platform.x - PLAYER_W && player.x <= platform.x + PLATFORM_W) {
							player.moveY = player.jumpSpeedInitial;
						}
				}
			});
			
			// Adding new platforms
			if(platforms[platforms.length - 1].y >= jumpHeight - PLATFORM_H) {
				addNewPlatform();
			}
			
			// Moving Scene smoothly
			if(player.absY - newSceneOffset <= 300) newSceneOffset -= 300 - player.y;
			
			sceneOffset = sceneOffset * (1-sceneTransitionModifier) + newSceneOffset * sceneTransitionModifier;
			
			// Ending game
			
			
		});
		
    };
	
	
    game.start(); //Begin the game
};