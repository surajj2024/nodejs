const express = require('express');
const router = express.Router();
const session = require('express-session');
const config = require('../config/config');


const bodyParser = require('body-parser');

router.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}))

const adminController = require('../controllers/adminController')

router.get('/', adminController.loadLogin)




module.exports = router;