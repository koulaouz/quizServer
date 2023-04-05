const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    user_pwd:{
        type: String,
        required: true
    },
    user_name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', adminSchema)