const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        required:true
    }
});

const Todo = mongoose.model('Todo',TodoSchema);

module.exports = Todo;