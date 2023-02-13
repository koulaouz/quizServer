const express = require('express')
const router = express.Router();
const Question = require('../models/question')

// GET ALL QUESTIONS
router.get('/', async (req,res)=>{
    try{
        const questions = await Question.find()
        res.json(questions)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// GET ONE QUESTION
router.get('/:id', (res,req)=>{

})

//CREATE ONE 
router.post('/', async (req,res)=>{
    const question = new Question(
        req.body
    )
    try{
        const newQuestion = await question.save()
        res.status(201).json(newQuestion)
    }catch(err){
        res.status(400).send({message: err.message})
    }
})

//UPDATE ONE 
router.patch('/:id', (res,req)=>{
    
})

//DELETE ONE 
router.post('/:id', (res,req)=>{
    
})

module.exports = router;