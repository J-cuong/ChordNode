const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HighScore = require('../models/highscore');
const user = require('../models/user');

router.get('/',(req,res,next)=>{
    HighScore.find().exec().then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.post('/',(req,res,next)=>{
    const highscore = new HighScore({
        score:req.body.score
    });
    highscore
        .save()
        .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Handling post requests to /highscore',
            createdScore: highscore
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
    
});

router.get('/:userID',(req,res,next)=>{
    const id = req.params.userID;

    HighScore.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({message:'No valid entry'})
        }
        
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })

});

router.patch('/:userID',(req,res,next)=>{
    const id = req.params.userID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    HighScore.update({_id:id},{$set:updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

router.post('/login',(req,res,next) =>{
    User.find({email:req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message:'Authorization failed'
                })
            }
            bcrypt.compare(req.body.password,user[0].password, (err,res)=>{
                if(err){
                    return res.status(401).json({
                        message:'Authorization failed'
                    });
                }
                if(result){
                    return res.status(200).json({
                        message:'Authorization successful'
                    })
                }
                return res.status(401).json({
                    message:'Authorization failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
});


router.delete('/:userID',(req,res,next)=>{
    const id = req.params.userID;
    HighScore.remove({_id: id })
    .exec()
    .then()(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

module.exports = router;