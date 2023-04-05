const express = require('express')
const router = express.Router();
const Question = require('../models/question')
const jwt = require('jsonwebtoken')
const verifyBlackList = require('./verifyJWT')

const User = require('../models/user') //later put this in another route


router.get('/', verifyBlackList, (req,res) => {
        const myError = req.query.myError;
        res.render('addHTML', { myError })
})

router.post('/', verifyBlackList, async (req,res) =>{
    const question = new Question({
        question: req.body.question,
        answer: req.body.answer,
        false1: req.body.false1,
        false2: req.body.false2,
        false3: req.body.false3
    })
    if (question.false1 === question.false2 || question.false1 === question.false3 || question.false2 === question.false3){
        const myError = 'Error completing the form.'
        return res.redirect('/add?myError=' + myError)
    }
    try{
        const newQ = await question.save()
        //res.send('Question received. Thank you.')
        res.redirect('/add')
    }catch(err){
        res.status(400).json({message: err.message})
    }    
})

router.get('/resetScores', verifyBlackList, async (req,res) => {
    try{
        const allUsers = await User.find()
        allUsers.forEach(usr => {
            usr.user_score = 0
            try{
                usr.save()                
            }catch(er){
                res.status(501).json({message: er.message})
            }
        })    
        const myError = 'Scores have been set to 0. New event.'
        res.redirect('/add?myError=' + myError);
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router;