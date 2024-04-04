const router = require('express').Router();
const WebSocket = require('ws');


router.ws('/', (ws, req) => {
    ws.on('message', (board) => {
        const wss = req.wsInstance.getWss();
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                client.send(board);
            }
        });
    })
  
    ws.on('close', () => {
      console.log('websocket was closed')
    })
})



module.exports = router;