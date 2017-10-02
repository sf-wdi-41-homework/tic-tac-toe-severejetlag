// wait for the DOM to finish loading
var gameSize = 4;  
var gameBoard = tttObjectCreate(gameSize);
var movesMadeByPlayer = {x:[],y:[]};
var movesMadeByOpponent = {x:[],y:[]};
$(document).ready(function() {
  // all code to manipulate the DOM
  // goes inside this function
  tttCreateBoard(gameBoard);
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

//Add click listeners to new DOM targets
function createEventListeners(){
	createBoardItemClick();
}

function createBoardItemClick(){
	let $boardItem = $('.box');
	$boardItem.on('click',function(event){
		let x = $(this).attr("x");
		let y = $(this).attr("y");
		makeMove(this,x,y);
	});
}

function makeMove(target,x,y){
	let checkMove = gameBoard[y].rowArr[x].selected;
	if(!checkMove){
		console.log("clicked");
		$(target).text("X")
		$(target).attr('beenClicked','true');
		gameBoard[y].rowArr[x].selected = true;
		storeActiveMoves(x,y,"player");
		//opponentMakeMove();
	}else{
		console.log("wrong move!");
	}
	checkWin();
}

function opponentMakeMove(){
	let $openMovesArr = $('.box[beenClicked="false"]');
	let i = Math.floor($openMovesArr.length*Math.random());
	if($openMovesArr){
		$($openMovesArr[i]).text("O");
		$($openMovesArr[i]).attr("beenClicked","true");
	}
	let x = $($openMovesArr[i]).attr('x');
	let y = $($openMovesArr[i]).attr('y');
	gameBoard[y].rowArr[x].selected = true;
	storeActiveMoves(x,y,"opponent");
}

//Store move coordinates 
function storeActiveMoves(x,y,player){
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

function checkWin(){
	let numPlayerMoves = movesMadeByPlayer.x.length;
	if(numPlayerMoves >= gameSize){
		let playXMoves = movesMadeByPlayer.x; 
		let playYMoves = movesMadeByPlayer.y; 
		console.log(checkLineWin(playXMoves));
		console.log(checkLineWin(playYMoves));
		console.log(checkDiagonalWin(playXMoves,playYMoves));
	}

}

function checkLineWin(coordArr){
	let sortedCoords = coordArr.sort();
	let coordCount; 
	let coordCurrent;
	for(let i = 0; i < sortedCoords.length; i++){
		if(sortedCoords[i] != coordCurrent){
			coordCurrent = sortedCoords[i];
			coordCount = 1;
		}else{
			coordCount++;
		}
		if(coordCount === gameSize){
			break;
		}
	}

	if(coordCount >= gameSize){
		return true;
	}else{
		return false;
	}
}

function checkDiagonalWin(xCoordArr,yCoordArr){
	let coordMatchCount = 0;
	let arrLength;
	//console.log(xCoordArr);
	// console.log(yCoordArr);
	if(xCoordArr.length === yCoordArr.length){
		arrLength = xCoordArr.length; 
	}
	for(let i = 0; i < arrLength; i++){
		if(xCoordArr[i] === yCoordArr[i]){
			coordMatchCount++;
		}
	}
	if(coordMatchCount === gameSize){
		return true;
	}else{
		return false;
	}
}













