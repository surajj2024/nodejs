const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')
const User = require('../models/user');


router
    .route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));


router
    .route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.login);


router.get('/logout', users.logout);

module.exports = router;



















































/* 
router.get('/data', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({
        message: 'First response'
    }));
    res.write(JSON.stringify({
        message: 'Second response'
    }));
    res.end();
});

router.get('/another', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    const json1 = {
        message: 'Hello, world!'
    };

    const json2 = {
        message: 'Goodbye, world!'
    };

    res.write(JSON.stringify(json1));
    res.write(JSON.stringify(json2));
    res.end();
});
 */