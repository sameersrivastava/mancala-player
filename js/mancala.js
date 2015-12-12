var mancala = (function($){
	var mancala_window = function(){
		// Create the canvas
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");
		//Appened canvas to body
		canvas.width = $('#container').width();
		canvas.height = $('#container').width()/4;
		document.body.appendChild(canvas);
		//Set drawing units and players
		var canvas_unit = canvas.height / 2,
			cup_radius = canvas.height * 3 / 16,
			p1 = 1,
			p2 = 2,
			turn = p1,
			wait = p2,
			p1_cups = new Array(),
			p2_cups = new Array(),
			p1_mancala,
			p2_mancala;

		//makeBoard data objects
		makeBoard();

		//actually draw the Board
		drawBoard();


		function makeBoard() {
			var i, j, w_offset,w_increment, h_offset, h_increment;
			w_offset = (canvas_unit * 3 / 2);
			w_increment = canvas_unit;
			h_offset = (canvas_unit / 2);
			h_increment = canvas_unit;
			//P1 Cups Bottom
			for(i=0; i < 6; i += 1) { 
				p2_cups[i] = {
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
			for(i=0; i < 6; i += 1) { 
				p1_cups[i] = {
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
		}
		function drawBoard() {
			var i, cup;
			//Draw cups
			for(i = 0; i < 6; i += 1){
				//Draw P1 Cups
				cup = p1_cups[i];
				ctx.beginPath();				
				ctx.arc(cup.x,cup.y,cup.radius*0.9,0,2 * Math.PI);
				ctx.strokeStyle = "black";
				ctx.lineWidth = cup.radius * 0.1;
				ctx.stroke();
				//Draw P2 cups
				cup = p2_cups[i];
				ctx.beginPath();				
				ctx.arc(cup.x,cup.y,cup.radius*0.9,0,2 * Math.PI);
				ctx.strokeStyle = "black";
				ctx.lineWidth = cup.radius * 0.1;
				ctx.stroke();	
			}
		}


		// var p1_draw_cups, p2_draw_cups = new Array();
		// draw_cups();
		
		// function draw_cups() {
		// 	var i, j, w_offset,w_increment, h_offset, h_increment;
		// 	w_offset = (canvas_unit * 3 / 2);
		// 	w_increment = canvas_unit;
		// 	h_offset = (canvas_unit / 2);
		// 	h_increment = canvas_unit;
		// 	//P1 Cups Bottom
		// 	for(i=0; i < 2; i++){
		// 	for(j=0; j < 6; j += 1) { 
		// 		ctx.beginPath();				
		// 		ctx.arc(w_offset + j * w_increment,h_offset + i * h_increment,radius*0.9,0,2 * Math.PI);
		// 		ctx.strokeStyle = "black";
		// 		ctx.lineWidth = radius * 0.1;
		// 		ctx.stroke();		
		// 	}
	},
	main = function() {
		mancala_window();
	};
	return {
		main: function() {
			return main();
		}
	}
}($));