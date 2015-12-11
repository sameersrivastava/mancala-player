//Starter code from https://github.com/lostdecade/simple_canvas_game
var mancala = (function($){
	var test_canvas = function(){
		// Create the canvas
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = $('#container').width();
		canvas.height = $('#container').width()/4;
		document.body.appendChild(canvas);
		var radius = canvas.height * 3 / 16;
		drawCups();
		
		function drawCups() {
			var i, j, w_offset,w_increment, h_offset, h_increment;
			w_offset = (canvas.width * 3 / 16);
			w_increment = (canvas.width * 1 / 8);
			h_offset = (canvas.height * 1 / 4);
			h_increment = (canvas.height * 1 / 2);
			ctx.translate(w_offset, h_offset);
			for(i = 0; i < 2; i += 1) {
				for(j=0; j < 6; j += 1) {
					ctx.beginPath();				
					ctx.arc(0,0,radius*0.9,0,2 * Math.PI);
					ctx.strokeStyle = "black";
					ctx.lineWidth = radius * 0.1;
					ctx.stroke();
					ctx.translate(w_increment,0);
				}
				ctx.translate(-6 * w_increment, h_increment);
			}
			ctx.translate(0,-2*h_increment)
		}
		drawMancalas();
		function drawMancalas() {
			//Draw Left Mancala
			ctx.moveTo(0,0);
			ctx.lineTo(300,150);
			ctx.stroke();
			//Draw Right Mancala
		}
		


		// // Background image
		// var bgReady = false;
		// var bgImage = new Image();
		// bgImage.onload = function () {
		// 	bgReady = true;
		// };
		// bgImage.src = "images/background.png";

		// // Hero image
		// var heroReady = false;
		// var heroImage = new Image();
		// heroImage.onload = function () {
		// 	heroReady = true;
		// };
		// heroImage.src = "images/hero.png";

		// // Monster image
		// var monsterReady = false;
		// var monsterImage = new Image();
		// monsterImage.onload = function () {
		// 	monsterReady = true;
		// };
		// monsterImage.src = "images/monster.png";

		// // Game objects
		// var hero = {
		// 	speed: 256 // movement in pixels per second
		// };
		// var monster = {};
		// var monstersCaught = 0;

		// // Handle keyboard controls
		// var keysDown = {};

		// addEventListener("keydown", function (e) {
		// 	keysDown[e.keyCode] = true;
		// }, false);

		// addEventListener("keyup", function (e) {
		// 	delete keysDown[e.keyCode];
		// }, false);

		// // Reset the game when the player catches a monster
		// var reset = function () {
		// 	hero.x = canvas.width / 2;
		// 	hero.y = canvas.height / 2;

		// 	// Throw the monster somewhere on the screen randomly
		// 	monster.x = 32 + (Math.random() * (canvas.width - 64));
		// 	monster.y = 32 + (Math.random() * (canvas.height - 64));
		// };

		// // Update game objects
		// var update = function (modifier) {
		// 	if (38 in keysDown) { // Player holding up
		// 		hero.y -= hero.speed * modifier;
		// 	}
		// 	if (40 in keysDown) { // Player holding down
		// 		hero.y += hero.speed * modifier;
		// 	}
		// 	if (37 in keysDown) { // Player holding left
		// 		hero.x -= hero.speed * modifier;
		// 	}
		// 	if (39 in keysDown) { // Player holding right
		// 		hero.x += hero.speed * modifier;
		// 	}

		// 	// Are they touching?
		// 	if (
		// 		hero.x <= (monster.x + 32)
		// 		&& monster.x <= (hero.x + 32)
		// 		&& hero.y <= (monster.y + 32)
		// 		&& monster.y <= (hero.y + 32)
		// 	) {
		// 		++monstersCaught;
		// 		reset();
		// 	}
		// };

		// // Draw everything
		// var render = function () {
		// 	if (bgReady) {
		// 		ctx.drawImage(bgImage, 0, 0);
		// 	}

		// 	if (heroReady) {
		// 		ctx.drawImage(heroImage, hero.x, hero.y);
		// 	}

		// 	if (monsterReady) {
		// 		ctx.drawImage(monsterImage, monster.x, monster.y);
		// 	}

		// 	// Score
		// 	ctx.fillStyle = "rgb(250, 250, 250)";
		// 	ctx.font = "24px Helvetica";
		// 	ctx.textAlign = "left";
		// 	ctx.textBaseline = "top";
		// 	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
		// };

		// // The main game loop
		// var main = function () {
		// 	var now = Date.now();
		// 	var delta = now - then;

		// 	update(delta / 1000);
		// 	render();

		// 	then = now;

		// 	// Request to do this again ASAP
		// 	requestAnimationFrame(main);
		// };

		// // Cross-browser support for requestAnimationFrame
		// var w = window;
		// requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

		// // Let's play this game!
		// var then = Date.now();
		// reset();
		// main();

	},
	init = function() {
		test_canvas();
	};
	return {
		init: function() {
			return init();
		}
	}
}($));