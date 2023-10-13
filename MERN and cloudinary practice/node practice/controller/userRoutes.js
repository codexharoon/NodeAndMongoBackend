const express = require('express');
const USER = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

require('dotenv').config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_KEY_SCRET
});


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

        const accessToken = jwt.sign({id : user._id},process.env.SCRET_KEY,{expiresIn : '1h'});
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


        const accessToken = jwt.sign({id : decodeToken.id},process.env.SCRET_KEY,{expiresIn : '1h'});
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


const storage = multer.memoryStorage();
const upload = multer({storage : storage});

router.post('/profile/pic',upload.single('myimage'), async (req,res)=>{
    try{  
        const file = req.file;
        const accessToken = req.headers['authorization'].split(' ')[1];

        console.log(file);
        if(!file){
            return res.status(404).json({
                message : 'image not found!'
            });
        }


        if(!accessToken){
            return res.status(500).json({
                message : 'invalid token!'
            });
        }

        const decodeToken = jwt.decode(accessToken,process.env.SCRET_KEY);
        const id = decodeToken.id;

        const user = await USER.findById(id);

        console.log(user);

        cloudinary.uploader.upload_stream({
            resource_type : 'image',
        },async (error,result)=>{
            if(error){
                return res.status(500).json({
                    message : 'Cloudinary upload error!',
                    error : error.message
                });
            }
            
            console.log('good');

            user.profilePic = result.secure_url;
            await user.save();
    
            res.json({
                message : 'Profile picture uploaded!',
                imageURL : result.url,
            });
        }
        ).end(file.buffer);
    }
    catch(err){
        res.status(500).json({
            error : err.message,
            message : 'unable to upload the image!'
        });
    }


});






module.exports = router;