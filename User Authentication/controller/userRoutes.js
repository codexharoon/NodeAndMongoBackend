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
        const {username , email , password, age, gender, refreshToken } = req.body;

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
                    gender,
                    refreshToken
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

        //generating access token
        const accessToken = await jwt.sign({id : isUserExist._id},process.env.JWT_SCRET_KEY,{expiresIn : '1h'});

        //generating refresh token
        const refershToken = await jwt.sign({id : isUserExist._id},process.env.JWT_REFRESH_SCRET_KEY);

        //store the refreh token into db => user obj
        isUserExist.refreshToken = refershToken;
        await isUserExist.save();

        //store refresh token into cookies
        // res.cookie('refreshToken',refershToken,{httpOnly : true, path : '/refreshToken'});
        res.cookie('refreshToken',refershToken,{httpOnly : true});

        res.json({
            message : 'user login success!',
            accessToken,
            refershToken
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
            message : error.message
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


// api for refresh token
router.get('/refreshToken', async (req,res)=>{
    // getting token from cookie
    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(401).json({
            message : 'Token not found!'
        });
    }
    
    try{
        //decoding the token to get id
        const decode = jwt.decode(token,process.env.JWT_REFRESH_SCRET_KEY);
        const id = decode.id;

        // getting obj of user from db
        const user = await userReg.findById(id);

        if(!user || user.refreshToken!== token){
            return res.status(401).json({
                message : 'Token is not valid!'
            });
        }

        // generating access token
        const accessToken = jwt.sign({id : user._id},process.env.JWT_SCRET_KEY,{expiresIn : '1h'});
        // generating refresh token
        const refreshToken = jwt.sign({id : user._id},process.env.JWT_REFRESH_SCRET_KEY);

        // updating refresh token in user obj db and in cookies
        user.refreshToken = refreshToken;
        await user.save();

        // res.cookie('refreshToken',refreshToken,{httpOnly : true, path : '/refreshToken'});
        res.cookie('refreshToken',refreshToken,{httpOnly : true});

        res.json({
            message : 'Token Refeshed!',
            accessToken,
            refreshToken
        });

    }
    catch(error){
        res.status(401).json({
            message : error.message
        });
    }

});

module.exports = router;