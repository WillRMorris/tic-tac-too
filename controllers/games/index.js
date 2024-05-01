const router = require('express').Router();
const tttRoutes = require('./tttHomeRoutes');
const chessRoutes = require('./chessHomeRoutes')

router.use('/chess', chessRoutes)
router.use('/ttt', tttRoutes);

module.exports = router
