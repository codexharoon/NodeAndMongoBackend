const express = require('express');
const userReg = require('../models/userReg_schema');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();


// getting all users
router.get('/all', async (req,res)=>{
    const allUsers = await userReg.find();

    res.json({
        message : 'List of all users',
        users : allUsers
    });
});


// register a user
router.post('/register', async (req,res)=>{
    try{
        const {username , email , password, age, gender } = req.body;

        const isUserExist = await userReg.findOne({$or : [{username},{email}] });

        if(isUserExist){
            res.status(409).json({
                messgae : 'User with this Email or Username is already exist!'
            });
        }
        else{
            const salt = await bCrypt.genSalt(10);
            const hashedPass = await bCrypt.hash(password,salt);

            const user = await userReg(
                {
                    username,
                    email,
                    password : hashedPass,
                    age,
                    gender
                }
            ).save();

            res.json({
                messgae : 'User Registered Successfully!',
                user : user
            });
        }
    }
    catch(error){
        res.status(500).json({
            messgae : error
        });
    }
});


// login
router.post('/login', async (req,res)=>{
    try{
        const { email , password } = req.body;

        const isUserExist = await userReg.findOne({email});
        if(!isUserExist){
            return res.status(401).json({message : 'Invalid Credentials (Hint : email)'});
        }

        const isPassCorrect = await bCrypt.compare(password,isUserExist.password);
        if(!isPassCorrect){
            return res.status(401).json({message : 'Invalid Credentials (Hint : password)'});
        }

        const token = await jwt.sign({id : isUserExist._id},process.env.JWT_SCRET_KEY,{expiresIn : '1h'});

        res.json({
            message : 'user login success!',
            token
        });
        
    }
    catch(error){
        res.status(500).json({
            message : 'error : ' + error
        });
    }
});

module.exports = router;