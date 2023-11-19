const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');


const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadLogin
}