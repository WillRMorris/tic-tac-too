const router = require('express').Router();
const tttRoutes = require('./tttHomeRoutes');

router.use('/ttt', tttRoutes);

module.exports = router
