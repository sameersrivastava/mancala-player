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
		console.log('test');
		var gui = new mancala_gui(2, 3);
		gui.drawBoard();
	};
	//Front end markup
	class mancala_gui {
		constructor(p1, p2){
			this.game = new mancala_board();
			this.p1 = p1;
			this.p2 = p2;
		}
		drawBoard(){
			$('.pit.player-1').each(function(index){
				console.log( index + ": " + $( this ).text() );
			});
			$($('.pit.player-2').get().reverse()).each(function(index){
				console.log( index + ": " + $( this ).text() );
			});


			//run continueGame
			//this.continueGame();
		}
		newgame(){
			this.game.reset();
			this.turn = this.p1; //change this to random later
			this.wait = this.p2;
			this.drawBoard();
			
		}
		continueGame(){
			if (this.game.gameOver()) {
            	if (this.game.hasWon(this.p1.num)){
                	this.status = "Player " + str(this.p1) + " wins";
            	} else if (this.game.hasWon(this.p2.num)){
                	this.status = "Player " + str(this.p2) + " wins";
            	} else
                	this.status = "Tie game";
            	return
            }
        	if (this.turn.type == player.HUMAN) {
            	this.enableBoard();
        	} else {
            	move = this.turn.chooseMove(this.game);
            	playAgain = this.game.makeMove(this.turn, move);
            	if (!playAgain) {
                	this.swapTurns()
            	}
           		this.drawBoard();
           	}
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

	}
	return {
		main: function() {
			return main();
		}
	}
}($));
