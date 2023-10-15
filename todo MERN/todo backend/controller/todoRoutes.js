const express = require('express');
const router = express.Router();
const TODO = require('../models/todo');

// create a todo task
router.post('/create', async (req,res)=>{
    try{
        const {title,description} = req.body;

        const todo = TODO(
            {
                title,
                description
            }
        );
        await todo.save();

        res.json({
            message : 'Todo created successfully!',
            todo
        });
    }
    catch(error){
        res.status(500).json({
            error : error.message
        });
    }
});

// get all todos
router.get('/getall', async (req,res)=>{
    try{
        const todos = await TODO.find();

        res.json({
            message : 'List of all Todos',
            Todos : todos
        });


    }
    catch(error){
        res.status(500).json({
            error : error.message
        });
    }
});

// get a single todo by id
router.get('/get/:id', async (req,res)=>{
    try{
        const todo = await TODO.findById(req.params.id);

        if(!todo){
            return res.status(404).json({
                message : 'Cannot find todo!'
            });
        }

        res.json({
            message : 'Todo fetched!',
            Todo : todo
        });

    }
    catch(error){
        res.status(500).json({
            error : error.message
        });
    }
});


// update a todo
router.put('/update/:id',async(req,res)=>{
    try{
        const {title,description,completed} = req.body;

        const todo = await TODO.findByIdAndUpdate(req.params.id,{
            title, 
            description, 
            completed
        },
        {
            new : true
        }
        );

        if(!todo){
            return res.status(404).json({
                message : 'Cannot find todo!'
            });
        }

        res.json({
            message : 'Todo updated!',
            Todo : todo
        });

    }
    catch(error){
        res.status(500).json({
            error : error.message
        });
    }
});

// delete a todo
router.delete('/delete/:id',async(req,res)=>{
    try{
        const todo = await TODO.findByIdAndDelete(req.params.id);

        if(!todo){
            return res.status(404).json({
                message : 'Cannot find todo!'
            });
        }

        res.json({
            message : 'Todo Deleted!!',
        });

    }
    catch(error){
        res.status(500).json({
            error : error.message
        });
    }
});


// ignore
// testing createdAt and updatedAt fields, created by {timestamps : true} in todo schema 
router.get('/test/:id',async (req,res)=>{
    const test = await TODO.findById(req.params.id);
    console.log(test);
    const date = test.updatedAt.toString();
    console.log(date.split('T')[0]);
    res.json({
        test : 'Success'
    });
});

module.exports = router;