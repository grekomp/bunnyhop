enchant();

window.onload = function() {

	// Misc
	function getJumpHeight(initialSpeed, gravity) {
		if(gravity <= 0) return 0;

		var n = initialSpeed / gravity;

		return initialSpeed * n / 2;
	}
	
	function collidesFromTop(topSprite, bottomSprite, margin){
		if(topSprite.y + topSprite.height <= bottomSprite.y + margin && topSprite.y + topSprite.height >= bottomSprite.y - margin) 
			if(topSprite.x >= bottomSprite.x - topSprite.width && topSprite.x <= bottomSprite.x + bottomSprite.width) {
				return true;
			}
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

			this.jumpSpeedInitial = 19;
			this.gravity = 0.7; // How much will the y speed decrease per frame

			this.moveX = 0; // Current x movement
			this.moveY = 2; // Current y movement
			this.speedChangeX = 1.2;
			this.maxSpeedX = 16;
			
			this.jumpHeight = getJumpHeight(this.jumpSpeedInitial, this.gravity);
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
			if(this.x > GAME_W - PLAYER_W){
				this.x = GAME_W - PLAYER_W;
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
	var PLATFORM_BOUNCY_IMG = "img/platform-bouncy.png";
	var platforms = []; // Stores all spawned platforms
	
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
		},
		
		collided: function(player) {
			
		}
		
	});
	
	var MovingPlatform = Class.create(Platform, {
		initialize: function(x, y) {
			// Creating a sprite
			Platform.call(this, x, y);

			this.image = game.assets[PLATFORM_IMG];
			if(x > game.width - PLATFORM_W - 210) x = game.width - PLATFORM_W - 210;
			
			this.x = x; // screen x position
			this.y = y; // screen y position
			
			this.absY = y; // world y position
			this.speed = 2;
			this.direction = 1;
			this.rangeMin = x;
			this.rangeMax = x + 200;
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
	
	var BouncyPlatform = Class.create(Platform, {
		initialize: function(x, y) {
			// Creating a sprite
			Platform.call(this, x, y);

			this.image = game.assets[PLATFORM_BOUNCY_IMG];

			this.x = x; // screen x position
			this.y = y; // screen y position
			
			this.absY = y; // world y position
			
			this.bounce = 32;
		},
		
		onenterframe: function() {
			this.y = this.absY - sceneOffset;
		},
		
		collided: function(player) {
			player.moveY = this.bounce;
		}
	});
	
	var platformTypes = [Platform, MovingPlatform, BouncyPlatform];
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	// Config
	var GAME_W = 640;
	var GAME_H = 960;
	var gameRunning = true;
	
	// Clouds
	var CLOUD_IMG = "img/cloud.png";
	var CLOUD_W = 100;
	var CLOUD_H = 64;
	
	var Cloud = Class.create(Sprite, {
		initialize: function(x, y) {
			// Creating a sprite
			Sprite.call(this, CLOUD_W, CLOUD_H);

			this.image = game.assets[CLOUD_IMG];

			this.x = x; // screen x position
			this.y = y; // screen y position

			this.absY = y; // world y position
			
			this.speed = 2;
			this.direction = 1;
		},
		
		onenterframe: function() {
			this.x += this.speed * this.direction;
			this.y = this.absY - sceneOffset;
		}
	});
	
	// Scene
	var SCENE_BG = "img/bg.png";
	
	var RELOAD_IMG = "img/reload.png";
	
	var sceneOffset = 0;
	var newSceneOffset = 0;
	var sceneTransitionModifier = 1;
    var game = new Game(GAME_W, GAME_H);
	game.scale = 1;
	game.fps = 60;
	game.preload(PLATFORM_IMG, PLATFORM_BOUNCY_IMG, PLAYER_IMG, SCENE_BG, CLOUD_IMG, RELOAD_IMG);
	
    game.onload = function() { 
		function addNewPlatform(x, y, type) {
			
			if(typeof x === "undefined" && typeof y === "undefined") {
				x = getRandomInt(10, GAME_W - PLATFORM_W - 10);
				y = -PLATFORM_H;
				absY = sceneOffset - PLATFORM_H;
			}else{
				absY = sceneOffset + y;
			}
			
			if(typeof type !== "undefined") {
				var platform = new platformTypes[type](x, y);
			}else{
				var platform = new platformTypes[Math.floor(Math.random()*platformTypes.length)](x, y);
			}
			
			platform.absY = absY;
			
			platforms.push(platform);
			mainGroup.addChild(platform);
		};
		
		var player;
		var scoreText;
		var mainScene = new Scene();
		var gameoverScene = new Scene();
		var mainGroup = new Group();
		
		// Background objects
		var bgGroupHolder = new Group();
		var bgGroup = new Group();
		
		// Add background
		var background = new Sprite(game.width, game.height);
		background.image = game.assets[SCENE_BG];
		background.x = 0;
		background.y = 0;
		
		bgGroup.addChild(background);
		
		// Setup the game
		function setup(){
			// Setup player
			player = new Player((game.width - PLAYER_W)/2, 640);

			// Setup score text
			scoreText = new Label("Score: 0");
			scoreText.x = 10; 
			scoreText.y = 10; 
			scoreText.font = "36px LuckiestGuy";
			scoreText.color = "white";
			
			// Setup platforms

			addNewPlatform(0, 800, 0);
			addNewPlatform(PLATFORM_W, 800, 0);
			addNewPlatform(PLATFORM_W*2, 800, 0);
			addNewPlatform(PLATFORM_W*3, 800, 0);
			addNewPlatform(PLATFORM_W*4, 800, 0);
			addNewPlatform(PLATFORM_W*5, 800, 0);
			addNewPlatform(PLATFORM_W*6, 800, 0);
			addNewPlatform(PLATFORM_W*7, 800, 0);
			
			addNewPlatform((GAME_W-PLATFORM_W)/2, 600, 0);
			addNewPlatform((GAME_W-PLATFORM_W)/2, 400, 0);
			addNewPlatform((GAME_W-PLATFORM_W)/2, 200, 0);
			addNewPlatform((GAME_W-PLATFORM_W)/2, 10, 0);
			
			mainScene.addChild(bgGroup);
			mainScene.addChild(mainGroup);
			mainScene.addChild(player);
			mainScene.addChild(scoreText);

			game.pushScene(mainScene);
		}
		
		{
			var gameoverBg = new Sprite(game.width, game.height);
			gameoverBg.image = game.assets[SCENE_BG];
			gameoverBg.x = 0;
			gameoverBg.y = 0;
			
			gameoverScene.addChild(gameoverBg);
			
			// Setup gameOver Scene
			var gameoverText = new Label("Game Over");
			gameoverText.x = 0;
			gameoverText.y = 300;
			gameoverText.width = game.width;
			gameoverText.font = "72px LuckiestGuy";
			gameoverText.textAlign = "center";
			gameoverText.color = "white";

			gameoverScene.addChild(gameoverText);
			
			var reloadButton = new Sprite(128, 128);
			reloadButton.image = game.assets[RELOAD_IMG];
			reloadButton.x = (game.width-128) / 2;
			reloadButton.y = 560;
			reloadButton.addEventListener(enchant.Event.TOUCH_END, function(){
				cleanup();
			});
			
			gameoverScene.addChild(reloadButton);
			
			var gameoverScore = new Label("Score: 0");
			gameoverScore.x = 0;
			gameoverScore.y = 400;
			gameoverScore.width = game.width;
			gameoverScore.font = "36px LuckiestGuy";
			gameoverScore.textAlign = "center";
			gameoverScore.color = "white";
			
			gameoverScene.addChild(gameoverScore);
		}
		
		setup();
		
		function gameover() {
			game.popScene();
			
			gameRunning = false;

			gameoverScore.text = "Score: " + Math.floor(Math.abs(sceneOffset));
			
			game.pushScene(gameoverScene);
		}
		
		//game.pushScene(gameoverScene);
		
		function cleanup() {
			platforms.forEach(function(platform, index){
				mainGroup.removeChild(platforms[index]);
			});
			platforms = [];
			console.log("Cleaning");
			
			mainScene.removeChild(mainGroup);
			mainScene.removeChild(player);
			mainScene.removeChild(scoreText);
			
			sceneOffset = 0;
			newSceneOffset = 0;
			
			game.popScene();
			
			setup();
			gameRunning = true;
		}
		
		
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
			if(gameRunning) {

				// Update the score
				scoreText.text = "Score: " + Math.floor(-sceneOffset);

				// Move platforms
				platforms.forEach(function(platform, index) {

					if(platform.y >= game.height) { 
						mainGroup.removeChild(platforms[index]);
						platforms.splice(index, 1);
					};

					if(player.moveY <= 0 && collidesFromTop(player, platform, Math.abs(player.moveY) + 1)) {
						player.moveY = player.jumpSpeedInitial;
						platform.collided(player);
					}
				});

				// Adding new platforms
				if(platforms[platforms.length - 1].y >= player.jumpHeight - 50 - PLATFORM_H) {
					addNewPlatform();
				}

				// Moving Scene smoothly
				if(player.absY - newSceneOffset <= 300) newSceneOffset -= 300 - player.y;

				sceneOffset = sceneOffset * (1-sceneTransitionModifier) + newSceneOffset * sceneTransitionModifier;

				// Ending game
				if(player.y > game.height) {
					console.log("Game Over!");
					gameover();
				}

			}
		});
		
    };
	
	
    game.start(); //Begin the game
};