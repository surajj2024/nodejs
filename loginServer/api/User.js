const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('../models/User');

// mongodb user verification model
const UserVerification = require('../models/UserVerification');

// email handler
const nodemailer = require('nodemailer');

// unique string
const {
    v4: uuidv4
} = require('uuid');

// env variable
require("dotenv").config();

// Password handler
const bcrypt = require('bcrypt');

// path for static verified page
const path = require('path');

// nodemailer stuff
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})


// testing success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
        console.log(success);
    }
});

// SignUp
router.post('/signup', (req, res) => {
    let {
        name,
        email,
        password,
        dateOfBirth
    } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "All fields are required"
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Name must contain only letters"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Email is invalid"
        });
    } else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Date of birth is invalid"
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password must be at least 8 characters"
        });
    } else {
        // checking if user already exists
        User.find({
            email
        }).then(result => {
            if (result.length) {
                // A user already exists
                res.json({
                    status: "FAILED",
                    message: "User already exists"
                })
            } else {
                // Try to create a new user

                // password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth,
                        verified: false
                    });

                    newUser.save().then((result) => {
                        // handle account verification
                        sendVerificationEmail(result, res);
                    }).catch((err) => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "An Error occurred while saving the user"
                        });
                    }).catch(err => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "An Error occurred while hashing the password"
                        })
                    })
                });

            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An Error occurred while checking user existence"
            })
        })

    }
})


// send verification email to user
const sendVerificationEmail = ({
    _id,
    email
}, res) => {
    // url to be used in the mail
    const currentUrl = "http://localhost:3000/";
    const uniqueString = uuidv4() + _id;


    // mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Account Verification",
        html: `<p>Hi ${email},</p>
                    <p>Please click on the following link to verify your account:</p>
                    <p>Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here</a> to proceed</p>`,
    };

    // hash the unique string
    const saltRounds = 10;
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            console.log(hashedUniqueString);
            // set value in userVerification collection
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 600000 //in 10 minutes
            });
            console.log(newVerification);
            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            // email sent and verification record saved
                            res.json({
                                status: "PENDING",
                                message: "Verification email sent"
                            })
                        })
                        .catch((error) => {
                            console.error(error);
                            res.json({
                                status: "FAILED",
                                message: "Couldn't send verification email Failed"
                            })
                        })
                })
                .catch(error => {
                    console.log(error);
                    res.json({
                        status: "FAILED",
                        message: "Couldn't save verification email data"
                    })
                });
        })
        .catch(() => {
            res.json({
                status: "FAILED",
                message: "An Error occurred while hashing the email data"
            })
        })
};

// verify email
router.get('/verify/:userId/:uniqueString', (req, res) => {
    let {
        userId,
        uniqueString
    } = req.params;

    UserVerification
        .find({
            userId
        })
        .then((result) => {
            if (result.length > 0) {
                // user verification record exists so we proceed

                const {
                    expiresAt
                } = result[0];

                const hashedUniqueString = result[0].uniqueString;

                // checking for expired unique string
                if (expiresAt < Date.now()) {
                    // record has expired so we delete it
                    UserVerification
                        .deleteOne({
                            userId
                        })
                        .then(result => {
                            User
                                .deleteOne({
                                    _id: userId
                                })
                                .then(() => {
                                    let message = "Link has expired.Please Sign Up again";
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                })
                                .catch(error => {
                                    let message = "Clearing user with expired unique string failed";
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            let message = "An error occurred while clearing expired user verification record";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        })
                } else {
                    // valid record exists so we validate the user string
                    // first compare the hashed unique string

                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                // string matches
                                User
                                    .updateOne({
                                        _id: userId
                                    }, {
                                        verified: true
                                    })
                                    .then(() => {
                                        UserVerification
                                            .deleteOne({
                                                userId
                                            })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, '../views/verified.html'));
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                let message = "An error occurred while finalizing successful verification";
                                                res.redirect(`/user/verified/error=true&message=${message}`);
                                            });
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        let message = "An error occurred while updating user record to show verified";
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    });

                            } else {
                                // existing record but incorrect verification details passed
                                let message = "Invalid verification details passed. check your inbox";
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            let message = "An error occurred while comparing the hashed unique string";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        });
                }

            } else {
                // user verification record does not exist
                let message = "Account record does not exist or has been verified already. Please SignUp or Log in";
                res.redirect(`/user/verified/error=true&message=${message}`);
            }
        })
        .catch(error => {
            console.log(error);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/verified/error=true&message=${message}`);
        })
})


// verified page route
router.get('/verified', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'))
})


// signIn
router.post('/signin', (req, res) => {
    let {
        email,
        password,
    } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == '' || password == '') {
        res.json({
            status: "FAILED",
            message: "All fields are required"
        })
    } else {
        User.find({
                email
            })
            .then(data => {
                if (data.length) {
                    // User already exists

                    // check if user is verified
                    if (!data[0].verified) {
                        res.json({
                            status: "FAILED",
                            message: "Email hasn't been verified yet. check your inbox"
                        })
                    } else {

                        const hashedPassword = data[0].password;
                        bcrypt.compare(password, hashedPassword).then(result => {
                                if (result) {
                                    // password matched
                                    res.json({
                                        status: "SUCCESS",
                                        message: "User logged in successfully",
                                        data: data
                                    })
                                } else {
                                    // password did not match
                                    res.json({
                                        status: "FAILED",
                                        message: "Password did not match"
                                    })
                                }

                            })
                            .catch(err => {
                                res.json({
                                    status: "FAILED",
                                    message: "An Error occurred while comparing password"
                                })
                            })
                    }
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An Error occurred while checking user existence"
                })
            })
    }
});

module.exports = router;