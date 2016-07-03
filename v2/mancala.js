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
*/
var mancala = (function($){
	var main = function(){
		console.log('test');
	};
	return {
		main: function() {
			return main();
		}
	}
}($));
