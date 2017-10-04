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
  	$(document).on('keyup','body',function(e) {
		if (e.keyCode === 27 || e.keyCode===13) { // escape key maps to keycode `27`
	        $('#modal').removeClass('active');
	    }
	});
	$('#modal button').on('click', function(event){
		event.preventDefault();
		$('#modal').removeClass('active');
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
	let gameBoardHTML = $.parseHTML('<div class="col-xs-12" id="board"></div>');
	let resetButtonHTML = $.parseHTML('<div class="row" id="reset-button-container"><button type="button" class="btn btn-danger">Reset</button></div>')
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
			let columnHTML = $(`<div class='col-xs-${boostrapColumn} box text-center' x='${x}' y='${y}' beenClicked='${gameBoard[y].rowArr[x].selected}''>${x}, ${y}</div>`);
			$(rowHTML).append(columnHTML);
		}
		$(gameBoardHTML).append(rowHTML);
	}
	$('#game.row').append(gameBoardHTML).after(resetButtonHTML);
	//create event listeners on new DOM objects
	createEventListeners()
}

// Function to destroy board on reset
function tttDestroyBoard(){
	// Remove board HTML
	$("#board").remove();
	$("#reset-button-container").remove();
	// Reset Player and Opponent move trackers 
	movesMadeByPlayer = {x:[],y:[]};
	movesMadeByOpponent = {x:[],y:[]};
}

// Function to update and display modal text 
function displayModal(text){
	$('#modal p').text(text);
	$('#modal').addClass('active');
}

//Add click listeners to new DOM targets
function createEventListeners(){
	createBoardItemClick();
	createResetButtonClick();
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

// Function to control the resettin of the game board
function createResetButtonClick(){
	let $resetButton = $('#reset-button-container button');
	$resetButton.on('click',function(){
		tttDestroyBoard();
		gameBoard = tttObjectCreate(gameSize);
		tttCreateBoard(gameBoard);
	})
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
		if(!checkWin()){
			opponentMakeMove();	
		}else{
			winAlert('player');
		}
	}else{
		displayModal('Wrong move!');
	}
	// Call function to check win conditions
}

// Computer 'AI' move function 
function opponentMakeMove(){
	// Grab all DOM objects not selected previously 

	let $openMovesArr = $('.box[beenClicked="false"]');
	// Create random index number to grab random DOM object
	let i = Math.floor($openMovesArr.length*Math.random());
	// If there are elements left, updated selected one with O and new beenclicked attribute
	if($openMovesArr.length > 0){
		$($openMovesArr[i]).text('O').attr("beenClicked","true").addClass('o');
		// grab X and Y of selected DOM object
		let x = $($openMovesArr[i]).attr('x');
		let y = $($openMovesArr[i]).attr('y');
		// Update gameboard DB
		gameBoard[y].rowArr[x].selected = true;
		//updated moves for opponent
		storeActiveMoves(x,y,"opponent");
		// Call function to check win conditions
		
		if(checkWin()){
			winAlert('computer');
		}
	}else{
		displayModal('Stalemate!');
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
}

// function to check status of game after each play
function checkWin(){
	// Grab the number of plays made 
	let numPlayerMoves = movesMadeByPlayer.x.length;
	// Only run if there have been enough moves to satisfy a win
	let $openMovesArr = $('.box[beenClicked="false"]');
	// Check if there are available moves
	if($openMovesArr.length === 0){
		// console.log("NO MOVES!");
	}else if(numPlayerMoves >= gameSize){
		// Grab array of x coordinates of player moves
		let playXMoves = movesMadeByPlayer.x; 
		let opponentXMoves = movesMadeByOpponent.x;
		// Grab arra of y coordinates of player moves
		let playYMoves = movesMadeByPlayer.y; 
		let opponentYMoves = movesMadeByOpponent.y; 
		// Pass coordinates to win conditions functions
		let playerWin = checkLineWin(playXMoves) || checkLineWin(playYMoves) || checkDiagonalWin(playXMoves,playYMoves);
		let opponentWin = checkLineWin(opponentXMoves) || checkLineWin(opponentYMoves) || checkDiagonalWin(opponentXMoves,opponentYMoves);
		console.log(playerWin || opponentWin)
		return playerWin || opponentWin;
	}
}

function winAlert(winner){
	displayModal(`${winner} has won!`);
}

// Check for single line win (row or column)
function checkLineWin(coordArr){
	// Sort array from least to greatest
	let tempCoords = coordArr.slice();
	let sortedCoords = tempCoords.sort();
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





