const router = require('express').Router();
const userRoutes = require('./userRoutes');

const friendRoutes = require('./friendRoutes');
const tictactoeRoutes = require('./tictactoeRoutes');

router.use('/user', userRoutes);
router.use('/friends', friendRoutes);
router.use('/tictactoe', tictactoeRoutes)


module.exports = router;