const router = require('express').Router();

router.ws('/', (ws, req) => {
    ws.on('message', msg => {
      console.log(msg);
    })
  
    ws.on('close', () => {
      console.log('websocket was closed')
    })
})



module.exports = router;