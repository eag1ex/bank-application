
module.exports = (config) => {
    
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //console.log('uploading image to ', config.PUBLIC + '\\uploaded_images')
        cb(null, config.PUBLIC + '\\uploaded_images')
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.split('.');
        ext = ext[ext.length - 1];
        cb(null, 'upload' + '-' + Date.now() + '.' + ext);
    }
});


// define what file type to accept
var filter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        console.log('Failed: format not supported')
        cb('Failed: format not supported');
    }
};


var upload = multer({
    storage: storage,
    fileFilter: filter
}).single('file');
/** SRC : https://stackoverflow.com/questions/31530200/node-multer-unexpected-field
 * this line troubled me for a while
 * single "file" reffers to type="file" not the name of the input name='filename'<WRONG!
 */


    return {
        upload: () => {
            return upload;
        }
    }
}