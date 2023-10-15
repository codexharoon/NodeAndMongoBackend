const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    description:{
        type:String
    },
    completed:{
        type:Boolean,
        default:false
    }
},{timestamps : true});

module.exports = mongoose.model('todo',todoSchema);