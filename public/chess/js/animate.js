var movingPiece = document.getElementById("movingPiece");

// this variable is used any place where things wait for the animation to end
var animateTime = 0.3;

// this function shows the movingPiece element moving from the start square to the destination square
function animate(fromSquare, toSquare){
    // set the moving piece image to the correct piece
    movingPiece.innerHTML = "d1" + "<img src=" + spriteDictionary[fromSquare.occupation] + ">";
    
    //instantly teleport to the start square and then get displayed
    movingPiece.style.transition = "none";
    var coordinates = getDocumentCoordinates(fromSquare.el);
    movingPiece.style.left = coordinates.left + "px";
    movingPiece.style.top = coordinates.top + "px";
    movingPiece.style.display = "block";

    // move to the destination square with animation turned on
    movingPiece.style.transition = "all " + animateTime + "s ease";
    coordinates = getDocumentCoordinates(toSquare.el);
    movingPiece.style.left = coordinates.left + "px";
    movingPiece.style.top = coordinates.top + "px";

    // after done moving hide the movingPiece element
    setTimeout(function (){
        movingPiece.style.display = "none";
    }, animateTime * 1000);
}

// the getBoundingClientRect returns the screen coordinates which change as people scroll
// this function converts that to document coordinates that are independant of scrolling
function getDocumentCoordinates(element){
    var windowCoords = element.getBoundingClientRect();
    var documentCoords ={
        top: windowCoords.top + window.scrollY,
        left:windowCoords.left +window.scrollX
    }
    return documentCoords;
}