enchant(); //the magic words that start enchant.js

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.onload = function() {
	
	var gameWidth = 640;
	var gameHeight = 960;
	
	var jumpHeight = 256;
	
	var platformLoc = "img/platform.png";
	var sceneOffset = 0;
	var newSceneOffset = -200;
	var sceneTransitionModifier = 0.1;

	var platformWidth = 128;
	var platformHeight = 32;

	var platforms = [];
	
    var game = new Game(gameWidth, gameHeight);
	game.scale = 1;
	game.fps = 60;
	game.preload(platformLoc, "img/bunny.png");
	
    game.onload = function() { 
		function addNewPlatform() {
			var platform = new Sprite(platformWidth, platformHeight);
			platform.image = game.assets[platformLoc];
			platform.x = getRandomInt(10, gameWidth - platformWidth - 10);
			platform.y = -platformHeight;
			platform.absY = sceneOffset - platformHeight;
			platform.addEventListener("enterframe", function(){
				this.y = this.absY - sceneOffset;
			});

			platforms.push(platform);
			mainGroup.addChild(platform);
		};
		
		var mainScene = new Scene();
		var mainGroup = new Group();
		
		addNewPlatform();
		
		mainScene.backgroundColor = 'white';
		
		mainScene.addChild(mainGroup);

		var scoreText = new Label("Score: 100");
		scoreText.x = 10; 
		scoreText.y = 10; 
		scoreText.font = "36px LuckiestGuy";
		
		mainScene.addChild(scoreText);
		
		game.addEventListener("enterframe", function(){
			platforms.forEach(function(element, index) {
				element.y = element.absY - sceneOffset;
				
				if(element.y >= game.height) platforms.splice(index, 1);
			});
			
			if(platforms[platforms.length - 1].y >= jumpHeight - platformHeight) {
				addNewPlatform();
			}
			
			sceneOffset = sceneOffset * (1-sceneTransitionModifier) + newSceneOffset * sceneTransitionModifier;
			if(sceneOffset <= newSceneOffset + 1) {
				newSceneOffset += -200;
			}
		});
		
		game.pushScene(mainScene);
    };
	
	
    game.start(); //Begin the game
};