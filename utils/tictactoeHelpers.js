const GameStates ={
    PLAYER1TURN: "PLAYER1TURN",
    PLAYER2TURN: "PLAYER2TURN",
    GAMEOVER: "GAMEOVER",
    WAITING: "WAITING"
}

const checkForGameOver = (gameData) => {

    //check for draw
    if(gameData.movesMade >= 9){
        gameData.gameState = GameStates.GAMEOVER;
        gameData.message = "Draw!";
        return gameData;
    }

    //check vertical
    let counter = 0;
    for(let i = 0; i < 3; i++){
        counter += gameData.boardArray[gameData.newMove[0]][i];
    }
    let results = showResults(gameData,counter);
    if(results[1]){
        return results[0];
    }

    //check horizontal
    counter = 0;
    for(let i = 0; i < 3; i++){
        counter += gameData.boardArray[i][gameData.newMove[1]];
    }
    results = showResults(gameData,counter);
    if(results[1]){
        return results[0];
    }

    //check first diag
    counter = 0;
    for(let i = 0; i < 3; i++){
        counter += gameData.boardArray[i][i];
    }
    results = showResults(gameData,counter);
    if(results[1]){
        return results[0];
    }

    //check other diag
    counter = 0;
    for(let i = 0; i < 3; i++){
        counter += gameData.boardArray[i][2-i];
    }
    results = showResults(gameData,counter);
    if(results[1]){
        return results[0];
    }

    return gameData;
}

const showResults = (gameData, counter) => {
    if(Math.abs(counter) == 3){
        gameData.gameState = GameStates.GAMEOVER;
        if(counter > 0){
            gameData.message = "X's Win!";
        }
        else{
            gameData.message = "O's Win!";
        }
        return [gameData, true];
    }
    return [gameData, false];
}

module.exports = {checkForGameOver, GameStates};