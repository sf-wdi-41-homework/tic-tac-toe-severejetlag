	gameBoard.forEach(function(row){
		let y = row.rowIndex;
		row.rowArr.forEach(function(boardItem){
			let x = boardItem.colIndex;
			if(y === x){
				console.log("match" + x + " " + y);
			}
		})
	})
	let selectedItems = $('.box[beenClicked="true"]');
	let ymatch = 0; 
	for(let y = 0;y < gameBoard.length; y++){
		let xmatch = 0; 
		for(let x = 0; x < gameBoard[y].rowArr.length; x++){
			let rowItemSelected = gameBoard[y].rowArr[x].selected;
			console.log(rowItemSelected);
			if(rowItemSelected ){
				console.log("match" + xmatch);
				xmatch++;
			}else{
				break;

			}
		}
		if(xmatch === gameBoard[y].rowArr.length){
			console.log("full row!")
		}
	}