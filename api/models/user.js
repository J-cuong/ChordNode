const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    email:{type: String, required: true, 
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{type: String, required: true},
    score: {type: Number}
});

module.exports = mongoose.model('User', userSchema)