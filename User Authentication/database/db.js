const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URL).then(  
    ()=>{console.log('Connected to Database!');}
).catch(
    (error)=>{console.log('Error to connect to database! '+error);}
);


