
const gulpConfig = require('../config.js');
module.exports = {
    'secret': 'mysecretabc',
    'database': 'mongodb://localhost/bankapplication5',
    APP_PATH: gulpConfig.APP_PATH,
    DIST_PATH: gulpConfig.DIST_PATH,
    PUBLIC: "./public",
    SERVER_PORT: gulpConfig.SERVER_PORT
};