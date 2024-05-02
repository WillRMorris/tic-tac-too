//pieces logic below
function getPiece(fenID) {
    let piece;
    //will eventually have cases for each piece. Given a FenID grabs the appropriate piece class.
    switch (fenID) {
        case 'p':
        case 'P':
            piece = new pawn(fenID);
            return piece;
        case 'r':
        case 'R':
            piece = new rook(fenID);
            return piece;
        case 'n':
        case 'N':
            piece = new knight(fenID);
            return piece;
        case 'b':
        case 'B':
            piece = new bishop(fenID);
            return piece;
        case 'k':
        case 'K':
            piece = new king(fenID);
            return piece;
        case 'q':
        case 'Q':
            piece = new queen(fenID);
            return piece;
        default:
            return;
    }
}




class pawn {
    constructor(fenID) {
        if (fenID == 'P') {

            this.color = 'white';
        }
        else {
            this.color = 'black'
        }
    }

    normal(direction){
        let location = startSquare.id;
        let coords = getCoordinates(location);
            let oneUp = traverseFrom(direction, coords.slice());
            coords = getCoordinates(location);
            let nextOccupation = checkSquare(parseCoords(oneUp));
            //checks for a piece blocking the regular move
            if (nextOccupation == '0') {

                let regularMove = document.getElementById(parseCoords(oneUp)).square;
                regularMove.setCanMoveTo(true);
                if (coords[1] == 7) {
                    regularMove.canPromote = true;
                }

                let twoUp = traverseFrom(direction, oneUp);
                coords = getCoordinates(location);
                let twoBlocksUp = checkSquare(parseCoords(twoUp));

                //if it has not moved forward and the spot is not taken it can move two
                if (coords[1] == '2' && twoBlocksUp == '0') {
                    let firstAllowed = document.getElementById(parseCoords(twoUp)).square;
                    firstAllowed.setCanMoveTo(true);
                }
            }
    }
    //gets and displays all available pawn moves given a square
    getMoves(startSquare) {
        if(this.color == 'white'){
            this.normal('u');
            this.checkDiagonals(startSquare, 'ur', 'ul');
        }
        else{
            this.normal('d');
            this.checkDiagonals(startSquare, 'dr', 'dl');
        }

    }
    //checks diagonals to see if they exist, and occupied by an enemy peice if they are, the moves are available.
    checkDiagonals(startSquare, right, left) {

            let location = startSquare.id;
            let coords = getCoordinates(location);

            let diagRight = traverseFrom(right, coords);
            coords = getCoordinates(location);
            let targetRight = checkSquare(parseCoords(diagRight));
            let rightSquare = getPiece(targetRight);


            let diagLeft = traverseFrom(left, coords);
            coords = getCoordinates(location);
            let targetLeft = checkSquare(parseCoords(diagLeft));
            let leftSquare = getPiece(targetLeft);

            //checks right
            if (parseCoords(diagRight) == enPassantSquare) {
                let captureRight = document.getElementById(parseCoords(diagRight)).square;
                captureRight.setCanMoveTo(true);
                captureRight.enPassant = true;
            }
            else if ((rightSquare != undefined && rightSquare != null && rightSquare.color != this.color)) {
                let captureRight = document.getElementById(parseCoords(diagRight)).square;
                captureRight.setCanMoveTo(true);
                if (coords[1] == 7) {
                    captureRight.canPromote = true;
                }
                console.log('right Checked');
            }
            //checksLeft
            if (parseCoords(diagLeft) == enPassantSquare) {
                let captureLeft = document.getElementById(parseCoords(diagLeft)).square;
                captureLeft.setCanMoveTo(true);
                captureLeft.enPassant = true;
            }
            else if (leftSquare != undefined && leftSquare != null && leftSquare.color != this.color) {
                let captureLeft = document.getElementById(parseCoords(diagLeft)).square;
                captureLeft.setCanMoveTo(true);
                if (coords[1] == 7) {
                    captureLeft.canPromote = true;
                }
                console.log('left Checked');
        }
    }
}
//checks en passant for
function checkEnPassant(selectedSquare, square) {
    let selectedCoords = getCoordinates(selectedSquare.id);
    let newCoords = getCoordinates(square.id);
    let num = selectedCoords[1]
    let numTwo = newCoords[1];
    let eq = numTwo - num;

    if (square.occupation == 'P' && eq == 2) {
        enPassantSquare = parseCoords(traverseFrom('u', selectedCoords));
        console.log('enpassante ' + enPassantSquare);
    } else if(square.occupation == 'p' && eq == -2){
        enPassantSquare = parseCoords(traverseFrom('d', selectedCoords));
        console.log('enpassante ' + enPassantSquare);
    }
}
// this can be used to find pieces along any direction so it works for bishops, rooks, and queens
function getDirection(direction, startSquare) {
    let location = startSquare.id;
    let coords = getCoordinates(location);

    for (var i = 0; i < 8; i++) {
        let oneStep = traverseFrom(direction, coords);
        let ID = parseCoords(oneStep);

        if (ID == null) return;

        let nextOccupation = checkSquare(ID);
        if (nextOccupation == 0) {
            let nextSquare = document.getElementById(ID).square;
            nextSquare.setCanMoveTo(true);
        } else if (nextOccupation.toLowerCase() == nextOccupation) {
            let nextSquare = document.getElementById(ID).square;
            nextSquare.setCanMoveTo(true);
            return;
        } else {
            return;
        }
    }
}

