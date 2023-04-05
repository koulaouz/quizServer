const bodyParser = require('body-parser');
const express = require('express')
const router = express.Router();
const User = require('../models/user')

// GET ALL USERS
router.get('/', async (req,res)=>{
    try{
        const users = await User.find()
        res.json(users)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// ADD USER
router.post('/', async (req,res) => {
    const user = new User({
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        user_score: req.body.user_score        
    })
    try{
        const newUser = await user.save();
        res.status(201).json(newUser)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

// Search if player exists in the database
router.post('/search', (req,res) => {
    const this_user_id = req.body.user_id;

    User.findOne({user_id: this_user_id}, (err,user)=>{
        if (err){
            return res.status(500).json({message: 'Error checking user existance'})
        }
        if(user){
            res.status(200).json(user);
        }else{
            return res.status(400).json({message: 'User not found'})
        }
    })
})

//update user_score
router.post('/update', async (req,res) => {
    User.findOne({user_id : req.body.user_id},(error,user) => {
        if (error){
            res.json({message: error.message})
        }else{
            user.user_score += req.body.user_score;
            user.save()
        }
    })
})

// Get the leaderboard information along with current player's position
router.post('/leaderboard', async (req, res) => {
    // ===============
    // TO DO LATER
    // save the top players on a mongo table after every event to reduce server load
    // or let the player access this route once after every event and save that info in an SQLite table
    // ===============
    const topUsers = await  User.find().sort({user_score : -1});
    let pos = -1;
    for (let i=0; i< topUsers.length; i++){
        if (topUsers[i].user_score == req.body.playerScore){
            pos = i;
            break;
        }
    }
    const top10Users = topUsers.slice(0,10);
    // Add the current player's position to the response
    const response = { top10_users: top10Users, currentPosition: pos + 1};

    res.json(response);

  });

module.exports = router;