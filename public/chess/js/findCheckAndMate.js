// what pieces are dangerous from only 1 space away
var closeDangerousPieces = {
    "u": "rqkRQK",
    "d": "rqkRQK",
    "l": "rqkRQK",
    "r": "rqkRQK",
    "ul": "bqkpBQKP",
    "ur": "bqkpBQKP",
    "dl": "bqkBQK",
    "dr": "bqkBQK"
}

// what pieces are dangerous from > 1 space away
var farDangerousPieces = {
    "u": "rqRQ",
    "d": "rqRQ",
    "l": "rqRQ",
    "r": "rqRQ",
    "ul": "bqBQ",
    "ur": "bqBQ",
    "dl": "bqBQ",
    "dr": "bqBQ"
}

var isChecked;
var directions = ["u", "d", "l", "r", "ul", "ur", "dl", "dr"];

// this function returns true if the chosen square is under attack
function findCheck(startingSquare, color){
    isChecked = false;
    for(var i = 0; i < directions.length; i++){
        checkDirection(directions[i], startingSquare, color);
        if(isChecked){
            return true;
        }
    }

    checkForKnight(startingSquare, color);
    if(isChecked){
        return true;
    }

    return false;
}


// these strings give directions to every possible knight move away from the given square
var knightDirections = ["uur", "uul", "llu", "lld", "ddr", "ddl", "rru", "rrd"]; 

function checkForKnight(startSquare, color){
    var location = startSquare.id;
    
    for(var i = 0; i < knightDirections.length; i++){
        var coords = getCoordinates(location);
        var directions = knightDirections[i].split("");
        for(var j = 0; j < directions.length; j++){
            coords = traverseFrom(directions[j], coords);
        }
        var ID = parseCoords(coords);

        if(ID == null) continue;

        var occupation = checkSquare(ID);

        if(occupation == "n" && color == 'white' || occupation == 'N' && color == 'black'){
            isChecked = true;
            return;
        }
    }
}

// checks vertical, horizontal, and diagonals for dangerous pieces
function checkDirection(direction, startSquare, color){
    var location = startSquare.id;
    var coords = getCoordinates(location);

    for(var i = 0; i < 8; i++) {
        var oneStep = traverseFrom(direction,coords);
        var ID = parseCoords(oneStep);

        if(ID == null) return;
        
        var nextOccupation = checkSquare(ID);

        if(nextOccupation != 0 && nextOccupation.toUpperCase() == nextOccupation){
            if(color == 'white'){
                return;
            } else{
                if(i == 0 && closeDangerousPieces[direction].includes(nextOccupation)){
                    isChecked = true;
                }
                else if(farDangerousPieces[direction].includes(nextOccupation)){
                    isChecked = true;
                }
            }
            return;
        }

        if(nextOccupation != 0 && nextOccupation.toLowerCase() == nextOccupation){
            if(color == 'black'){
                return;
            }else{

                if(i == 0 && closeDangerousPieces[direction].includes(nextOccupation)){
                    isChecked = true;
                }
                else if(farDangerousPieces[direction].includes(nextOccupation)){
                    isChecked = true;
                }
            }
            return;
        }
    }
}
const findKing = () => {
    let kingsSquare = board.find(function (kingSquare) {
        if (playerColor == 'white') {
            return kingSquare.occupation == "K";
        } else {
            return kingSquare.occupation == "k";
        }
    })
    kingsSquare
    
}

const isMate = () => {
    //NOTE: possibly redundant steps (seeing if the king can take the piece)
    //check the cordinates to see if it is close (within the kings range)
    //if it is close to the king, check if it is threatened by another enemy piece.
    //if it is not threatened by another piece and is in range of the 

    //see if there is check if not return false
    //if there is check, see if the king can move. if he can, return false
    //find the square ids of each threatening piece and what piece it is. 
    //if there is more than one threatening piece and the king cannot move, return true.
    //check if the square of the threatening piece is threatened by one of your own.
    //if it is a knight, and not threatened, return true. 
    //check if the piece threatening the piece threatening the king can move without putting the king in check.(checkdirection, in relationship to the king skipping the square that the piece is on)
    //if the piece threatening the piece threatening the king can move, return false
    //if it is close to the king, and neither another piece or the king can take it, return true
    //else it is far, get an array of every square between the far threatening piece and the king. 
    // for each square, see if it is threatened by one of your pieces. if that piece can move without putting the king into check, return false.
    //else return true.

}