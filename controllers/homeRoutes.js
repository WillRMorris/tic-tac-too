const router = require('express').Router();

router.get('/', async (req,res) => {
    res.render('home', {logged_in: req.session.logged_in});
})

router.get('/tictactoe', async (req,res) => {
    res.render('tictactoe', {logged_in: req.session.logged_in});
});

router.get('/login', async (req, res) => {
    res.render('login', {logged_in: req.session.logged_in});
})

router.get('/signUp', async (req, res) => {
    res.render('signUp', {logged_in: req.session.logged_in});
})

module.exports = router;