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
			p1 = 1,
			p2 = 2,
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
					background_color: "#ffffff",
					hover_color: "#00ff00",
					isHovering: false
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
					background_color: "#ffffff",
					hover_color: "#00ff00",
					isHovering: false
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
				x: canvas_unit * 7 / 2,
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
					//P1 Won
				} else if (game.hasWon(p2.num)) {
					//P2 won
				} else {
					//
				}
			}
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
			return cup > 0 && cup <= len(cups) && cups[cup - 1] > 0;
		}
		legal_moves(player){
			if (player.num == 1) {
				cups = this.P1Cups;
			} else {
				cups = this.P2Cups;
			}
			moves = new Array();
			for(var i = 0; i < length(cups); i += 1){
				if (cups[i] != 0)
					moves.push(i + 1);
			}
			return moves;
		}
		makeMove(player, cup){
			var again = this.makeMoveHelp(player, cup);
			if (this.game_over()){
				for(var i = 0; i < length(cups); i += 1){
					this.scoreCups[0] += this.P1Cups[i];
					this.P1Cups[i] = 0;
				}
				for(var i = 0; i < length(cups); i += 1){
					this.scoreCups[1] += this.P2Cups[i];
					this.P2Cups[i] = 0;
				}
				return false;
			} else {
				return again;
			}

		}
		makeMoveHelp(player, cup){
			if (player.num == 1) {
				cups = this.P1Cups;
				opp_cups = this.P2Cups; 
			} else {
				cups = this.P2Cups;
				opp_cups = this.P1Cups; 
			}
			var init_cups = cups,
				nstones = cups[cup - 1];
			cup[cup - 1] = 0;
			cup += 1;
			var playAgain = false;
			while (nstones > 0) {
				playAgain = false;
				while (cup <= length(cups) && nstones > 0) {
					cups[cup - 1] += 1;
					nstones = nstones - 1;
					cup += 1;
				}
				if (nstones == 0) {
					break;
				}
				if (cups == init_cups) {
					self.scoreCups[player.num - 1] += 1
					nstones -= 1;
					playAgain = True;
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
			if (cups == init_cups && cups[cup - 2] == 1){
				this.scoreCups[player.num - 1] += opp_cups[this.NCUPS - cup + 1];
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
			for(var i = 0; i < length(this.P1Cups); i += 1){
				if (this.P1Cups[i] != 0){
					over = false;
					break;
				}
			}
			if (over){
				return true;
			}
			over = true;
			for(var i = 0; i < length(this.P2Cups); i += 1){
				if (this.P2Cups[i] != 0){
					over = false;
					break;
				}
			}
			return over;
		}
	}
	return {
		main: function() {
			return main();
		}
	}
}($));