const router = require('express').Router();
const apiRoutes = require('./api');
const gamesRoutes = require('./games/gameRoutes');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes)
router.use('/api', apiRoutes);
router.use('/games', gamesRoutes);

module.exports = router;