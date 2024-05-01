//TODO movement logic and functions for pieces

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// this is the function that actually moves the pieces
function movePiece(fromSquare, toSquare){
    animate(fromSquare, toSquare);
    var piece = fromSquare.occupation;
    fromSquare.occupation = "0";
    fromSquare.setSprite();
    
    toSquare.occupation = piece;

    //wait for animation to finish
    setTimeout(function (){
        toSquare.setSprite();
    
        if(castlesAvailable == "") return;
    
        // this if statement moves stockfish's rook if it castles
        // the code for the player castling is found in Square.getClicked()
        if(fromSquare.id == "e8"){
            if(toSquare.id == "c8" && castlesAvailable.includes("q")){
                rookSquare = document.getElementById("a8").square;
                d8Square = document.getElementById("d8").square;
                rookSquare.occupation = "0";
                rookSquare.setSprite();
                d8Square.occupation = "r";
                d8Square.setSprite();
            }
            else if(toSquare.id == "g8" && castlesAvailable.includes("k")){
                rookSquare = document.getElementById("h8").square;
                f8Square = document.getElementById("f8").square;
                rookSquare.occupation = "0";
                rookSquare.setSprite();
                f8Square.occupation = "r";
                f8Square.setSprite();
            }
        }
    
        // this updates the fen to keep track of what castles are still legal
        switch(fromSquare.id){
            case "a8":
                castlesAvailable = castlesAvailable.replace("q", "");
                break;
            case "h8":
                castlesAvailable = castlesAvailable.replace("k", "");
                break;
            case "e8":
                castlesAvailable = castlesAvailable.replace("q", "");
                castlesAvailable = castlesAvailable.replace("k", "");
                break;
            case "a1":
                castlesAvailable = castlesAvailable.replace("Q", "");
                break;
            case "h1":
                castlesAvailable = castlesAvailable.replace("K", "");
                break;
            case "e1":
                castlesAvailable = castlesAvailable.replace("Q", "");
                castlesAvailable = castlesAvailable.replace("K", "");
                break;
        }
        switch(toSquare.id){
            case "a8":
                castlesAvailable = castlesAvailable.replace("q", "");
                break;
            case "h8":
                castlesAvailable = castlesAvailable.replace("k", "");
                break;
            case "a1":
                castlesAvailable = castlesAvailable.replace("Q", "");
                break;
            case "h1":
                castlesAvailable = castlesAvailable.replace("K", "");
                break;
        }
    }, animateTime * 1000);
}

// this function determines which squares can be moved to and tells the squares. It takes a Square class as an input
function highlightMovableSquares(startSquare){
    var occupation = startSquare.occupation;
    if(occupation == '0'){
        return;
    } else{

        for(var i = 0; i < board.length; i++){
            board[i].setCanMoveTo(false);
        }
        var piece=getPiece(startSquare.occupation);
        piece.getMoves(startSquare);

    }

    //IMPORTANT: leaving the code for each piece moving forward only one hear for troubleshooting. piece logic will go here.
    // var startingCoords = getCoordinates(square.id);
    // var nextCoords = traverseFrom("u", startingCoords);
    // var nextSquare = document.getElementById(parseCoords(nextCoords)).square;
    // nextSquare.setCanMoveTo(true);
}


//used to turn an id into coordinates for traversing the board. 
//IMPORTANT
//coords[1] is a number pulled directly from the id and are therefore indexed 1 to 8
//coords [0] calls the converted letter, which are drawn from an array and will be indexed 0 to 7
//so its important to always use checkSquare after traversing the board to properly get the id back.
function getCoordinates(id) {
    var  input = id.split("");
    var x;
    for(var i = 0; i< alphabet.length; i++){
        if(input[0] == alphabet[i]){
            x =i;
        }
    }
    var coords = [x, input[1]];
    return coords;
}

//NOTE: input is in a string direction of a single letter and [num,num] coordinates. remember to use get coordinates for input from an id in addition this function doesn't check whether a square actually exists. this allows for repition for more complex pieces such as knights.
function traverseFrom(direction, coords) {
    var letterNum = coords[0];
    var num = coords[1];
    var directionArray = direction.split("");

    for(var i=0; i<directionArray.length; i++){
       switch (directionArray[i]){
        case "u":
            num++;
            coords[1] = num;
            break;
        case "d":
            num--;
            coords[1] = num;
            break;
        case "l":
            letterNum--;
            coords[0] =letterNum;
            break;
        case "r":
            letterNum++;
            coords[0] =letterNum;
            break;
        default:
            throw new console.error("invalid input in function traverseFrom");
        } 
    }
    return coords;
}

//takes coordinates and parses them to an id. Then grabs obj by id and checks the occupation value, and returns it. 
function parseCoords(coords){
    var num;
    var letter;
    var id;
    if(coords[0]<= 7 && coords[0]>=0 && coords[1]<= 8 && coords[1]>0){
        letter = alphabet[coords[0]]
        num = coords[1];
        id = `${letter}${num}`
        return id;
    } else{
        //IMPORTANT: this return case for if the coordinate provided is not a square can be null or false. up to the group I guess.
        return null;
    }
}

function checkSquare(id){
    if(id != null){

        var targetSquare = getSquareByID(id);
        var occupation = targetSquare.occupation;
        return occupation;
    }
    else{
        return null;
    }
}
//if black performs an en passant, the pawn that is being taken is removed from the board
function incomingEnPassant (inputFen) {
    // splits the fenstring and grabs only the en passant value
    var fenArray = inputFen.split(" ");
    var enPassantTarget = fenArray[3];
    var target = getSquareByID(enPassantTarget);
    //checks if the en passant value is anything other than the null case and if the piece that moved their is a black pawn
    if(enPassantTarget != '-' && target.occupation =='p'){
        var coords =  getCoordinates(target.id).slice()
        var oneUp =traverseFrom('u', coords)
        var newID =parseCoords(oneUp)
        var blockup = getSquareByID(newID);
        blockup.occupation = '0';
        blockup.setSprite();
    }
};