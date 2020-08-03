const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const User = require('../models/user')
router.post('/signup', (req,res,next)=>{
        User.find({
            email:req.body.email
        })
        .exec()
        .then(user =>{
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'E-Mail exists'
                });
            }
            else{
                
        bcrypt.hash(req.body.password, 10, (err,hash) =>{
            if(err){
                return res.status(500).json({
                    error:err
                })

            }
            else{
                const user  = new User({
                email: req.body.email,
                password: hash,
                score:1
                
                })
                user
                    .save()
                    .then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message:'User created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        })
                    })
            }
        
        })
            }
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
            bcrypt.compare(req.body.password,user[0].password, (err,result)=>{
                if(err){
                    return res.status(401).json({
                        message:'Authorization failed'
                    });
                }
                if(result){
                    const token = jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id
                    },process.env.JWT_KEY, {
                        expiresIn: "1h",
                    })
                    return res.status(200).json({
                        userId:user[0]._id,
                        email:user[0].email,
                        score:user[0].score
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

router.patch('/:userID',(req,res,next)=>{
    const id = req.params.userID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id:id},{$set:updateOps})
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

router.delete('/:userId', (req,res, next)=>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

router.get('/:userId', (req,res,next) => {
    const id = req.params.userID;
    User.findOne({
        _id:req.params.userId
    })
    .exec()
    .then(result=>{{ 
            console.log(result)
            if(result){
                res.status(200).json({
                    
                })
            }
            else{
                res.status(404).json({
                    message:'error'
                })
            }
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


module.exports = router;