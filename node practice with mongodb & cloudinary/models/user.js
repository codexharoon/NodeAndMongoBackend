const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username:{
            type:String,
            unique:true,
            requried:true
        },
        email:{
            type:String,
            unique:true,
            requried:true
        },
        password:{
            type:String,
            requried:true
        },
        age:{
            type:String,
            min:1,
            default:1
        },
        gender:{
            type:String,
            default:'Not Specified'
        },
        refreshToken:{
            type:String,
        },
        profilePic:{
            type:String
        }
    }
);

module.exports = mongoose.model('user',userSchema);