const path = require('path');
const multer = require('multer');


const storageSpace = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },

    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '_' + Date.now().toString() + path.extname(file.originalname))
    },
});

const profileHandler = multer({
    storage: storageSpace,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.pdf' && ext !== '.doc'
            && ext !== '.docx') {
            req.fileValidationError = "Invalid file extension";
            callback(null, false, req.fileValidationError)
        }
        callback(null, true)
    },
}).single('resume');

module.exports = {profileHandler}