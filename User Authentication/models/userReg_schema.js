const mongoose = require('mongoose');

const userRegSchema = mongoose.Schema(
    {
        username : {
            type:String,
            unique:true,
            required:true
        },
        email : {
            type:String,
            unique:true,
            required:true
        },
        password : {
            type:String,
            required:true
        },
        age:{
            type:Number,
            min:1,
            default:1
        },
        gender:{
            type:String,
            default:'Not Specified'
        },
        refreshToken:{
            type:String
        }
    }
);


const userReg = mongoose.model('userReg',userRegSchema);

module.exports = userReg;