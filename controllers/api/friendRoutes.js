const router = require('express').Router();
const { query } = require('express');
const {User, Friendship} = require('../../models');
// api/friends route
router.get('/friendships', async (req, res) => {
    //finds all friendships includes users
    try{
      const friendsData = await Frienship.findAll({
      })
      res.json(friendsData);
    }
    catch{
      res.status(400).json('err')
  
    }
  });

  router.get('/:id', async (req, res) => {
    //finds all of a users friends includes user table
    try{
      const friendsData = await User.findAll({
          where: {
              id: req.params.id,
            },
            include:[{model: User, as: 'target'}, {model: User, as: 'friend'}]
      })
      res.json(friendsData);
    }
    catch(err){
      res.status(400).json(err)
      console.log(err)
  
    }
  });
  
  router.get('/single/:userId/:friendId', async (req, res) => {
    //finds a specifc friendship between two users by their ids
    try{
      let friendsData = await User.findAll({
        where: {
            id: req.params.userId,
        },
        include:[{model: User, as: 'target'}, {model: User, as: 'friend'}]
      })
       let friend = await specifier(friendsData, req.params.friendId)
      res.json(friend);
    }
    catch(err){
      res.status(400).json(err)
  
    }
  });

  async function specifier(data, val){
    console.log(data);
    let set = await data.json();
    let array = set[0].target;
    for (let user in array){
        if(user.id == val){
            return user;
        }
    }
    return console.log('specifier failed');
    
  }
  module.exports = router;