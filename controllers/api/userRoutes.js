const router = require('express').Router();
const {User, Frienship} = require('../../models');

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
    }catch{
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
module.exports = router;