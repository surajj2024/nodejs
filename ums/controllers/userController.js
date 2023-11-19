const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
// const randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.error(error.message);
    }
};


// for sending email
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            }
        });

        const mailOptions = {
            from: config.emailUser, // sender address
            to: email, // list of receivers
            subject: 'Verify Your Email Address', // Subject line
            html: '<p>Hello ' + name + ' , please click here to <a href="http://localhost:8080/verify?id=' + user_id + '">Verify</a> your mail</p>'

        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
                // res.json("success")
            }
        })


    } catch (error) {
        console.error(error.message);
    }
}


// for otp reset password 
const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            }
        });

        const mailOptions = {
            from: config.emailUser, // sender address
            to: email, // list of receivers
            subject: 'For reset password', // Subject line
            // html: '<p>Hello ' + name + ' , please click here to <a href="http://localhost:8080/forget-password?token=' + token + '">Reset</a> Your PASSWORD</p>'
            html: '<p>Hello ' + name + ' , Your OTP is <b>' + token + '</b>'

        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        })
    } catch (error) {
        console.error(error.message);
    }
}

const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.error(error.message);
    }
};


const insertUser = async (req, res) => {
    try {

        const spassword = await securePassword(req.body.password);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            password: spassword,
            is_admin: 0
        })

        const userData = await user.save()

        if (userData) {


            sendVerifyMail(req.body.name, req.body.email, userData._id);

            res.render('registration', {
                message: 'Your registration has been successfully. Please Verify your email address'
            });
        } else {
            res.render('registration', {
                message: 'Your registration has not been successfully'
            });
        }


    } catch (error) {
        console.log(error.message);
    }
};


const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({
            _id: req.query.id
        }, {
            $set: {
                is_verified: 1
            }
        })

        console.log(updateInfo);
        res.render("email-verified");



    } catch (error) {
        console.log(error.message);
    }
};


// login user methods started
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({
            email: email
        });

        // console.log(userData);

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {

                if (userData.is_verified === 0) {
                    res.render('login', {
                        message: 'Please verify your email address'
                    });
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            } else {
                res.render('login', {
                    message: 'Email and password is incorrect'
                });
            }
        } else {
            res.render('login', {
                message: 'Email and password is incorrect'
            });
        }




    } catch (error) {
        console.log(error.message);
    }
}



const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({
            _id: req.session.user_id
        })
        // console.log("session", req.session);
        // console.log(user);
        res.render('home', {
            user: userData
        });
    } catch (error) {
        console.log(error.message);
    }
};


const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

// forget password authentication
const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        // console.log("hello");
        const email = req.body.email;
        const userData = await User.findOne({
            email: email
        })

        if (userData) {


            if (userData.is_verified === 0) {
                res.render('forget', {
                    message: 'Please verify your email address'
                });
            } else {
                const randomString = randomstring.generate({
                    length: 6,
                    charset: 'numeric',
                });
                const updatedData = await User.updateOne({
                    email: email
                }, {
                    $set: {
                        token: randomString
                    }
                })
                // console.log(updatedData);

                sendResetPasswordMail(userData.name, userData.email, randomString)
                res.render('forget', {
                    message: 'Please check your email to reset your password'
                });
            }
        } else {
            res.render('forget', {
                message: 'Email is incorrect. Please try again'
            });
        }

    } catch (error) {
        console.log(error.message);
    }
};


const forgetPasswordLoad = async (req, res) => {
    try {

        const token = req.body.token;
        // console.log(token);
        const tokenData = await User.findOne({
            token: token
        })
        // console.log(tokenData);


        if (tokenData) {
            res.render('forget-password', {
                user_id: tokenData._id
            });

        } else {
            res.render('notFound', {
                message: 'otp is invalid'
            });
        }


    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(password);

        const updatedData = await User.findByIdAndUpdate({
            _id: user_id
        }, {
            $set: {
                password: secure_password,
                token: ''
            }
        })

        res.redirect('/login');



    } catch (error) {
        console.log(error.message);
    }
}

// for verification send mail link
const verificationLoad = async (req, res) => {
    try {
        res.render('verification');
    } catch (error) {
        console.log(error.message);
    }
}


const sendVerificationLink = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({
            email: email
        })

        if (userData) {
            sendVerifyMail(userData.name, userData.email, userData._id);
            res.render('verification', {
                message: "Verification mail sent, Please check your email address"
            })


        } else {
            res.render('verification', {
                message: "This email doesn't exist"
            });
        }

    } catch (error) {
        console.log(error.message);
    }
}



// user profile edit and update
const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({
            _id: id
        })

        if (userData) {
            res.render('edit', {
                user: userData
            })
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message)
    }
}


const updateProfile = async (req, res) => {
    try {
        if (req.file) {
            const userData = await User.findByIdAndUpdate({
                _id: req.body.user_id
            }, {
                $set: {
                    image: req.file.filename,
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile
                }
            })
        } else {
            const userData = await User.findByIdAndUpdate({
                _id: req.body.user_id
            }, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile
                }
            })
        }

        res.redirect('/home')
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sendVerificationLink,
    editLoad,
    updateProfile

};