// wait for the DOM to finish loading
$(document).ready(function() {
  // all code to manipulate the DOM
  // goes inside this function
  var gameBoard = tttObjectCreate(3);
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

function tttCreateBoard(gameObject){
	var rowNum = gameObject.length;
	for(var i = 0; i < rowNum; i++){
		colNum = gameObject[i].rowArr.length;
		for(var x = 0; x < colNum; x++){
			
		}
	}
}