const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.Mongo_URL).then(
    ()=>{console.log('Connected to database!');}
).catch(
    (error)=>{console.log('error while connecting to database => '+error);}
);
