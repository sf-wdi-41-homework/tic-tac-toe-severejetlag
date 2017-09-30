// wait for the DOM to finish loading
$(document).ready(function() {
  // all code to manipulate the DOM
  // goes inside this function
  var gameBoard = tttObjectCreate(3);
  tttCreateBoard(gameBoard);
  console.log(gameBoard);
});

//function to create object of data 
function tttObjectCreate(rows){
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
			boardItem.text = `this is item ${x+1} row ${i+1}`;
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
	for(var y = 0; y < rowNum; y++){
	//Grab column length for nested loop
		let colNum = gameObject[y].rowArr.length;
		//initialize row DOM object
		let rowHTML = $.parseHTML('<div class="row"></div>');
		for(var x = 0; x < colNum; x++){
			//Initialize column DOM object with x and y attributes
			let columnHTML = $(`<div class='col-md-4 box text-center' x='${x}' y='${y}'>${x}, ${y}</div>`);
			$(rowHTML).append(columnHTML);
		}
		$(gameBoardHTML).append(rowHTML);
	}
	$('#game.row').append(gameBoardHTML)

	//create event listeners on new DOM objects
	createEventListeners()
}

//Add click listeners to new DOM elements
function createEventListeners(){
	clickBoardItem();
}

function clickBoardItem(){
	let boardItem = $('.box');
	boardItem.on('click',function(){
		alert('you suck at clicking ya you totally suck');
	})
}


