const router = require('express').Router();

router.get('/tictactoe', async (req,res) => {
    res.render('tictactoe');
});

module.exports = router;