const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    user_score:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)