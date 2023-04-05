const express = require('express')
const router = express.Router();
const Question = require('../models/question')
const cron = require('cron');
const { default: mongoose } = require('mongoose');

//EVENT: once every week send 10 questions

const eventSchema = new mongoose.Schema({
    question: String,    
    answer: String,
    false1: String,
    false2: String,
    false3: String
})

const Event = mongoose.model("Event", eventSchema)

//creates a collection of questions in the db
function createEvent(){
    console.log('event triggered')
    Question.aggregate([{$sample:{size:6}}], function(err,questions){
        questions.forEach(function (question){
            let event = new Event({
                question: question.question,
                answer: question.answer,
                false1: question.false1,
                false2: question.false2,
                false3: question.false3
            });
            event.save();
        })
    })
    
}

//deletes the collection of questions from the db
function deleteEvent(){
    console.log('event list dropped')
    Event.collection.drop();
}

// const job_create_list = new cron.CronJob("*/5 * * * *", createEvent);
// job_create_list.start()

// const job_delete_list = new cron.CronJob("*/4 * * * *", deleteEvent)
// job_delete_list.start();
router.get('/demo', (req,res) => {
    deleteEvent()
    createEvent()
})

// GET ALL QUESTIONS FROM EVENT DB
router.get('/', async (req,res)=>{
    try{
        const eventQuestions = await Event.find()
        res.json(eventQuestions)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router;