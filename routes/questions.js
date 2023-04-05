const express = require('express')
const router = express.Router();
const Question = require('../models/question')

const verifyAPIKey = (req,res,next) => {
    const apiKey = req.headers['x-api-key']

    if (!apiKey || apiKey != process.env.QUESTIONS_TOKEN){
        return res.send('ERROR IN QUESTIONS LOADING')
    }

    next();
}

// GET -20- QUESTIONS
router.get('/', verifyAPIKey, async (req,res)=>{
    try{
        //const questions = await Question.find()
        const questions = await Question.aggregate([{ $sample: {size:20}}])
        console.log('questions sent')
        res.json(questions)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})



//CREATE ONE
// router.post('/', async (req,res)=>{
//     const question = new Question(
//         req.body
//     )
//     try{
//         const newQuestion = await question.save()
//         res.status(201).json(newQuestion)
//     }catch(err){
//         res.status(400).send({message: err.message})
//     }
// })

module.exports = router;