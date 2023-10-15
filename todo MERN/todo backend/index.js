const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRoutes = require('./controller/todoRoutes');
require('./db');


app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        message : 'Todo Mern App'
    });
});

app.use('/todo',todoRoutes);


app.use((req,res,next)=>{
    res.status(404).json({
        message : 'ERROR 404 PAGE NOT FOUND'
    });
});


app.listen(port,()=>{console.log(`Server is listening on port ${port}`)});