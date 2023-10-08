const express = require('express');
const port = 8000;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./controller/userRoutes');
const cookieParser = require('cookie-parser');
require('./db');

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use('/user',userRoutes);

app.get('/', (req, res) => {
    res.json({
        message : 'API is working!'
    });
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));