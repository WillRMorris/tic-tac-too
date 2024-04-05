const testButtons = document.getElementsByClassName("test-button");

// this sets up the url where the web socket will be accessed because express-ws can't use relative urls
const gameId = 1;
const tictactoeSocketUrl = 'ws://' + window.location.hostname + ':3001/api/tictactoe/' + gameId;
const socket = new WebSocket(tictactoeSocketUrl);

// this variable stores all the possible states the game could be in
const GameStates ={
    PLAYER1TURN: "PLAYER1TURN",
    PLAYER2TURN: "PLAYER2TURN",
    GAMEOVER: "GAMEOVER"
}

// this object will be passed back and forth between the server and the clients
let gameData = {
    gameState: GameStates.PLAYER1TURN,
    boardArray: [[0,0,0],[0,0,0],[0,0,0]],
    newMove: null,
    message: "new game",
    movesMade: 0
}

// socket.onopen = () => {
//   socket.send('Here\'s some text that the server is urgently awaiting!'); 
// }

// This is called whenever the client recieves a message from the server
socket.onmessage = e => {
    gameData = JSON.parse(e.data);
    
    console.log('New Board:');
    console.log(gameData.boardArray[0][0], gameData.boardArray[1][0], gameData.boardArray[2][0]);
    console.log(gameData.boardArray[0][1], gameData.boardArray[1][1], gameData.boardArray[2][1]);
    console.log(gameData.boardArray[0][2], gameData.boardArray[1][2], gameData.boardArray[2][2]);
    
    if(gameData.gameState == GameStates.GAMEOVER){
        console.log(gameData.message);
    }
}

// this is called when the player clicks on a board position
const makeMove = (event) => {
    if(!isMyTurn()){
        console.log("Not your turn");
        return;
    }

    const xCoord = event.currentTarget.getAttribute("data-x");
    const yCoord = event.currentTarget.getAttribute("data-y");
    gameData.newMove = [xCoord, yCoord];

    if(gameData.boardArray[xCoord][yCoord] == 0){
        gameData.boardArray[xCoord][yCoord] = playerId;
        switchTurn();
        socket.send(JSON.stringify(gameData));
    }
    else{
        console.log("Position already occupied");
    }
}

for(let i = 0; i < testButtons.length; i++){
    testButtons[i].addEventListener("click", makeMove);
}