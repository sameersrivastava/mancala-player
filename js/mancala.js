var mancala = (function($){
	"use strict";
	var mancala_window = function(){
		// Create the canvas
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");
		//Appened canvas to body
		canvas.width = $('#container').width();
		canvas.height = $('#container').width()/4;
		$('#container').append(canvas);
		//Set drawing units and players
		var canvas_unit = canvas.height / 2,
			cup_radius = canvas_unit * 3 / 8,
			game = new mancala_board(),
			p1 = new player(1,0,0), //Num, Kind, Ply
			p2 = new player(2,1,0),
			turn = p1,
			wait = p2,
			p1_draw_cups = new Array(),
			p2_draw_cups = new Array(),
			p1_draw_mancala,
			p2_draw_mancala;

		//makeBoard data objects
		makeBoard();
		function makeBoard() {
			var i, j, w_offset,w_increment, h_offset, h_increment;
			w_offset = (canvas_unit * 3 / 2);
			w_increment = canvas_unit;
			h_offset = (canvas_unit / 2);
			h_increment = canvas_unit;
			//P2 Cups Top
			for(i=0; i < 6; i += 1) { 
				p2_draw_cups[i] = {
					x: w_offset + i * w_increment,h_offset,
					y: h_offset,
					radius: cup_radius,
					rr: cup_radius * cup_radius,
					line_color: "#000000", //black
					background_color: "#000000",
					hover_color: "#29B962",
					is_hovering: false
				}
			}
			//P1 Cups Bottom
			for(i=0; i < 6; i += 1) { 
				p1_draw_cups[i] = {
					x: w_offset + i * w_increment,h_offset,
					y: h_offset + h_increment,
					radius: cup_radius,
					rr: cup_radius * cup_radius,
					line_color: "#000000", //black
					background_color: "#000000",
					hover_color: "#29B962",
					is_hovering: false
				}
			}
			//P2 Mancala
			p2_draw_mancala = {
				x: canvas_unit / 2,
				y: canvas_unit,
				radius: cup_radius,
				points: [
					{x: canvas_unit / 2, y: canvas_unit / 2},
					{x: canvas_unit / 2 + cup_radius, y: canvas_unit * 3 / 2},
					{x: canvas_unit / 2, y: canvas_unit * 3 / 2},
					{x: canvas_unit / 8, y: canvas_unit / 2}
				]
			}
			//P1 Mancala
			p1_draw_mancala = {
				x: canvas_unit * 15 / 2,
				y: canvas_unit,
				radius: cup_radius,
				points: [
					{x: canvas_unit * 15 / 2, y: canvas_unit / 2},
					{x: canvas_unit * 15 / 2 + cup_radius, y: canvas_unit * 3 / 2},
					{x: canvas_unit * 15 / 2, y: canvas_unit * 3 / 2},
					{x: canvas_unit * 57 / 8, y: canvas_unit / 2}
				]
			}
			//draw the Board
			drawBoard();
			//Make Status
			$('#container').append('<div id="game-status"></div>');
			//Make the new game button
			$('#container').append('<button id="game-button" type="button">Start New Game</button>');
			$('#game-button').click(function() {
				new_game();
			});


		}
		function drawBoard() {
			var i, cup;
			//Draw cups
			for(i = 0; i < 6; i += 1){
				//Draw P1 Cups
				cup = p1_draw_cups[i];
				ctx.beginPath();				
				ctx.arc(cup.x,cup.y,cup.radius*0.9,0,2 * Math.PI);
				ctx.strokeStyle = "black";
				ctx.lineWidth = cup.radius * 0.1;
				ctx.stroke();
				//Draw P2 cups
				cup = p2_draw_cups[i];
				ctx.beginPath();				
				ctx.arc(cup.x,cup.y,cup.radius*0.9,0,2 * Math.PI);
				ctx.strokeStyle = "black";
				ctx.lineWidth = cup.radius * 0.1;
				ctx.stroke();	
			}
			//Draw P2 Mancala
			ctx.beginPath();
			ctx.arc(
				p2_draw_mancala.points[0].x,
				p2_draw_mancala.points[0].y,
				p2_draw_mancala.radius,
				Math.PI,
				2*Math.PI
			);
			ctx.lineTo(
				p2_draw_mancala.points[1].x,
				p2_draw_mancala.points[1].y
			);
			ctx.arc(
				p2_draw_mancala.points[2].x,
				p2_draw_mancala.points[2].y,
				p2_draw_mancala.radius,
				0,
				Math.PI
			);
			ctx.lineTo(
				p2_draw_mancala.points[3].x,
				p2_draw_mancala.points[3].y
			);
			ctx.strokeStyle = "black";
			ctx.lineWidth = cup.radius * 0.1;
			ctx.stroke();

			//P1 Mancala
			ctx.beginPath();
			ctx.arc(
				p1_draw_mancala.points[0].x,
				p1_draw_mancala.points[0].y,
				p2_draw_mancala.radius,
				Math.PI,
				2*Math.PI
			);
			ctx.lineTo(
				p1_draw_mancala.points[1].x,
				p1_draw_mancala.points[1].y
			);
			ctx.arc(
				p1_draw_mancala.points[2].x,
				p1_draw_mancala.points[2].y,
				p2_draw_mancala.radius,
				0,
				Math.PI
			);
			ctx.lineTo(
				p1_draw_mancala.points[3].x,
				p1_draw_mancala.points[3].y
			);
			ctx.strokeStyle = "black";
			ctx.lineWidth = cup.radius * 0.1;
			ctx.stroke();
		}
		function new_game() {
			game.reset_board();
			turn = p1;
			wait = p2;
			//Set status

			resetStones();
			continueGame();
		}
		function continueGame() {
			if (game.game_over()) {
				if (game.hasWon(p1.num)) {
					$('#game-status').text('Player 1 Won');
				} else if (game.hasWon(p2.num)) {
					$('#game-status').text('Player 2 Won');
				} else {
					$('#game-status').text('Tie Game');
				}
				return;
			}
			if (turn.kind == 0) { //fix this to player
				enable_board();
			} else {
				var move = turn.chooseMove(game),
					playAgain = game.makeMove(turn, move);
				if (!playAgain){
					swap_turns();
				}
				resetStones();
				continueGame();
			}
		}
		function swap_turns(){
			var temp = turn;
			turn = wait;
			wait = temp;
			//MORE STATUS STUFF 
		}
		function resetStones(){
			//Put top stones on
			ctx.font = 'normal ' + canvas_unit / 4 + 'px sans-serif';
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			for(var i = 0; i < game.P2Cups.length; i += 1){
				var index = (game.P2Cups.length - i) - 1;
				clearCup(p2_draw_cups[index]);
				//put numbers in the stones
				ctx.fillText(game.P2Cups[i],p2_draw_cups[index].x, p2_draw_cups[index].y);
				//throw new Error("Something went badly wrong!");
				clearCup(p1_draw_cups[i]);
				ctx.fillText(game.P1Cups[i],p1_draw_cups[i].x, p1_draw_cups[i].y);
			}
			clearCup(p1_draw_mancala);
			ctx.fillText(game.scoreCups[0],p1_draw_mancala.x, p1_draw_mancala.y);
			clearCup(p2_draw_mancala);
			ctx.fillText(game.scoreCups[1],p2_draw_mancala.x, p2_draw_mancala.y);
		}
		function clearCup(cup){
			var s = canvas_unit / 5;
			ctx.clearRect(cup.x - s, cup.y - s, 2 * s, 2 * s);
		}
		function enable_board(){
			//Bind buttons to each mancala
			var selection = function(move){
				$('canvas').unbind('click',selection);
				$('canvas').unbind('mousemove',enable);		
				var playAgain = game.makeMove(turn, move);
				if (!playAgain){
					swap_turns();
				}
				resetStones();
				setTimeout(continueGame,1000);
			},
			enable = function (event) {
				var offset = $(this).offset(),
					mouseX, mouseY,
					cup_x, cup_y,
					dx, dy, cup_index;
				mouseX = parseInt(event.pageX - offset.left);
				mouseY = parseInt(event.pageY - offset.top);
				if (turn.num == 1) { //Only check bottom ones
					cup_index = Math.floor(mouseX/canvas_unit) - 1;
					//console.log(cup_index);
					if((-1 < cup_index) &&
					 	(cup_index < 6) && 
					 	(game.P1Cups[cup_index] > 0)){
						cup_x = Math.floor(mouseX / canvas_unit) * canvas_unit + canvas_unit / 2;
						cup_y = canvas_unit * 1.5;
						dx = mouseX - cup_x;
						dy = mouseY - cup_y;
						//console.log('dx: ' + dx);
						//console.log('dy: ' + dy);
						if((dx * dx + dy * dy) < p1_draw_cups[cup_index].rr){
							// change to hovercolor if previously outside
							if(!p1_draw_cups[cup_index].is_hovering){
								p1_draw_cups[cup_index].is_hovering=true;
								draw_circle(p1_draw_cups[cup_index]);
							}
							$('canvas').click(selection(cup_index));
						} else {
							// change to blurcolor if previously inside
							for(var i = 0; i < p1_draw_cups.length; i++){
								if(p1_draw_cups[i].is_hovering){
									p1_draw_cups[i].is_hovering=false;
									draw_circle(p1_draw_cups[i]);
									
								}
							}
							$('canvas').unbind('click',selection);
						}
					}
				} else {

				}
			}
			$('canvas').mousemove(enable);		
		}
		function draw_circle(cup){
			ctx.beginPath();				
			ctx.arc(cup.x,cup.y,cup.radius*0.9,0,2 * Math.PI);
			ctx.closePath();
			ctx.strokeStyle = cup.is_hovering ? cup.hover_color : cup.background_color;
			ctx.lineWidth = cup.radius * 0.1;
			ctx.stroke();
			
		}
	},
//=================Main function==========================
	main = function() {
		mancala_window();
	};
//==================Mancala Board Class====================================
	class mancala_board {
		constructor(){
			this.reset_board();
		}
		reset_board(){
			this.NCUPS = 6;
			this.scoreCups = [0,0];
			this.P1Cups = [4,4,4,4,4,4];
        	this.P2Cups = [4,4,4,4,4,4];
		}
		legal_move(player, cup){
			if (player.num == 1) {
				cups = this.P1Cups;
			} else {
				cups = this.P2Cups;
			}
			return cup > 0 && cup <= cups.length && cups[cup - 1] > 0;
		}
		legal_moves(player){
			var cups, moves;
			if (player.num == 1) {
				cups = this.P1Cups;
			} else {
				cups = this.P2Cups;
			}
			moves = new Array();
			for(var i = 0; i < cups.length; i += 1){
				if (cups[i] != 0)
					moves.push(i + 1);
			}
			return moves;
		}
		makeMove(player, cup){
			var again = this.makeMoveHelp(player, cup);
			if (this.game_over()){
				for(var i = 0; i < this.P1Cups.length; i += 1){
					this.scoreCups[0] += this.P1Cups[i];
					this.P1Cups[i] = 0;
				}
				for(var i = 0; i < this.P2Cups.length; i += 1){
					this.scoreCups[1] += this.P2Cups[i];
					this.P2Cups[i] = 0;
				}
				return false;
			} else {
				return again;
			}

		}
		makeMoveHelp(player, cup){
			var cups, opp_cups;
			if (player.num == 1) {
				cups = this.P1Cups;
				opp_cups = this.P2Cups; 
			} else {
				cups = this.P2Cups;
				opp_cups = this.P1Cups; 
			}
			var init_cups = cups,
				nstones = cups[cup - 1];
			cups[cup - 1] = 0;
			cup += 1;
			var playAgain = false;
			while (nstones > 0) {
				playAgain = false;
				while (cup <= cups.length && nstones > 0) {
					cups[cup - 1] += 1;
					nstones = nstones - 1;
					cup += 1;
				}
				if (nstones == 0) {
					break;
				}
				if (cups == init_cups) {
					this.scoreCups[player.num - 1] += 1
					nstones -= 1;
					playAgain = true;
				}
				//Switch sides
				var temp_cups = cups;
				cups = opp_cups;
				opp_cups = temp_cups;
				cup = 1;
			}
			if (playAgain) {
				return true;
			}
			//Capturing
			if ((cups == init_cups) && (cups[cup - 2] === 1)){
				this.scoreCups[player.num - 1] += opp_cups[this.NCUPS - cup + 1];
				opp_cups[this.NCUPS - cup + 1] = 0;
				this.scoreCups[player.num - 1] += 1;
				cups[cup - 2] = 0;
			}
			return false;
		}
		hasWon(player_num){
			if (this.game_over()){
				var opp = 2 - player_num + 1;
				return this.scoreCups[player_num - 1] > this.scoreCups[opp - 1];
			} else {
				return false;
			}
		}
		get_player_cups(player_num){
			if (player_num == 1){
				return this.P1Cups;
			} else {
				return this.P2Cups;
			}
		}
		game_over(){
			var over = true;
			for(var i = 0; i < this.P1Cups.length; i += 1){
				if (this.P1Cups[i] != 0){
					over = false;
					break;
				}
			}
			if (over){
				return true;
			}
			over = true;
			for(var i = 0; i < this.P2Cups.length; i += 1){
				if (this.P2Cups[i] != 0){
					over = false;
					break;
				}
			}
			return over;
		}
	}
	class player {
		constructor(player_num, player_type, ply){
			this.num = player_num;
			this.opp = 2 - player_num + 1;
			this.kind = player_type;
			this.ply = ply;
		}
		minimaxMove(){
			console.log('5');
		}
		maxValue(){
			console.log('5');
		}
		score(board){
			if (board.hasWon(this.num)){
				return 100.0;
			} else if (board.hasWon(this.opp)){
				return 0.0;
			} else {
				return 50.0;
			}
		}
		chooseMove(board) {
			if (this.kind == 0) {

			} else if (this.kind == 1) {
				var moves = board.legal_moves(this);
				return moves[Math.floor(Math.random() * moves.length)];
			}
		}
	}
	return {
		main: function() {
			return main();
		}
	}
}($));