class rook {
    constructor(fenID) {
        this.fenId = fenID;
        if (fenID == 'R') {
            this.color = "white";
        } else {
            this.color = "black";
        }
    }
    //gets and displays all available rook moves given a square
    getMoves(startSquare) {
            getDirection("u", startSquare);
            getDirection("d", startSquare);
            getDirection("l", startSquare);
            getDirection("r", startSquare);
    }
}

class bishop {
    constructor(fenID) {
        this.fenId = fenID;
        if (fenID == 'B') {
            this.color = "white";
        } else {
            this.color = "black";
        }
    }
    //gets and displays all available bishop moves given a square
    getMoves(startSquare) {
            getDirection("ul", startSquare);
            getDirection("ur", startSquare);
            getDirection("dl", startSquare);
            getDirection("dr", startSquare);
        
    }
}

class queen {
    constructor(fenID) {
        this.fenId = fenID;
        if (fenID == 'Q') {
            this.color = "white";
        } else {
            this.color = "black";
        }
    }
    //gets and displays all available queen moves given a square
    getMoves(startSquare) {
            getDirection("u", startSquare);
            getDirection("d", startSquare);
            getDirection("l", startSquare);
            getDirection("r", startSquare);
            getDirection("ul", startSquare);
            getDirection("ur", startSquare);
            getDirection("dl", startSquare);
            getDirection("dr", startSquare);

    }
}

// this sets up an array of all the squares that must be clear for castling to occur
let whiteCastleSquaresIDs = ["b1", "c1", "d1", "f1", "g1"];
let blackCastleSquaresIDs = ["b8", "c8", "d8", "f8", "g8"];
let whiteCastleSquares = [];
let blackCastleSquares = [];
for (var i = 0; i < castleSquaresIDs.length; i++) {
    let  whiteCastleSquare = document.getElementById(whiteCastleSquaresIDs[i]).square;
    let  blackCastleSquare = document.getElementById(blackCastleSquaresIDs[i]).square;
    whiteCastleSquare.push(whiteCastleSquare);
    blackCastleSquares.push(blackCastleSquare);

}
var e1Square = document.getElementById("e1").square;

class king {
    constructor(fenID) {
        if (fenID == 'K') {

            this.color = 'white';
        }
        else {
            this.color = 'black'
        }
    }

