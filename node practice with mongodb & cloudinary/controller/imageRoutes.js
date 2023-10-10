const express = require('express');
const router = express.Router();
const USER = require('../models/user');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();



cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_KEY_SCRET
});


const storage = multer.memoryStorage();
const upload = multer({storage : storage});

router.post('/upload',upload.single('myimage'), async (req,res)=>{
    const file = req.file;
    const {id} = req.body;

    if(!file){
        return res.status(400).json({
            message : 'file not found'
        });
    }

    const user = await USER.findById(id);

    if(!user){
        return res.status(400).json({
            message : 'user not found'
        });
    }

    cloudinary.uploader.upload_stream({
        resource_type : 'image',
    },
     async (error,result)=>{
        if(error){
            return res.status(500).json({
                message : 'Cloudinary upload error!',
                error : error.message
            });
        }

        user.profilePic = result.secure_url;
        await user.save();

        res.json({
            message : 'Profile picture uploaded!',
            imageURL : result.url,
            user
        });
    }
    ).end(file.buffer);
});




module.exports = router;