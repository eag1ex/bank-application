var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('bankuser', new Schema({ 
    date:String,
    token:String,
    form:Object
})); 
