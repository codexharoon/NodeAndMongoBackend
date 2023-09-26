const mongoose = require('mongoose');

const todoScheme = new mongoose.Schema(
    {
        task:{
            type:String,
            required:true
        },
        Completed:{
            type:Boolean,
            default:false
        }
    }
);


const Todo = mongoose.model('Todo',todoScheme);

module.exports = Todo;