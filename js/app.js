// wait for the DOM to finish loading
// Initialize board size 
// TODO make user inputable
var gameSize;  
// Call and store gameboard object
var gameBoard;
// Create object for X and Y Coordinates of player and computer
var movesMadeByPlayer = {x:[],y:[]};
var movesMadeByOpponent = {x:[],y:[]};
$(document).ready(function() {
  // all code to manipulate the DOM
  // goes inside this function
  // Use gameboard object to create DOM elements
  $('#input-form').submit(function(event){
  	event.preventDefault();
	if($('#board')){
		tttDestroyBoard();
	}
  	let inputSelector = $("#game-sise-input");
	gameSize = parseInt(inputSelector.val());
	inputSelector.val('');
	gameBoard = tttObjectCreate(gameSize);
	tttCreateBoard(gameBoard);
  })
});

//function to create object of data 
function tttObjectCreate(rows){
	if(12%rows !== 0){
		rows = 3;
	}
	//Initialize gameBoard array to hold row objects
	var gameRows = [];
	//Looping for how many rows were passed by user
	for(let i = 0; i < rows; i++){
		//Creating empty object to fill row data
		let boardRow = {}
		boardRow.rowIndex = i; //declare row index
		boardRow.rowArr = []; //declare rowArr to hold rowitems

		//Looping over same row value to create row items
		for(let x = 0; x < rows; x++){
			boardItem = {}; //Creating empty object to fill boardItem data
			boardItem.colIndex = x; //declaring column index
			boardItem.text = `this is item ${x} row ${i}`;
			boardItem.selected = false;
			boardRow.rowArr.push(boardItem); //Adding object to rowArr array
		}
		gameRows.push(boardRow); //Adding row object to gameRows
	}
	return gameRows;
}

// Create function to loop througgh object and generate HTML
function tttCreateBoard(gameObject){
	//initialize DOM object to append items to
	let gameBoardHTML = $.parseHTML('<div class="col-md-6 col-md-offset-3" id="board"></div>');
	//grab row length for first for loop
	let rowNum = gameObject.length;
	let boostrapColumn = 12/rowNum;
	for(var y = 0; y < rowNum; y++){
	//Grab column length for nested loop
		let colNum = gameObject[y].rowArr.length;
		//initialize row DOM object
		let rowHTML = $.parseHTML('<div class="row"></div>');
		for(var x = 0; x < colNum; x++){
			//Initialize column DOM object with x and y attributes
			let columnHTML = $(`<div class='col-md-${boostrapColumn} box text-center' x='${x}' y='${y}' beenClicked='${gameBoard[y].rowArr[x].selected}''>${x}, ${y}</div>`);
			$(rowHTML).append(columnHTML);
		}
		$(gameBoardHTML).append(rowHTML);
	}
	$('#game.row').append(gameBoardHTML)
	//create event listeners on new DOM objects
	createEventListeners()
}

// Function to destroy board on reset
function tttDestroyBoard(){
	$("#board").remove();
}

//Add click listeners to new DOM targets
function createEventListeners(){
	createBoardItemClick();
}

// Add click events to .box items
function createBoardItemClick(){
	// Select box items
	let $boardItem = $('#board');
	$boardItem.on('click','.box',function(event){
		// Grab the coordinates of the box selected
		let x = $(this).attr("x");
		let y = $(this).attr("y");
		// Pass dom object and x and y coordinates to move function
		makeMove(this,x,y);
	});
}

// Function to complete player move
function makeMove(target,x,y){
	// Check to see if passed coordinates have been selected before
	let checkMove = gameBoard[y].rowArr[x].selected;
	// If the returned value is false ! to create true condition
	if(!checkMove){
		console.log("clicked");
		// Update target text with X move
		$(target).text("X").attr('beenClicked','true').addClass('x');
		// Update gamebaord 'database'
		gameBoard[y].rowArr[x].selected = true;
		// Pass coordinates selected and who made the move
		storeActiveMoves(x,y,"player");
		// Once player move complete, call computer move function
		// opponentMakeMove();
	}else{
		console.log("wrong move!");
	}
	// Call function to check win conditions
	checkWin();
}

