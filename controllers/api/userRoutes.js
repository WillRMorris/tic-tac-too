const router = require('express').Router();
const {User, Friendship} = require('../../models');

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne(
          { 
              where: { user_name: req.body.user_name } 
          });
    

        if (!userData) {
          res
            .status(400)
            .json({ message: 'No user with this username' });
          return;
        }
    
        const validPassword = await userData.checkPassword(req.body.password);

        console.log(validPassword);
    
        if (!validPassword) {
          res
            .status(400)
            .json({ message: 'Incorrect username or password, please try again' });
          return;
        }
    
        req.session.save(() => {
          req.session.user_id = userData.dataValues.id;
          req.session.logged_in = true;
          res.json({ user: userData, message: 'You are now logged in!' });
        });
    
    } 
    catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req,res) => {
    if(req.session.logged_in){
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else{
        res.status(404).end();
    }
});

router.post('/signUp', async (req,res) => {
    try{
        const userData = await User.create(req.body);
      
        req.session.save(() => {
          req.session.user_id = userData.dataValues.id;
          req.session.logged_in = true;
          res.json({ user: userData, message: 'You are now logged in!' });
        });
    }catch(err){
      res.status(400).json(err);
    }
});

router.get('/:id', async (req, res)=>{
  try{
    const userData = await User.findByPk(req.params.id, {exclude: 'password'})
    res.json(userData);
  }
  catch(err){
    res.status(400).json(err);

  }
})

//updates user. Checks for a frienndIds in the req.body. if it exists, bulk create friendships for every relationship (both ways so two per pair one for each as the user)
router.put('/:id', async (req, res) =>{
  try{
    const userData = await User.update(req.body, {where: {id: req.params.id}})
    if(req.body.friendIds && req.body.friendIds.length){
      //some variables to make this a little neater
      let user = req.params.id;
      let friends = req.body.friendIds;

      let friendsData= [];
      for (let i = 0; i < friends.length; i++){
        let asUser = {
          user_id: user,
          friend_id: friends[i]
        }
        friendsData.push(asUser);

        let asFriend = {
          user_id: friends[i],
          friend_id: user
        }
      friendsData.push(asFriend);
      }
      return await Friendship.bulkCreate(friendsData);
    }

    res.json(userData)
  }
  catch(err){
    res.status(400).json(err);
    console.log(err)
  }
})

router.get('/byname/:username', async (req, res) =>{
  try{

    const userData = await User.findOne( {where: {
      user_name: req.params.username
    }})

    res.json(userData);
  }
  catch(err){
    res.status(400).json(err);
    console.log(err)
  }
})
module.exports = router;