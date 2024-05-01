const spaces = document.getElementsByClassName("space");
const announcements = document.getElementById("announcements");

// this sets up the url where the web socket will be accessed because express-ws can't use relative urls

//use this version for local testing comment it out before deploying
const tictactoeSocketUrl = 'ws://' + window.location.hostname + ':3001/api/tictactoe/' + uuid;

//use this version for deploy comment it out while testing
// const tictactoeSocketUrl = 'wss://' + window.location.hostname + '/api/tictactoe/' + uuid;

const socket = new WebSocket(tictactoeSocketUrl);

let playerId = 0;

// this variable stores all the possible states the game could be in
const GameState = {
    PLAYER1TURN: "PLAYER1TURN",
    WAITING: "WAITING",
    PLAYER2TURN: "PLAYER2TURN",
    GAMEOVER: "GAMEOVER",
    STALEMATE: "STALEMATE",
    PROMOTINGPAWN: "PROMOTINGPAWN",
}

// every message sent between client and server includes a messageType variable so we can easily know what to do with the message
const MessageTypes ={
    GAMEDATA: "GAMEDATA",
    READY: "READY",
    START: "START",
    CLOSE: "CLOSE",
    FORCECLOSE: "FORCECLOSE"
}

// this object will be passed back and forth between the server and the clients
let gameData = {
    gameId: uuid,
    messageType: MessageTypes.GAMEDATA,
    gameState: GameStates.WAITING,
    fenString: startTurnPosition,
    newMove: null,
    message: "new game",
    movesMade: 0,
    whiteAvailable: true,
    blackAvailable: true,
    winner: null,
    checked: false,
}

// This is called whenever the client recieves a message from the server
// It checks what kind of message it was and decides what to do with it
socket.onmessage = e => {
    let message = JSON.parse(e.data);
    if(message.gameId != gameData.gameId){
        return;
    }

    switch(message.messageType){
        case MessageTypes.GAMEDATA:
            gameDataMessage(message);
            break;
        case MessageTypes.READY:
            playerId = message.playerId;
            if(playerId == 1) {
                playerColor = 'white'
            }else playerColor= 'black'
            break;
        case MessageTypes.START:
            announcements.style.display = "none";
            gameData.gameState = GameStates.PLAYER1TURN;
            updateTurnBanner();
            break;
        case MessageTypes.FORCECLOSE:
            alert("Other player left game");
            document.location.replace('/');
            break;
    }
}

const gameDataMessage = (message) => {
    gameData = message;
    readFen(gameData.fenString)
    updateTurnBanner();
    
    if(gameData.gameState == GameStates.GAMEOVER){
        // updateFriendshipDB(gameData);  
        console.log(gameData.message);
        announcements.innerText = gameData.message;
        announcements.style.display = "block";
    }
}

// this is called when the player clicks on a board position
const makeMove = (event) => {
    if(!isMyTurn()){
        console.log("Not your turn");
        return;
    }

    if(placeholder){
        switchTurn();
        socket.send(JSON.stringify(gameData));
    }
    else{
        console.log("Position already occupied");
    }
}

window.onbeforeunload = () =>{
    closeMessage = {
        messageType: MessageTypes.CLOSE,
        gameId: gameData.gameId
    }

    fetch(`/api/friends/endGame/${gameData.gameId}`, {
        method: 'PUT',
        body: JSON.stringify({
            active_game_id: null
        }),
        headers: { 'Content-Type': 'application/json' }
    })

    socket.send(JSON.stringify(closeMessage));
    socket.close();
}

// setupFriendshipData(); worrying about friendship data later

for(let i = 0; i < spaces.length; i++){
    spaces[i].addEventListener("click", makeMove);
}

readyButton.addEventListener("click", () => {
    announcements.innerText = "Waiting For Other Player";
    readyButton.style.display = "none"
    socket.send(JSON.stringify({messageType: MessageTypes.READY}));
})