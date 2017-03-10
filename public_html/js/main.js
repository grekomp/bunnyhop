enchant(); //the magic words that start enchant.js

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.onload = function() {
	
	var gameWidth = 640;
	var gameHeight = 960;
	
	var jumpHeight = 200;
	
	var sceneOffset = 0;
	var newSceneOffset = 0;
	var sceneTransitionModifier = 1;

	var platformLoc = "img/platform.png";
	var platformWidth = 128;
	var platformHeight = 32;
	var platforms = [];

	var playerWidth = 96;
	var playerHeight = 128;
	var moveSpeedH = 10;
	
	var playerMoveLeft = false;
	var playerMoveRight = false;
	var playerMoveV = 2.0;
	var jumpV = 10;
	var playerGravity = 0.2;
	
    var game = new Game(gameWidth, gameHeight);
	game.scale = 1;
	game.fps = 60;
	game.preload(platformLoc, "img/bunny.png");
	
    game.onload = function() { 
		function addNewPlatform(x, y) {
			var platform = new Sprite(platformWidth, platformHeight);
			platform.image = game.assets[platformLoc];
			
			if(typeof x !== "undefined" && typeof y !== "undefined") {
				platform.x = x;
				platform.y = y;
				platform.absY = -sceneOffset + y;
			} else {
				platform.x = getRandomInt(10, gameWidth - platformWidth - 10);
				platform.y = -platformHeight;
				platform.absY = sceneOffset - platformHeight;
			}
			platform.addEventListener("enterframe", function(){
				this.y = this.absY - sceneOffset;
			});

			platforms.push(platform);
			mainGroup.addChild(platform);
		};
		
		var mainScene = new Scene();
		var mainGroup = new Group();
		
		var player = new Sprite(playerWidth, playerHeight);
		player.image = game.assets["img/bunny.png"];
		player.x = (gameWidth - playerWidth) / 2;
		player.y = 640;
		player.absY = 640;
		
		var scoreText = new Label("Score: 100");
		scoreText.x = 10; 
		scoreText.y = 10; 
		scoreText.font = "36px LuckiestGuy";
		
		// Setup Scene
		addNewPlatform((gameWidth-platformWidth)/2, 600);
		addNewPlatform((gameWidth-platformWidth)/2, 400);
		addNewPlatform((gameWidth-platformWidth)/2, 200);
		
		addNewPlatform(0, 800);
		addNewPlatform(128, 800);
		addNewPlatform(256, 800);
		addNewPlatform(128*3, 800);
		addNewPlatform(128*4, 800);
		
		
		
		mainScene.addChild(mainGroup);
		mainScene.addChild(player);
		mainScene.addChild(scoreText);
		
		mainScene.backgroundColor = 'white';
		
		game.pushScene(mainScene);
		
		
		game.addEventListener(enchant.Event.LEFT_BUTTON_DOWN, function(){
			playerMoveLeft = true;
		});
		
		game.addEventListener(enchant.Event.LEFT_BUTTON_UP, function(){
			playerMoveLeft = false;
		});
		
		game.addEventListener(enchant.Event.RIGHT_BUTTON_DOWN, function(){
			playerMoveRight = true;
		});
		
		game.addEventListener(enchant.Event.RIGHT_BUTTON_UP, function(){
			playerMoveRight = false;
		});
		
		game.addEventListener("enterframe", function(){
			
			// Controling the player
			if(playerMoveLeft && !playerMoveRight) {
				player.x = player.x - moveSpeedH;
				if(player.x < 0) player.x = 0;
			}
			
			if(!playerMoveLeft && playerMoveRight) {
				player.x = player.x + moveSpeedH;
				if(player.x > gameWidth - playerWidth) player.x = gameWidth - playerWidth;
			}
			
			playerMoveV = playerMoveV - playerGravity;
			player.absY = player.absY - playerMoveV;
			player.y = player.absY - sceneOffset;
			
			// Changing the score
			scoreText.text = "Score: " + Math.floor(-sceneOffset);
			
			// Moving platforms
			platforms.forEach(function(platform, index) {
				platform.y = platform.absY - sceneOffset;
				
				if(platform.y >= game.height) platforms.splice(index, 1);
				
				if(playerMoveV <= 0) {
					if(player.y + playerHeight <= platform.y + 4 && player.y + playerHeight >= platform.y - 4) 
						if(player.x >= platform.x - playerWidth && player.x <= platform.x + platformWidth) {
							playerMoveV = jumpV;
						}
				}
			});
			
			// Adding new platforms
			if(platforms[platforms.length - 1].y >= jumpHeight - platformHeight) {
				addNewPlatform();
			}
			
			// Moving Scene smoothly
			if(player.absY - newSceneOffset <= 300) newSceneOffset -= 300 - player.y;
			
			sceneOffset = sceneOffset * (1-sceneTransitionModifier) + newSceneOffset * sceneTransitionModifier;
		});
		
    };
	
	
    game.start(); //Begin the game
};