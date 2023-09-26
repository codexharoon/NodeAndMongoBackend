const express = require('express');
const port = 8000;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./db');
const Todo = require('./models/todo');



app.use(bodyParser.json());

const allowedOrigins = ['http://127.0.0.1:5500'];

app.use(cors({
    origin : function(origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null,true);
        }
        else{
            return callback(Error('Block by CORS Origin!'));
        }
    }
}

));


app.get('/getTodo', async (req,res)=>{
    const allTodos = await Todo.find();

    res.json(
        {
            message : 'List of All Todos',
            Todos : allTodos
        }
    );
});

app.post('/postTodo', async (req,res)=>{
    const {task,completed} = req.body;

    const todo = Todo(
        {
            task,
            completed
        }
    )

    const savedTodo = await todo.save();

    res.json({
        message : 'Todo Saved Succesfully',
        savedTodo : savedTodo
    });
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server is listening on port ${port}!`));