const router = require('express').Router();
const WebSocket = require('ws');
const {checkForGameOver, GameStates} = require('../../utils/tictactoeHelpers');
const shortid = require('shortid');

//this array keeps track of the uid for random games that are waiting for a second player to join
const availableRandomGames = [];

//this array keeps track of games that have a second player, but that haven't had both players press ready yet
const currentGames = [];

//the currentGames array is an array of this function
//this function is used to store and communicate information neccessary to set up the initial game state
function game() {
    this.gameId = null;
    this.xAvailable = true;
    this.oAvailable = true;
    this.allReady = false;
}

// every message sent between client and server includes a messageType variable so we can easily know what to do with the message
const MessageTypes ={
    GAMEDATA: "GAMEDATA",
    READY: "READY",
    START: "START",
    CLOSE: "CLOSE"
}

// the express-ws library adds ws as a new type of route like GET or POST
// a ws route is different because it stays active until turned off
// inside of the ws route there are ws.on statements that are called whenever the requirements are met (such as message or close)
router.ws('/:id', (ws, req) => {
    
    //called whenever a client sends the server a message
    ws.on('message', (message) => {
        const wss = req.wsInstance.getWss();
        message = JSON.parse(message);

        switch(message.messageType){
            case MessageTypes.GAMEDATA:
                handleGameDataMessage(wss, message);
                break;
            case MessageTypes.READY:
                handleReadyMessage(wss, ws, req.params.id);
                break;
            case MessageTypes.CLOSE:
                handleCloseMessage(message);
                break;
        }
    })

    ws.on('open', () => {
        console.log("websocket opened");
    })

    //called when the websocket is closed
    ws.on('close', () => {
      console.log('websocket was closed')
    })
});

const handleGameDataMessage = (wss, gameData) =>{
    gameData = checkForGameOver(gameData);
    sendToClients(wss, gameData);
}

// this is called when a client sends the server a message saying they are ready
// this happens when the player presses the ready button
const handleReadyMessage = (wss, ws, gameId) =>{
    // this object will eventually be sent to the client
    const returnData ={
        gameId: gameId,
        messageType: MessageTypes.READY,
        error: null
    }

    // find the correct game from the currentGames array
    const serverData = currentGames.find((thisGame) => {
        return thisGame.gameId == gameId;
    })

    // if X's and O's have already been assigned players give an error
    if(!serverData.xAvailable && !serverData.oAvailable){
        returnData.error = "Too many players";
    }
    // if both X's and O's are available, randomly assign one to the client
    else if(serverData.xAvailable && serverData.oAvailable){
        const randNum = Math.random();
        if(randNum > 0.5){
            returnData.playerId = 1;
            serverData.xAvailable = false;
        }
        else{
            returnData.playerId = -1;
            serverData.oAvailable = false;
        }
    }
    // if O's have been taken, assign the client X's
    // Both clients have now pressed ready so set the allReady variable to true
    else if(serverData.xAvailable){
        returnData.playerId = 1;
        returnData.allReady = true;
        serverData.allReady = true;
        serverData.xAvailable = false;
    }
    // if X's have been taken, assign the client O's
    // Both clients have now pressed ready so set the allReady variable to true
    else{
        returnData.playerId = -1;
        returnData.allReady = true;
        serverData.allReady = true;
        serverData.oAvailable = false;
    }

    // send return data to client
    ws.send(JSON.stringify(returnData));

    // if both clients are ready remove game from currentGames array and send start message to clients
    if(serverData.allReady){
        currentGames.splice(currentGames.indexOf(serverData),1);
        sendToClients(wss, {gameId: gameId, messageType:MessageTypes.START});
    }
}

const handleCloseMessage = (message) =>{
    const availableIndex = availableRandomGames.indexOf(message.gameId);
    if(availableIndex != undefined){
        availableRandomGames.splice(availableIndex, 1);
    }
    const currentIndex = currentGames.find((entry) => {
        return entry.gameId == message.gameId;
    })
    if(currentIndex != undefined){
        currentGames.splice(currentIndex, 1);
    }
}

//This function sends a message to all clients
//it can accept either an object or an array of objects
const sendToClients = (wss, contents) => {
    if(contents.length){
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                contents.forEach(element => {
                    client.send(JSON.stringify(element));
                });
            }
        });
    }
    else{
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(contents));
            }
        });
    }
}

// called when a client pressses the Host Random Opponent button
// creates new gameId and adds it to availableRandomGames
// creates new game object and adds it to currentGames
router.get('/newId', async (req, res) => {
    const newGameId = shortid.generate();
    availableRandomGames.push(newGameId);

    const newGame = new game;
    newGame.gameId = newGameId;
    currentGames.push(newGame);

    res.json(newGameId);
});

// called when a client presses the Join Random Game Button
// gives them the gameId of the first game in availableRandomGames and removes it from the array
// if there are no games available it makes a new one
router.get('/getRandomId', async (req, res) => {
    if(availableRandomGames.length == 0){
        const newGameId = shortid.generate();
        availableRandomGames.push(newGameId);
    
        const newGame = new game;
        newGame.gameId = newGameId;
        currentGames.push(newGame);
    
        res.json(newGameId);
        return;
    }

    const gameId = availableRandomGames[0];
    availableRandomGames.shift();
    res.json(gameId);
});

//called when creating a new game between two friends
router.get('/newPrivateId', async (req, res) => {
    const newGameId = shortid.generate();

    const newGame = new game;
    newGame.gameId = newGameId;
    currentGames.push(newGame);

    res.json(newGameId);
});

module.exports = router;