    getMoves(startSquare) {

            this.getOneSpace("u", startSquare);
            this.getOneSpace("d", startSquare);
            this.getOneSpace("l", startSquare);
            this.getOneSpace("r", startSquare);
            this.getOneSpace("ur", startSquare);
            this.getOneSpace("ul", startSquare);
            this.getOneSpace("dr", startSquare);
            this.getOneSpace("dl", startSquare);
            this.getCastle();
    }

    getOneSpace(direction, startSquare) {
        let location = startSquare.id;
        let coords = getCoordinates(location);

        let oneStep = traverseFrom(direction, coords);
        let ID = parseCoords(oneStep);

        if (ID == null) return;

        let nextOccupation = checkSquare(ID);
        if (nextOccupation == 0) {
            let nextSquare = document.getElementById(ID).square;
            nextSquare.setCanMoveTo(true);
        } else if (nextOccupation.toLowerCase() == nextOccupation && this.color == 'white') {
            let nextSquare = document.getElementById(ID).square;
            nextSquare.setCanMoveTo(true);
        } else if(/^[A-Z]+$/.test(nextOccupation) && this.color == 'black'){
            let nextSquare = document.getElementById(ID).square;
            nextSquare.setCanMoveTo(true);
        }
    }

    // this method uses the array set up above to check if the relevant squares are clear and allow castling
    getCastle() {
        if (findCheck(e1Square, this.color)) return;
        if(this.color = 'white'){


                let queenCastle = true;
                for (var i = 0; i < 3; i++) {
                    if (whiteCastleSquares[i].occupation != "0" || findCheck(whiteCastleSquares[i], 'white')) {
                        queenCastle = false;
                        break;
                    }
                }
                if (queenCastle) {
                    whiteCastleSquares[1].setCanMoveTo(true);
                    whiteCastleSquares[1].canCastleTo = true;
                }
                let kingCastle = true;
                for (var i = 3; i < 5; i++) {
                    if (whiteCastleSquares[i].occupation != "0" || findCheck(whiteCastleSquares[i], 'white')) {
                        kingCastle = false;
                        break;
                }
                if (kingCastle) {
                    whiteCastleSquares[4].setCanMoveTo(true);
                    whiteCastleSquares[4].canCastleTo = true;
                }
            }
        } else {
                let queenCastle = true;
                for (var i = 0; i < 3; i++) {
                    if (blackCastleSquares[i].occupation != "0" || findCheck(blackCastleSquares[i], 'black')) {
                        queenCastle = false;
                        break;
                    }
                }
                if (queenCastle) {
                    blackCastleSquares[1].setCanMoveTo(true);
                    blackCastleSquares[1].canCastleTo = true;
                }
            
                let kingCastle = true;
                for (var i = 3; i < 5; i++) {
                    if (blackCastleSquares[i].occupation != "0" || findCheck(blackCastleSquares[i], 'black')) {
                        kingCastle = false;
                        break;
                    }
                }
                if (kingCastle) {
                    blackCastleSquares[4].setCanMoveTo(true);
                    blackCastleSquares[4].canCastleTo = true;
                }
            }
        }
    
    }
    
class knight {
    constructor(fenID) {
        if (fenID == 'N') {

            this.color = 'white';
        }
        else {
            this.color = 'black'
        }
    }

    getMoves(startSquare) {
            let knightDirections = ["uur", "uul", "llu", "lld", "ddr", "ddl", "rru", "rrd"];

            for (var i = 0; i < knightDirections.length; i++) {
                let coordinates = getCoordinates(startSquare.id);
                let destination = traverseFrom(knightDirections[i], coordinates);

                let ID = parseCoords(destination);

                if (ID == null) continue;

                let nextOccupation = checkSquare(ID);

                if (nextOccupation == 0) {
                    let nextSquare = document.getElementById(ID).square;
                    nextSquare.setCanMoveTo(true);
                } else if (nextOccupation.toLowerCase() == nextOccupation) {
                    let nextSquare = document.getElementById(ID).square;
                    nextSquare.setCanMoveTo(true);
                }
            }

        }
    }
