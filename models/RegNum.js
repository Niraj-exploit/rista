
const mongoose = require('mongoose')

const RegNumSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    userName:{
        type:String,
    },
    used:{
        type:Boolean,
        default:false
    },
    expiration: {
        type: Date,
    }
});

const RegNum = mongoose.model('RegNum', RegNumSchema);

module.exports = RegNum;