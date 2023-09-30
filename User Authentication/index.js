const express = require('express');
const port = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('./database/db');
const userRoutes = require('./controller/userRoutes');
const todoRoutes = require('./controller/todoRoutes');
const app = express();


app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/user',userRoutes);
app.use('/todo',todoRoutes);


//home page
app.get('/',(req,res)=>{
    res.send({
        message : 'Home Page'
    });
});


//404 error 
app.use((req,res,next)=>{
    res.status(404).json(
        {
            message : 'Page not found!'
        }
    );
});

//server
app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`);
});