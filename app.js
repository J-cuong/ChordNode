const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const hsRoutes = require('./api/routes/highscore');
const userRoutes = require('./api/routes/user')

mongoose.connect('mongodb+srv://soloet:'+process.env.MONGO_ATLAS_PW+'@node-chordian.0jffw.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    }
);




app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Controll-Allow-Headers','*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/highscore',hsRoutes);
app.use('/user',userRoutes);


app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;
