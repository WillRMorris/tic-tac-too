const router = require('express').Router();
const { User, Friendship } = require('../../models');
const withAuth = require("../../utils/auth");

router.get('/', async (req, res) => {
    res.render('ttt/tttHome', { logged_in: req.session.logged_in });
});

router.get('/tictactoe', async (req, res) => {
    res.render('ttt/tictactoe', { logged_in: req.session.logged_in });
});

router.get('/tictactoe/:id', async (req, res) => {
    res.render('ttt/tictactoe', { uuid: req.params.id, logged_in: req.session.logged_in, user_id: req.session.user_id });
});


module.exports = router;