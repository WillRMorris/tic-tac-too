const router = require('express').Router();
const { User, Friendship } = require('../models');
const withAuth = require("../utils/auth");

router.get('/', async (req, res) => {
    res.render('home', { logged_in: req.session.logged_in });
});

router.get('/tictactoe', async (req, res) => {
    res.render('tictactoe', { logged_in: req.session.logged_in });
});

router.get('/tictactoe/:id', async (req, res) => {
    res.render('tictactoe', { uuid: req.params.id, logged_in: req.session.logged_in, user_id: req.session.user_id });
});

router.get('/login', async (req, res) => {
    res.render('login', { logged_in: req.session.logged_in });
});

router.get('/signUp', async (req, res) => {
    res.render('signup', { logged_in: req.session.logged_in });
});

router.get('/friends', withAuth, async (req, res) => {
    const friendsData = await User.findAll({
        where: {
            id: req.session.user_id,
        },
        include: [{ model: User, as: 'target' }, { model: User, as: 'friend' }]
    }).catch((err) => {
        res.status(400).json(err)
        console.log(err)
    });

    const friendsProcessedData = [];
    if (friendsData[0]) {
        for (let i = 0; i < friendsData[0].dataValues.friend.length; i++) {
            let dataSource = friendsData[0].dataValues.friend[i].dataValues;
            let friendObject = {
                username: dataSource.user_name,
                user_id: dataSource.id,
                friendship_id: dataSource.friendship.dataValues.id,
                friend_id: dataSource.friendship.dataValues.friend_id,
                game_id: dataSource.friendship.dataValues.active_game_id,
                //the wins and losses are reversed because the data is from the perspective of the friend
                ttt_wins: dataSource.friendship.dataValues.ttt_losses,
                ttt_losses: dataSource.friendship.dataValues.ttt_wins,
                ttt_draw: dataSource.friendship.dataValues.ttt_draw
            }
            friendsProcessedData.push(friendObject);
        }
    }

    res.render('friends', { friends: friendsProcessedData, logged_in: req.session.logged_in });
});


module.exports = router;