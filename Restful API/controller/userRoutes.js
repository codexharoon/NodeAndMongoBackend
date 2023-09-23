const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const userDataFilePath = path.join(__dirname , '../userData.json');

function readDataFromFile(){
    const data = fs.readFileSync(userDataFilePath);
    return JSON.parse(data);
}

function writeDataIntoFile(data){
    fs.writeFileSync(userDataFilePath, JSON.stringify(data,null,2));
}



router.get('/user',(req,res)=>{
    res.send(
        readDataFromFile()
    );
});

router.get('/user/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const users = readDataFromFile();

    const user = users.find(user => user.id === id);

    if(user){
        res.send(user);
    }
    else{
        res.status(404).send({
            error : 'No user with this id found!'
        });
    }
});

router.post('/user',(req,res)=>{
    const user = req.body;

    const users = readDataFromFile();
    const id = users.length + 1;

    user.id = id;
    users.push(user);

    writeDataIntoFile(users);

    res.send(users);
});

router.put('/user/:id',(req,res)=>{
    const id = req.params.id;
    const updatedUser = req.body;

    const users = readDataFromFile();
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if(userIndex == -1){
        return res.status(404).send('user not found!');
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updatedUser
    }

    writeDataIntoFile(users);
    res.send(users);
});

router.delete('/user/:id',(req,res)=>{
    const users = readDataFromFile();
    const id = req.params.id;

    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if(userIndex == -1){
        return res.status(404).send('No user found!');
        
    }

    users.splice(userIndex,1);
    writeDataIntoFile(users);
    res.send(`User with ID ${id} has been successfully deleted!`);
    
});


router.get('/test',(req,res)=>{
    res.status(200).send('Test');
});

module.exports = router;