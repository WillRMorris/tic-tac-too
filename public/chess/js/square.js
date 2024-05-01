var promotionMenu = document.getElementById("promotionMenu");

// this dictionary allows us to get a reference to the image file from a letter
var spriteDictionary = {
    "r": "../../chess/sprites/blackRook.svg",
    "R": "../../chess/sprites/whiteRook.svg",
    "n": "../../chess/sprites/blackKnight.svg",
    "N": "../../chess/sprites/whiteKnight.svg",
    "b": "../../chess/sprites/blackBishop.svg",
    "B": "../../chess/sprites/whiteBishop.svg",
    "k": "../../chess/sprites/blackKing.svg",
    "K": "../../chess/sprites/whiteKing.svg",
    "q": "../../chess/sprites/blackQueen.svg",
    "Q": "../../chess/sprites/whiteQueen.svg",
    "p": "../../chess/sprites/blackPawn.svg",
    "P": "../../chess/sprites/whitePawn.svg"
}

// Each square on the board will have a copy of this class. It contains variables and methods the squares will need
class Square{
    constructor(id, occupation, enPassant, el, canMoveTo){
        this.id = id;
        this.occupation = occupation;
        this.enPassant = enPassant;
        this.el = el;
        this.canMoveTo = false;
        this.canCastleTo = false;
        this.canPromote = false;
    }

    // this method sets the sprite on the board based on the occupation variable
    setSprite(){
        if(this.occupation == "0"){
            this.el.innerHTML = this.id;
        }
        else{
            this.el.innerHTML = this.id + "<img class= 'piece-img' src=" + spriteDictionary[this.occupation] + ">"
        }
    }

    // this method is called whenever a square is clicked on and decides what to do based on various circumstances
    getClicked(event){
        // if it is not the players turn nothing happens so the method ends early
        if(!isMyTurn()) return;

        var square = event.target.square;

        // this moves the rook if clicking on this square would result in castling
        if(square.canCastleTo){
            switch(square.id){
                case 'g1':
                    var fromSquare = document.getElementById("h1").square;
                    var toSquare = document.getElementById("f1").square;
                    break;
                case 'c1':
                    var fromSquare = document.getElementById("a1").square;
                    var toSquare = document.getElementById("d1").square;
                    break;
                case 'g8':
                    var fromSquare = document.getElementById("h8").square;
                    var toSquare = document.getElementById("f8").square;
                    break;
                case 'c8':
                    var fromSquare = document.getElementById("a8").square;
                    var toSquare = document.getElementById("d8").square;
                    break;

            }
            castlesAvailable = castlesAvailable.replace("Q", "");
            castlesAvailable = castlesAvailable.replace("K", "");
            castlesAvailable = castlesAvailable.replace("q", "");
            castlesAvailable = castlesAvailable.replace("k", "");
            movePiece(fromSquare, toSquare);
        }

        // if square can be moved to then move to that square
        if(square.canMoveTo){
            movePiece(selectedSquare, square);
            var kingsSquare = board.find(function(kingSquare){
                if( playerColor == 'white'){
                    return kingSquare.occupation == "K";
                }else{
                    return kingSquare.occupation == "k";
                }
            })

            // this sets up black to be able to en passant us after we move a pawn 2 squares
            incomingEnPassant(selectedSquare, square);

            
            if(findCheck(kingsSquare, getPiece(kingsSquare.occupation).color)){
                showMessage("Cannot Move Into Check");
                readFen(startTurnPosition);
                return;
            }
            
            // this checks if a pawn is moving into the back rank and then pulls up the promotion menu
            if(square.canPromote){
                gameState = GameState.PROMOTINGPAWN;
                promotionMenu.style.display = "block";
                promotionSquare = square;
                return;
            }
            
            // this finds if we just performed an en passant and kills the pawn behind our pawn
            if(square.enPassant){
                var coordinates = getCoordinates(square.id);
                coordinates[1] = 5;
                var targetSquare = getSquareByID(parseCoords(coordinates));
                targetSquare.occupation = 0;
                targetSquare.setSprite();
            }

            clearAllSquares();
            endTurn(writeFen(playerColor == 'black'));
            return;
        }

        clearAllSquares();

        // if the square hasa piece that is the players color
        if(getPiece(square.occupation).color == playerColor){
            selectedSquare = square;
            square.el.style.borderColor = Colors.SELECTED;
            square.el.style.borderWidth = BorderWidths.THICK;
            for(var i = 0; i < board.length; i++){
                board[i].enPassant = false;
            }
            highlightMovableSquares(selectedSquare);
        }
    }

    // this function allows us to tell a square whether or not it can be moved to. It should take a bool as an input
    setCanMoveTo(canMoveToInput){
        if(this == selectedSquare) return;
        this.canMoveTo = canMoveToInput;
        if(this.canMoveTo){
            this.el.style.borderColor = Colors.CANMOVETO;
            this.el.style.borderWidth = BorderWidths.THICK;
        }
        else{
            this.el.style.borderColor = Colors.DEFAULT;
            this.el.style.borderWidth = BorderWidths.DEFAULT;
        }
    }
}

// this function creates a copy of the Square class and attaches it to every spaces element. It also adds an event listener to call the getClicked method and returns an array of all the spaces
function generateBoard () {
    var squares = document.getElementsByClassName('spaces');
    var board =[];
    for (var i = 0; i <squares.length; i++){
        var target = squares[i];
        var id  = target.getAttribute('id');
        var create = new Square(id, '0', false, target);
        target.square = create;
        target.addEventListener("click", create.getClicked);
        board.push(create);
    };

    return board;
}


function clearAllSquares(){
    if(selectedSquare != null){
        selectedSquare.el.style.borderColor = Colors.DEFAULT;
        selectedSquare.el.style.borderWidth = BorderWidths.DEFAULT;
        selectedSquare = null;
    }
    for(var i = 0; i < board.length; i++){
        board[i].setCanMoveTo(false);
        board[i].canCastleTo = false;
        board[i].canPromote = false;
    }
}
// just gives us an easy way to grab a square object by its id
function getSquareByID(id){
    var square = board.find( function(element){
        return element.id === id;
    });
    return square;

}