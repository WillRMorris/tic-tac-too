const router = require('express').Router();
const userRoutes = require('./userRoutes');
const tictactoeRoutes = require('./tictactoeRoutes');

router.use('/user', userRoutes);
router.use('/tictactoe', tictactoeRoutes)

module.exports = router;