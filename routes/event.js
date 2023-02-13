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
    Question.aggregate([{$sample:{size:2}}], function(err,questions){
        questions.forEach(function (question){
            let event = new Event({
                question: question.question,
                answer: question.answerl,
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
    Event.collection.drop();
}

const job_create_list = new cron.CronJob("54 19 * * *", createEvent);
job_create_list.start()

//const job_delete_list = new cron.CronJob("8 19 * * *", deleteEvent)
//job_delete_list.start();

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