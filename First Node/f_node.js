const express = require('express');
const port = 8000;

const app = express();

app.get('/',
    (req,res)=>{
        res.statusCode = 200;
        res.type('text');
        res.send('yo');
    }
);

app.get('/info',(req,res)=>{
    res.status(200).send('info page');
}
);

app.use(
  (req,res,next)=>{
    res.status(404).send('404 Page not found!');
  }  
);

app.listen(port,()=>{
    console.log('server is running at port '+port);
});