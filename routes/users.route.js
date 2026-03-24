const express = require('express');

const router = express.Router();

// Data File
const userscontroller = require('../controller/users.controller');

const verifyToken = require('../middlewares/verifyToken');
const appError = require('../utils/appError');


const multer  = require('multer')

const diskstorage = multer.diskStorage({
        destination: function(req, file, cb){
                console.log(file);
                cb(null, 'uploads');
        },
        filename: function(req, file, cb){
                const ext = file.mimetype.split('/')[1];
                const fileName = `user-${Date.now()}.${ext}`;
                cb(null, fileName);
        }
})

const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];

        if(imageType === 'image') {
                return cb(null, true);
        }
        else {
                return cb(appError.create('file must be an image',400), false)
        }
}

const upload = multer({ 
        storage: diskstorage, 
        fileFilter: fileFilter  
});

//Get All Users 
router.route('/')
        .get(verifyToken ,userscontroller.getAllUsers)
//register
router.route('/register')
        .post(upload.single('avatar'), userscontroller.register)
//login
router.route('/login')
        .post(userscontroller.login)


module.exports = router;