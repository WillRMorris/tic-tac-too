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