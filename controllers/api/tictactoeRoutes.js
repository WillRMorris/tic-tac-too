const router = require('express').Router();
const WebSocket = require('ws');
const {checkForGameOver} = require('../../utils/tictactoeHelpers');

// the express-ws library adds ws as a new type of route like GET or POST
// a ws route is different because it stays active until turned off
// inside of the ws route there are ws.on statements that are called whenever the requirements are met (such as message or close)
router.ws('/:id', (ws, req) => {
    //called whenever a client sends the server a message
    ws.on('message', (gameData) => {
        gameData = JSON.parse(gameData);
        const wss = req.wsInstance.getWss();
        gameData = checkForGameOver(gameData);
        
        sendToClients(wss, gameData);
    })
  
    //called when the websocket is closed
    ws.on('close', () => {
      console.log('websocket was closed')
    })
})

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

module.exports = router;