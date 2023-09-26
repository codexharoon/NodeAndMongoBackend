const monggose = require('mongoose');

const schema = monggose.Schema(
    {
        name : {
            type:String
        },
        age : {
            type:Number,
            default:1,
            min:1,
            max:120
        },
        email : {
            type:String,
            match:"/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/",
            required : true
        },
        password : {
            type:String,
            required:true
        },
        date : {
            type:Date,
            default:Date.now
        },
    }
);