const router = require('express').Router();
const { User, Friendship } = require('../../models');
const withAuth = require("../../utils/auth");

router.get('/', async (req, res) => {
    res.render('chess/chessHome', { logged_in: req.session.logged_in });
});

router.get('/board', async (req, res) => {
    res.render('chess/chessBoard', { logged_in: req.session.logged_in });
});

router.get('/board/:id', async (req, res) => {
    res.render('chess/chessBoard', { uuid: req.params.id, logged_in: req.session.logged_in, user_id: req.session.user_id });
});

module.exports = router;