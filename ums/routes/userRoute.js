const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const userController = require('../controllers/userController');
const config = require('../config/config');

const auth = require('../middleware/auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({
    storage: storage
});


router.use(express.static('public'))

router.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}))


router.get('/register', auth.isLogout, userController.loadRegister);
router.post('/register', upload.single('image'), userController.insertUser);
router.get('/verify', userController.verifyMail);
router.get('/', auth.isLogout, userController.loginLoad);
router.get('/login', auth.isLogout, userController.loginLoad);
router.post('/login', userController.verifyLogin);
router.get('/home', auth.isLogin, userController.loadHome);
router.get('/logout', auth.isLogin, userController.userLogout);
router.get('/forget', auth.isLogout, userController.forgetLoad);
router.post('/forget', userController.forgetVerify);
router.post('/forget-password', auth.isLogout, userController.forgetPasswordLoad);
router.post('/changePassword', userController.resetPassword);
router.get('/verification', userController.verificationLoad);
router.post('/verification', userController.sendVerificationLink);
router.get('/edit', auth.isLogin, userController.editLoad);
router.post('/edit', upload.single('image'), userController.updateProfile);

module.exports = router;