// Computer 'AI' move function 
function opponentMakeMove(){
	// Grab all DOM objects not selected previously 
	let $openMovesArr = $('.box[beenClicked="false"]');
	// Create random index number to grab random DOM object
	let i = Math.floor($openMovesArr.length*Math.random());
	// If there are elements left, updated selected one with O and new beenclicked attribute
	if($openMovesArr){
		$($openMovesArr[i]).text('O').attr("beenClicked","true").addClass('o');
		// grab X and Y of selected DOM object
		let x = $($openMovesArr[i]).attr('x');
		let y = $($openMovesArr[i]).attr('y');
		// Update gameboard DB
		gameBoard[y].rowArr[x].selected = true;
		//updated moves for opponent
		storeActiveMoves(x,y,"opponent");
		// Call function to check win conditions
		checkWin();
	}
}

// Store move coordinates 
function storeActiveMoves(x,y,player){
	// Check for computer or player move
	if(player === "player"){
		movesMadeByPlayer.x.push(x);
		movesMadeByPlayer.y.push(y);
	}else{
		movesMadeByOpponent.x.push(x);
		movesMadeByOpponent.y.push(y);
	}
	console.log(movesMadeByPlayer.x);
	console.log(movesMadeByPlayer.y);
}

// function to check status of game after each play
function checkWin(){
	// Grab the number of plays made 
	let numPlayerMoves = movesMadeByPlayer.x.length;
	// Only run if there have been enough moves to satisfy a win
	let $openMovesArr = $('.box[beenClicked="false"]');
	// Check if there are available moves
	if($openMovesArr.length === 0){
		console.log("NO MOVES, BITCH!");
	}else if(numPlayerMoves >= gameSize){
		// Grab array of x coordinates of player moves
		let playXMoves = movesMadeByPlayer.x; 
		let opponentXMoves = movesMadeByOpponent.x;
		// Grab arra of y coordinates of player moves
		let playYMoves = movesMadeByPlayer.y; 
		let opponentYMoves = movesMadeByOpponent.y; 
		// Pass coordinates to win conditions functions
		console.log(checkLineWin(playXMoves));
		console.log(checkLineWin(playYMoves));
		console.log(checkDiagonalWin(playXMoves,playYMoves));
		// console.log(checkLineWin(opponentXMoves));
		// console.log(checkLineWin(opponentYMoves));
		// console.log(checkDiagonalWin(opponentXMoves,opponentYMoves));	
	}
}

// Check for single line win (row or column)
function checkLineWin(coordArr){
	// Sort array from least to greatest
	let sortedCoords = coordArr.sort();
	// Initialize count for duplicate items and current match
	let coordCount; 
	let coordCurrent;
	for(let i = 0; i < sortedCoords.length; i++){
		// CHeck for duplicates if none then reset count and current match item
		if(sortedCoords[i] != coordCurrent){
			coordCurrent = sortedCoords[i];
			coordCount = 1;
		}else{
			// if they do match add to dupe counter
			coordCount++;
		}
		// If there are as many dupes as their are rows or columns then break loop
		if(coordCount === gameSize){
			break;
		}
	}
	// If there are as many dupes as their are rows or columns then return 'true' for win
	if(coordCount >= gameSize){
		return true;
	}else{
		return false;
	}
}

// Check for diagonal win condition
function checkDiagonalWin(xCoordArr,yCoordArr){
	// Initialize count of # of matches and array length
	let coordMatchCount = 0;
	let arrLength;
	//console.log(xCoordArr);
	// console.log(yCoordArr);
	// Check if there are as many x coords as y coords and set array length
	if(xCoordArr.length === yCoordArr.length){
		arrLength = xCoordArr.length; 
	}
	// Iterate over arrays to compare matches at the same index
	for(let i = 0; i < arrLength; i++){
		if(xCoordArr[i] === yCoordArr[i]){
			// Add to count if match made
			coordMatchCount++;
		}
	}
	// Make sure there are enough matches to satisfiy win condition and return true if win
	if(coordMatchCount === gameSize){
		return true;
	}else{
		return false;
	}
}





