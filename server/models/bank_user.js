var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('bankuser', new Schema({ 
    userID:Number,
    token:String,
    form:Object
})); 
