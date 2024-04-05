const isMyTurn = () => {
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
    let testingString = "";
    if(isTesting != null){
        testingString = "../"
    }

    for(let i = 0; i < spaces.length; i++){
        switch(gameData.boardArray[spaces[i].getAttribute("data-x")][spaces[i].getAttribute("data-y")]){
            case 0:
                spaces[i].innerHTML = `<img src="${testingString}images/blank.svg">`;
                break;
            case 1:
                spaces[i].innerHTML = `<img src="${testingString}images/x.svg">`;
                break;
            case -1:
                spaces[i].innerHTML = `<img src="${testingString}images/circle.svg">`;
                break;
        }
    }
}