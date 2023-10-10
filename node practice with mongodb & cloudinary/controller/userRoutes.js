const express = require('express');
const USER = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();


function authenticateToken(req,res,next){
    try{
        const accessToken = req.headers['authorization'].split(' ')[1];

        // const {id} = req.body;

        const verifyToken = jwt.verify(accessToken,process.env.SCRET_KEY);

        req.id = verifyToken.id;

        if(verifyToken.id){
            next();
        }
        else{
            res.json({
                message : 'invalid token'
            });
        }
    }
    catch(error){
        res.json({
            message : 'unable to verify token',
            error : error.message
        });
    }
}


router.get('/all',async (req,res)=>{
    try{
        const users = await USER.find();

        res.json({
            message : 'List of all users',
            users : users
        });
    }
    catch(error){
        res.status(500).json({
            message : 'unable to get all users',
            error : error.message
        });
    }
});


router.post('/register',async (req,res)=>{
    try{
        const {username, email , password , age , gender} = req.body;

        const isUserExist = await USER.findOne({ $or : [{username}, {email}] });

        if(isUserExist){
            return res.status(409).json({
                message : 'username or email is already taken'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const createdUser = await USER(
            {
                username,
                email,
                password : hashedPassword,
                age,
                gender,
            }
        ).save();

        res.json({
            message:'User Created!',
            user : createdUser
        });
    }
    catch(error){
        res.status(500).json({
            message : 'unable to register the user',
            error : error.message
        });
    }
});


router.post('/login',async (req,res)=>{
    try{
        const {username, email , password} = req.body;

        const user = await USER.findOne({$or : [{username},{email}]});

        if(!user){
            return res.status(401).json({
                message : 'Invalid Credentials'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message : 'Invalid Credentials'
            });
        }

        const accessToken = jwt.sign({id : user._id},process.env.SCRET_KEY,{expiresIn : '120s'});
        const refreshToken = jwt.sign({id : user._id},process.env.REFRESH_SCRET_KEY);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken',refreshToken,{httpOnly: true});


        res.json({
            message : 'user logined!',
            accessToken,
            refreshToken
        });

    }
    catch(error){
        res.status(500).json({
            message : 'unable to login the user',
            error : error.message
        });
    }
});


router.get('/profile',authenticateToken, async (req,res)=>{
    try{
        // const {id} = req.body;
        const id = req.id;
        const userDetails = await USER.findById(id);

        res.json({
            message : 'user profile',
            profile : userDetails
        });
    }
    catch(error){
        res.status(500).json({
            message : 'unable to open user profile',
            error : error.message
        });
    }
});



router.get('/refreshToken',async (req,res)=>{
    try{
        const tokenInCookie = req.cookies.refreshToken;

        if(!tokenInCookie){
            return res.status(401).json({
                message : 'token unavilable.'
            });
        }

        const decodeToken = jwt.decode(tokenInCookie,process.env.REFRESH_SCRET_KEY);    

        const user = await USER.findById(decodeToken.id);

        if(!tokenInCookie, user.refreshToken !== tokenInCookie){
            return res.status(401).json({
                message : 'token unavilable or has been expired.'
            });
        }


        const accessToken = jwt.sign({id : decodeToken.id},process.env.SCRET_KEY,{expiresIn : '120s'});
        const refreshToken = jwt.sign({id : decodeToken.id},process.env.REFRESH_SCRET_KEY);


        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken',refreshToken);


        res.json({
            message : 'token refreshed!',
            accessToken,
            refreshToken
        });
    }
    catch(error){
        res.status(500).json({
            message : 'unable to refresh token',
            error : error.message
        });
    }


});



// some fliters


// get by gender filter
router.get('/getbygender', async (req,res)=>{
    try{
        const {gender} = req.body;

        const users = await USER.find({gender : gender});

        res.json({
            users
        });
    }
    catch(error){
        res.json({
            error : error.message
        });
    }
});


// sort by filter
router.get('/sortby', async (req,res)=>{
    try{
        const {sortby,sort} = req.body;

        const users = await USER.find().sort({[sortby] : sort});

        res.json({
            users
        });
    }
    catch(error){
        res.json({
            error : error.message
        });
    }
});



module.exports = router;