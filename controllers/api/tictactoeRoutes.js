const router = require('express').Router();
const WebSocket = require('ws');
const {checkForVictory: checkForGameOver, GameStates} = require('../../utils/tictactoe');


router.ws('/', (ws, req) => {
    ws.on('message', (gameData) => {
        gameData = JSON.parse(gameData);
        const wss = req.wsInstance.getWss();
        gameData = checkForGameOver(gameData);
        
        sendToClients(wss, gameData);
    })
  
    ws.on('close', () => {
      console.log('websocket was closed')
    })
})

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