const express = require('express');
const port = 8000;
const userRoutes = require('./controller/userRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
 


app.use(bodyParser.json());

// const allowedOrigins = ['http://localhost:3000','http://localhost:3001'];
// app.use(cors(
//     {
//         origin : function(origin,callback){
//             console.log(origin);
//             if(!origin)
//                 return callback(null,true);
//             if(allowedOrigins.includes(origin))
//                 return callback(null,true);
//             else{
//                 return callback(new Error('Block by CORS'));
//             }
//         }
//     }
// ));

app.use(cors());

app.use('/userapis',userRoutes);

app.get('/',(req,res)=>{
    res.status(200).send(
        {
            message : 'Api is working!'
        }
    );
});

app.use((req,res,next)=>{
    res.status(404).send({
        error : '404 Page Not Found!'
    });
});


app.listen(port,()=>{
    console.log('Server is listening on port ' + port);
});