'use strict';
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadProfilePhoto = multer({
   storage: storage
}).single('profileImg');

module.exports = uploadProfilePhoto;