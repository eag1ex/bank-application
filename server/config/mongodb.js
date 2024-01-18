
module.exports=(config)=>{
var mongoose = require('mongoose');   
// connect to database
function mongo(){
    mongoose.Promise = global.Promise;
    mongoose.connect(config.database,{ useNewUrlParser: true }, function (err, db) {
        if (err) {
            console.log('error connecting to mongo db');
            throw err;
        } else {
        }
    });
}

    return {
        init:()=>mongo(),
        bankuser: require('./models/bank_user.js')
    }
}