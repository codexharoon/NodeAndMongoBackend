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

        // check user email and username existence
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

        // check user existence
        const isUserExist = await userReg.findOne({email});

        //not a user => eror
        if(!isUserExist){
            return res.status(401).json({message : 'Invalid Credentials (Hint : email)'});
        }

        //check password
        const isPassCorrect = await bCrypt.compare(password,isUserExist.password);

        // not correct password => error
        if(!isPassCorrect){
            return res.status(401).json({message : 'Invalid Credentials (Hint : password)'});
        }

        //generating token
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


// verify token
function authenticateToken(req,res,next){
    // get token from header auth and split
    const token = req.headers.authorization.split(' ')[1];
    const {id} = req.body;

    if(!token){
        return res.status(401).json({
            message : 'Auth Error!'
        });
    }

    try{
        const decodeToken = jwt.verify(token,process.env.JWT_SCRET_KEY);

        if(decodeToken.id === id){
            next();
        }

    }
    catch(error){
        res.status(500).json({
            message : 'Invalid Token'
        });
    }

}

router.get('/profile',authenticateToken, async (req,res)=>{
    const {id} = req.body;

    const user = await userReg.findById(id);

    res.json({
        user
    });
});

module.exports = router;