const mongo = require('mongoose');
require('dotenv').config();

module.exports =  mongo.connect(process.env.MONGO_URL,{
    dbName : process.env.MONGODB_NAME  
}).then(
    () => {
        console.log('DB Connecteed!');
    }
).catch(
    (error) => {
        console.log(error);
    }
);