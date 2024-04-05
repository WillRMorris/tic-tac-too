const router = require('express').Router();
const WebSocket = require('ws');
const {checkForGameOver, GameStates} = require('../../utils/tictactoeHelpers');
const shortid = require('shortid');


const availableRandomGames = [];

const currentGames = [];

function game() {
    this.gameId = null;
    this.xAvailable = true;
    this.oAvailable = true;
    this.allReady = false;
}

const MessageTypes ={
    GAMEDATA: "GAMEDATA",
    READY: "READY",
    START: "START"
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

const handleReadyMessage = (wss, ws, gameId) =>{
    const returnData ={
        messageType: MessageTypes.READY,
        error: null
    }

    const serverData = currentGames.find((thisGame) => {
        return thisGame.gameId == gameId;
    })

    if(!serverData.xAvailable && !serverData.oAvailable){
        returnData.error = "Too many players";
    }
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
    else if(serverData.xAvailable){
        returnData.playerId = 1;
        returnData.allReady = true;
        serverData.allReady = true;
        serverData.xAvailable = false;
    }
    else{
        returnData.playerId = -1;
        returnData.allReady = true;
        serverData.allReady = true;
        serverData.oAvailable = false;
    }

    ws.send(JSON.stringify(returnData));

    if(serverData.allReady){
        currentGames.splice(currentGames.indexOf(serverData),1);
        sendToClients(wss, {messageType:MessageTypes.START});
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

router.get('/newId', async (req, res) => {
    const newGameId = shortid.generate();
    availableRandomGames.push(newGameId);

    const newGame = new game;
    newGame.gameId = newGameId;
    currentGames.push(newGame);

    res.json(newGameId);
});

router.get('/getRandomId', async (req, res) => {
    if(availableRandomGames.length == 0){
        res.json("No games available");
        return;
    }

    const gameId = availableRandomGames[0];
    availableRandomGames.shift();
    res.json(gameId);
})

module.exports = router;