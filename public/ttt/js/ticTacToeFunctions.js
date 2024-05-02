const turnBanner = document.getElementById("turn-message");

const isMyTurn = () => {
    console.log(gameData.gameState);
    console.log(playerId);
    if(playerId == 1 && gameData.gameState == GameStates.PLAYER1TURN) {
        return true;
    }
    if(playerId == -1 && gameData.gameState == GameStates.PLAYER2TURN) {
        return true;
    }
    return false;
}

const switchTurn = () => {
    gameData.movesMade += 1;
    if(gameData.gameState == GameStates.PLAYER1TURN) {
        gameData.gameState = GameStates.PLAYER2TURN;
    }
    else if(gameData.gameState == GameStates.PLAYER2TURN){
        gameData.gameState = GameStates.PLAYER1TURN;
    }
}

const updateBoard = () => {
    for(let i = 0; i < spaces.length; i++){
        switch(gameData.boardArray[spaces[i].getAttribute("data-x")][spaces[i].getAttribute("data-y")]){
            case 0:
                spaces[i].innerHTML = `<img src="/ttt/images/blank.svg">`;
                break;
            case 1:
                spaces[i].innerHTML = `<img src="/ttt/images/x.svg">`;
                break;
            case -1:
                spaces[i].innerHTML = `<img src="/ttt/images/circle.svg">`;
                break;
        }
    }
}

const updateTurnBanner = () =>{
    switch(gameData.gameState){
        case GameStates.WAITING:
            turnBanner.innerText = "Waiting For Game To Start";
            break;
        case GameStates.PLAYER1TURN:
            if(playerId == 1){
                turnBanner.innerText = "Your Turn";
            }
            else{
                turnBanner.innerText = "Waiting For Opponent"
            }
            break;
        case GameStates.PLAYER2TURN:
            if(playerId == -1){
                turnBanner.innerText = "Your Turn";
            }
            else{
                turnBanner.innerText = "Waiting For Opponent";
            }
            break;
        case GameStates.GAMEOVER:
            turnBanner.innerText = "Game Over";
            break;
    }
}