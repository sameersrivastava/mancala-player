/*
Program: Mancala GUI and Player
Author: Sameer Srivastava - https://github.com/sameersrivastava
Date: 7/13/16
Description: GUI for playing Mancala against an AI. The game will feature 
facial instructions depending on how the AI is doing. Will add more features 
later.

Program Overview:
-Reset Game
	-Zero in Mancalas
	-4 in cups
-Set turn order
-Play a turn
	-Make move
		-AI
			-chooseMove
		-Human
			-Check if the choosen move is legal
	-make the move
	-Switch turns if not Move Again
	-Put in new values in cups
	-Repeat until Game over


3 classes
-Mancala Window => GUI
-Mancala Board => "Backend"
-Player => Uses Backend
*/
var mancala = (function($){
	var main = function(){
		
		var player1 = new player(1, 1),
			player2 = new player(2, 1),
			gui = new mancala_gui(player1, player2);
		gui.newgame();
	};
	//Front end markup
	class mancala_gui {
		constructor(p1, p2){
			this.game = new mancala_board();
			this.p1 = p1;
			this.p2 = p2;
		}
		drawBoard(){
			var self = this;
			$('.pit.player-1').each(function(index){
				console.log( index + ": " + $( this ).text() );
				$(this).text(self.game.p1_cups[index]); 
			});
			$($('.pit.player-2').get().reverse()).each(function(index){
				console.log( index + ": " + $( this ).text() );
				$(this).text(self.game.p2_cups[index]); 
			});
			$('.mancala.player-1').text(self.game.score_cups[0]);
			$('.mancala.player-2').text(self.game.score_cups[1]);


			//run continueGame
			window.setTimeout(this.continueGame(), 3000);
		}
		newgame(){
			this.game.reset();
			this.turn = this.p1; //change this to random later
			this.wait = this.p2;
			this.drawBoard();
			
		}
		continueGame(){
			var move, playAgain;
			if (this.game.gameOver()) {
            	if (this.game.hasWon(this.p1.num)){
                	// this.status = "Player " + this.p1 + " wins";
                	$('.chat-bubble').text('Player 1 wins!');
            	} else if (this.game.hasWon(this.p2.num)){
                	//this.status = "Player " + this.p2 + " wins";
                	$('.chat-bubble').text('Player 2 wins!');
            	} else
                	// this.status = "Tie game";
                	$('.chat-bubble').text('It is a tie!');
            	return
            }
        	if (this.turn.type == 2) {
            	this.enableBoard();
        	} else {
            	move = this.turn.chooseMove(this.game);
            	playAgain = this.game.makeMove(this.turn, move);
            	if (!playAgain) {
                	// this.swapTurns();
                	var temp = this.turn
        			this.turn = this.wait
        			this.wait = temp

            	}
           		this.drawBoard();
           	}
		}
		swapTurns(){
			var temp = this.turn
        	this.turn = this.wait
        	this.wait = temp
		}
	}
	//Game Logic
	class mancala_board{
		constructor(){
			this.reset();
		}
		reset(){
			this.num_cups = 6;
			this.score_cups = [0,0];
			this.p1_cups = Array.apply(null, Array(this.num_cups)).map(Number.prototype.valueOf,4);
			this.p2_cups = Array.apply(null, Array(this.num_cups)).map(Number.prototype.valueOf,4);
		}
		//Checks if move is legal
		isLegalMove(player, cup){
			if (player.num == 1){
				cups = this.p1_cups;
			} else {
				cups = this.p2_cups;
			}
			return (cup >= 0 && cup < cups.length && cups[cup] > 0);
		}
		//Get all legal moves
		legalMoves(player){
			var moves = [],
				cups = [],
				i;
			if (player.num == 1){
				cups = this.p1_cups;
			} else {
				cups = this.p2_cups;
			}
			
			for(i = 0; i < cups.length; i += 1){
				if (cups[i] > 0) {
					moves.push(i);
				}
			}
			return moves;
		}
		//make the move
		makeMove(player, cup, makeMoveCallback){
			return this.makeMoveHelp(player, cup);
			
		}
		makeMoveCallback(again){
			if (this.gameOver()){
				var i;
				for(i = 0; i < this.p1_cups.length; i += 1){
					this.score_cups[0] += this.p1_cups[i];
					this.p1_cups[i] = 0;
				}
				for(i = 0; i < this.p2_cups.length; i += 1){
					this.score_cups[1] += this.p2_cups[i];
					this.p2_cups[i] = 0;
				}
				return false;
			} else {
				return again;
			}
		}
		//make actual move
		makeMoveHelp(player, cup, cb){
			var cups = [],
				opp_cups = [],
				init_cups = [],
				temp_cups = [],
				nstones,
				playAgain = false;
			if (player.num == 1){
				cups = this.p1_cups;
				opp_cups = this.p2_cups;
			} else {
				cups = this.p2_cups;
				opp_cups = this.p1_cups;
			}
			init_cups = cups;
			//Get all the stones
			nstones = cups[cup];
			//empty out the cup
			cups[cup] = 0;
			//Set up index for while loop
			cup += 1;

			while (nstones > 0) {
				playAgain = false;
				while ((cup < cups.length) && (nstones > 0)){
					cups[cup] += 1;
					nstones -= 1;
					cup += 1
				}
				if (nstones == 0){
					break; 
				}
				if (cups == init_cups) { //make it in the mancala
					this.score_cups[player.num - 1] += 1;
					nstones = nstones - 1;
					playAgain = true;
				}
				temp_cups = cups;
				cups = opp_cups;
				opp_cups = temp_cups;
				cup = 0;
			}

			if (playAgain) {
				return this.makeMoveCallback(true);
			}

			//Check to see if landed in a blank space on our side
			if ((cups == init_cups) && (cups[cup-1] == 1)){
				this.score_cups[player.num - 1] += opp_cups[this.num_cups - cup];
				var a = this.num_cups - cup;
				opp_cups[a] = 0;
				//Capture own cup too
				this.score_cups[player.num - 1] += 1;
				cups[cup - 1] = 0;
			}
			return this.makeMoveCallback(false);
		}
		hasWon(player_num){
			var opp;
			if (this.gameOver()){
				opp = 2 - player_num + 1;
				return this.score_cups[player_num - 1] > this.score_cups[opp - 1];
			} else {
				return false;
			}
		}
		getPlayerCups(player_num){
			if (player_num == 1) {
				return this.p1_cups;
			} else {
				return this.p2_cups;
			}
		}
		gameOver(){
			var over = true,
				i;
			for(i = 0; i < this.p1_cups.length; i += 1) {
				if (this.p1_cups[i] != 0){
					over = false;
					break;
				}
			}
			if (over){
				return true;
			}
			over = true;
			for(i = 0; i < this.p2_cups.length; i += 1) {
				if(this.p2_cups[i] != 0){
					over = false;
				}
			}
			return over;
		}
	}
	//Player
	class player{
		// this.human = 0;
		// this.random = 1;
		// this.abprune = 2;
		constructor(player_num, player_type, ply = 0){
			this.num = player_num;
			this.opp = 2 - player_num + 1;
			this.type = player_type;
			this.ply = ply;
		}
		chooseMove(board) {
			var move, legal_moves;
			if (this.type == 1) {
				legal_moves = board.legalMoves(this);
				move = legal_moves[Math.floor(Math.random()*legal_moves.length)];
				return move;
			}
		}

	}
	return {
		main: function() {
			return main();
		}
	}
}($));
