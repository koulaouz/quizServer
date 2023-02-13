const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    answer:{
        type: String,
        required: true
    },
    false1:{
        type: String,
        required: true
    },
    false2:{
        type: String,
        required: true
    },
    false3:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Question', questionSchema)