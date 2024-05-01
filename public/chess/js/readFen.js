// this function reads a given fen string and extracts all the relevant information 
function readFen(fenString){
    var fenArray = fenString.split(" ");
    fenString = fenArray[0];
    castlesAvailable = fenArray[2];
    enPassantSquare = fenArray[3];
    turnsSinceTakeOrAdvance = fenArray[4];
    turnsNum = fenArray[5];

    var ranks = fenString.split("/");

    var finalArray = [];
    for(var i = 0; i < ranks.length; i++){
        var row = ranks[i].split("");
        var finalRow = [];
        for(var j = 0; j < row.length; j++){

            // this gibberish is called regex, its basically black magic, but it works
            // it tests if the value in the fen string is a number or not
            if(/^\d+$/.test(row[j])){
                for(var k = 0; k < row[j]; k++){
                    finalRow.push("0");
                }
            }
            else{
                finalRow.push(row[j]);
            }
        }
        finalArray.push(finalRow);
    }

   // this loops through the board array and the output of the readFen function and places all the peices as they should be according to the fen string
    for(var i = 0; i < 8; i++){
        for(var j=0; j < 8; j++){
            board[i * 8 + j].occupation = finalArray[i][j];
            board[i * 8 + j].setSprite();
        }
    }
}

// this function looks at the current squares and writes a fen string
// if no parameter is given blackTurn will default to true
function writeFen(blackTurn = true){
    var fenString = "";

    // this loops through the squares and builds the main part of the fen string
    for(var i = 0; i < 8; i++){
        var emptySpaces = 0;
        for(var j = 0; j < 8; j++){
            if(board[i * 8 + j].occupation == 0){
                emptySpaces++;
            }

            if((board[i * 8 + j].occupation != 0 || j == 7) && emptySpaces > 0){
                fenString += emptySpaces;
                emptySpaces = 0;
            }

            if(board[i * 8 + j].occupation != 0){
                fenString += board[i * 8 + j].occupation;
            }
        }

        if(i < 7){
            fenString += "/";
        }
    }

    // it will always be black's turn when we send a fen string to stockfish unless we are checking for checkmates after stockfish just went
    if(blackTurn){
        fenString += " b ";
    }
    else{
        fenString += " w ";
    }

    if(castlesAvailable != ""){
        fenString += castlesAvailable;
    }
    else{
        fenString += "-"
    }

    fenString += " ";

    fenString += enPassantSquare;

    fenString += " ";
    
    fenString += turnsSinceTakeOrAdvance;

    fenString += " ";

    fenString += turnsNum;

    return fenString;
}

