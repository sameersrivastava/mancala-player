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
		
		var player1 = new player(1, 0),
			player2 = new player(2, 2, 9),
			gui;
			// player2 = new player(2, 1),
			
		$('.btn-success').click(function(){
			$('.chat-bubble').html(
				'Who goes first?' +
				'<button type="button" class="btn btn-default" id="btn-p1">P1 (You) </button>' +
				'<button type="button" class="btn btn-default" id="btn-p2">P2 (Me) </button>' +
				'<button type="button" class="btn btn-default" id="btn-random">Random</button>'
			);
			$('#btn-p1').click(function(){
				gui = new mancala_gui(player1, player2);
				$('.chat-bubble').text('You can start!');
				window.setTimeout(gui.newgame(), 2000);
			});
			$('#btn-p2').click(function(){
				gui = new mancala_gui(player2, player1);
				$('.chat-bubble').text('I will start!');
				window.setTimeout(gui.newgame(), 2000);
			});
			$('#btn-random').click(function(){
				if(Math.random() >= 0.5) {
					gui = new mancala_gui(player1, player2);
					$('.chat-bubble').text('You can start!');
					window.setTimeout(gui.newgame(), 2000);
				} else {
					gui = new mancala_gui(player2, player1);
					$('.chat-bubble').text('I will start!');
					window.setTimeout(gui.newgame(), 2000);
				}
			});

			// window.setTimeout(gui.newgame(), 2000);
		});
		
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
				//console.log( index + ": " + $( this ).text() );
				$(this).text(self.game.p1_cups[index]); 
			});
			$($('.pit.player-2').get().reverse()).each(function(index){
				//console.log( index + ": " + $( this ).text() );
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
				if (this.game.hasWon(1)){
					// this.status = "Player " + this.p1 + " wins";
					$('.chat-bubble').html('You win!' +
						' Play me again?' + 
						'<button type="button" class="btn btn-success">Yes</button>' +
						'<button type="button" class="btn btn-danger">No</button>'	
					);
					main();
				} else if (this.game.hasWon(2)){
					//this.status = "Player " + this.p2 + " wins";
					$('.chat-bubble').html('I win!' +
						' Play me again?' + 
						'<button type="button" class="btn btn-success">Yes</button>' +
						'<button type="button" class="btn btn-danger">No</button>'
					);
					main();
				} else {
					// this.status = "Tie game";
					$('.chat-bubble').html('It is a tie!' +
						' Play me again?' + 
						'<button type="button" class="btn btn-success">Yes</button>' +
						'<button type="button" class="btn btn-danger">No</button>'
					);
					main();
				}
			}
			if (this.turn.type == 0) {
				this.enableBoard();
			} else {
				move = this.turn.chooseMove(this.game);
				playAgain = this.game.makeMove(this.turn, move);
				if (!playAgain) {
					// this.swapTurns();
					console.log('Turn swap');
					var temp = this.turn
					this.turn = this.wait
					this.wait = temp

				}
				this.drawBoard();
			}
		}
		enableBoard(){
			// $('.chat-bubble').text('Your turn');
			var self = this;
			$('.pit.player-1').click(function(){
				var moveAgain,
					id = parseInt($(this).attr('id').substring(4,5));
				if(self.game.isLegalMove(self.turn,id)) {
					moveAgain = self.game.makeMove(self.turn, id);
					if(!moveAgain){
						var temp = self.turn
						self.turn = self.wait
						self.wait = temp
					}
					self.drawBoard();
				}

			});
		}
		swapTurns(){
			var temp = this.turn
			this.turn = this.wait
			this.wait = temp
		}

	}
	//Game Logic
	class mancala_board{
		// constructor(){
		// 	this.reset();
		// }
		constructor(score_cups, p1_cups, p2_cups){
			if(score_cups === undefined){
				this.reset();
			} else {
				this.num_cups = 6;
				this.score_cups = score_cups;
				this.p1_cups = p1_cups;
				this.p2_cups = p2_cups;
			}
		}
		reset(){
			this.num_cups = 6;
			this.score_cups = [0,0];
			this.p1_cups = Array.apply(null, Array(this.num_cups)).map(Number.prototype.valueOf,4);
			this.p2_cups = Array.apply(null, Array(this.num_cups)).map(Number.prototype.valueOf,4);
		}
		//Checks if move is legal
		isLegalMove(player, cup){
			var cups = [];
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
		makeMove(player, cup){
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
			var move, legal_moves, val;
			if (this.type == 1) {
				legal_moves = board.legalMoves(this);
				move = legal_moves[Math.floor(Math.random()*legal_moves.length)];
				return move;
			} else if(this.type == 2){
				val = this.alphaBetaMove(board, this.ply);
				console.log('chose move ' + val[1], ' with value' + val[0]);
				return val[1];
			}
		}
		//=========Min Max Functions=========
		minimaxMove(board,ply){
			var move = -1,
				score = -5000.0,
				turn = this,
				legal_moves = board.legalMoves(this),
				i, nb, opp, s;
			for(i = 0; i < legal_moves.length; i += 1){
				if (ply == 0){
					return [this.score(board), legal_moves[i]];
				}
				if (board.gameOver()){
					return [-1, -1]; //no moves possible
				}
				//deep copy the board
				nb = new mancala_board(
					board.score_cups.slice(),
					board.p1_cups.slice(),
					board.p2_cups.slice()
				);
				//try the move
				nb.makeMove(this, legal_moves[i]);

				opp = new player(this.opp, this.type, this.ply);
				s = opp.minValue(nb, ply - 1, turn);

				if (s > score){
					move = legal_moves[i];
					score = s;
				}
			}
			return [score, move];
		}
		maxValue(board, ply, turn){
			var score = -5000.0,
				legal_moves = board.legalMoves(this),
				opp, nb, s;
			if (board.gameOver()){
				return turn.score(board);
			}
			for(i = 0; i < legal_moves.length; i += 1){
				if (ply == 0){
					return turn.score(board);
				}
				opp = new player(this.opp, this.type, this.ply);
				nb = new mancala_board(
					board.score_cups.slice(),
					board.p1_cups.slice(),
					board.p2_cups.slice()
				);
				//try the move
				nb.makeMove(this, legal_moves[i]);
				s = opp.minValue(nb, ply - 1, turn);
				if (s > score){
					score = s;
				}
			}
			return score;
		}
		minValue(board, ply, turn){
			var score = 5000.0,
				legal_moves = board.legalMoves(this),
				opp, nb, s;
			if (board.gameOver()){
				return turn.score(board);
			}
			for(i = 0; i < legal_moves.length; i += 1){
				if (ply == 0){
					return turn.score(board);
				}
				opp = new player(this.opp, this.type, this.ply);
				nb = new mancala_board(
					board.score_cups.slice(),
					board.p1_cups.slice(),
					board.p2_cups.slice()
				);
				//try the move
				nb.makeMove(this, legal_moves[i]);
				s = opp.maxValue(nb, ply - 1, turn);
				if (s < score){
					score = s;
				}
			}
			return score;
		}
		//=========Alpha Beta Functions=========
		alphaBetaMove(board, ply){
			var alpha = -5000.0,
				beta = 5000.0;
			return this.alphaMaxValue(board, ply, this, alpha, beta);
		}
		alphaMaxValue(board, ply, turn, alpha, beta){
			var score = -5000.0,
				move = -1,
				legal_moves = board.legalMoves(this),
				i, opp, nb, val, s, mv, again;
			if ((board.gameOver()) || (ply==0)){
				return [turn.score(board), -1]
			}
			for(i = 0; i < legal_moves.length; i += 1){
				
				opp = new player(this.opp, this.type, this.ply);
				nb = new mancala_board(
					board.score_cups.slice(),
					board.p1_cups.slice(),
					board.p2_cups.slice()
				);
				//try the move
				again = nb.makeMove(this, legal_moves[i]);
				if (again){
					val = opp.alphaMaxValue(nb, ply - 1, turn, alpha, beta);
				} else {
					val = opp.alphaMinValue(nb, ply - 1, turn, alpha, beta);
				}
				s  = val[0];
				mv = val[1];
				if (s > score){
					score = s;
					move = legal_moves[i];
				}

				if (score >= beta){
					return [score, move];
				}
				if (score > alpha){
					alpha = score;
				}
			}
			return [score, move];
		}
		alphaMinValue(board, ply, turn, alpha, beta){
			var score = 5000.0,
				move = -1,
				legal_moves = board.legalMoves(this),
				i, opp, nb, val, s, mv, again;
			if ((board.gameOver()) || (ply==0)){
				return [turn.score(board), -1]
			}
			for(i = 0; i < legal_moves.length; i += 1){
				
				opp = new player(this.opp, this.type, this.ply);
				nb = new mancala_board(
					board.score_cups.slice(),
					board.p1_cups.slice(),
					board.p2_cups.slice()
				);
				//try the move
				again = nb.makeMove(this, legal_moves[i]);
				if (again){
					val = opp.alphaMinValue(nb, ply - 1, turn, alpha, beta);
				} else {
					val = opp.alphaMaxValue(nb, ply - 1, turn, alpha, beta);
				}
				// val = opp.alphaMaxValue(nb, ply - 1, turn, alpha, beta);
				s  = val[0];
				mv = val[1];
				if (s < score){
					score = s;
					move = legal_moves[i];
				}

				if (score <= alpha){
					return [score, move];
				}
				if (score < beta){
					beta = score;
				}
			}
			return [score, move];
		}
		//Score Function
		score(board){
			var cups, opp_cups,
				score_diff, score,
				additional,
				capturing,
				marbles, num_marbles,
				i, temp, temp_capturing,
				own_marbles,
				total;

			if (board.hasWon(this.num)){
				return 1000.0;
			} else if(board.hasWon(this.opp)){
				return -1000.0;
			} else if (board.score_cups[this.num - 1] > 24){
				return 500.0;
			} else if (board.score_cups[this.opp - 1] > 24){
				return -500.0;
			} else {
				if(this.num == 1){
					cups = board.p1_cups;
					opp_cups = board.p2_cups;
					score_diff = board.score_cups[0] - board.score_cups[1];
				} else {
					cups = board.p2_cups;
					opp_cups = board.p1_cups;
					score_diff = board.score_cups[1] - board.score_cups[0];
				}

				score = score_diff + 24 * 30 / 6;

				additional = 0.0;
				capturing = 0.0;
				marbles = 0.0;

				for(i = 0; i < cups.length; i += 1){
					num_marbles = cups[i];
					if ((num_marbles > 0) || (opp_cups[i] > 0)) {
						if (num_marbles == (6- i)) {
							additional = (50.0 * (i + 1)) / 6;
						}
						//capturing
						temp = opp_cups[i] % 13;
						temp_capturing = 0.0;
						own_marbles = -1;
						if(temp <= (5 - i)){
							if (temp == 0){
								own_marbles = cups[5 - i];
							} else {
								own_marbles = cups[5 - i - temp];
							}
						} else if (temp >= (13- i)){
							own_marbles = cups[5 - i + temp - 13];
						}
						if (own_marbles == 0){
							temp_capturing = 50.0;
						} else if (own_marbles == 1){
							temp_capturing = 40.0;
						} else if (own_marbles == 2){
							temp_capturing = 25.0;
						}

						if (temp_capturing > capturing) {
							capturing = temp_capturing;
						}
						if (num_marbles < 4){
							marbles += 5;
						}
					} else {
						if (i == 5){
							marbles += 30;
						} else {
							marbles += 10;
						}

					}
				}
				total = capturing + score + additional + marbles;
				return total;
			}
		}
	}
	return {
		main: function() {
			return main();
		}
	}
}($));
