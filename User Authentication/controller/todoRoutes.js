const express = require('express');
const Todo = require('../models/todo_schema');
const router = express.Router();



router.get('/get', async (req,res) =>{
    const allTodos = await Todo.find();
    res.send(
        {
            message : 'List of all todos',
            Todos : allTodos
        }
    )
});


router.post('/add', async (req,res)=>{
    const todo = req.body;
    const pushTodo = await Todo(todo).save();

    res.send({
        message : 'sent!',
        todo : pushTodo
    });
});


module.exports = router;