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
        user_score: req.body.user_score        
    })
    try{
        const newUser = await user.save();
        res.status(201).json(newUser)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

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

module.exports = router;