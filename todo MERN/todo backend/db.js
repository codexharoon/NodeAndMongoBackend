const mongoose = require('mongoose');
require('dotenv').config();

module.exports =  mongoose.connect(process.env.MONGO_URL,{ 
    dbName : 'Todo'
}).then(
    ()=>{console.log('DB Connected!');}
).catch(
    (error)=>{console.log(error.message);}
);