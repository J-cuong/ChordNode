const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
    score: {type:Number, required:true}
});

module.exports = mongoose.model('HighScore', scoreSchema)