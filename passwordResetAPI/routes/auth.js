const express = require('express');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');


const router = express.Router();


router.get('/users', (req, res) => {
    res.send("HEYYY!");
})


// Register route
router.post('/register', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check if the email is already registered
        const user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.json({
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});



// Login route
router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check if the email exists
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Generate a JWT token
        const token = jwt.sign({
            userId: user._id
        }, config.jwtSecret);

        res.json({
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});






// Password reset request route
router.post('/forgot-password', async (req, res) => {
    try {
        const {
            email
        } = req.body;

        // Generate a random OTP
        const otp = randomstring.generate({
            length: 6,
            charset: 'numeric',
        });

        // Update the user document with the OTP
        const user = await User.findOneAndUpdate({
            email
        }, {
            $set: {
                otp
            }
        }, {
            new: true
        });

        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        // Create the email message
        const mailOptions = {
            from: config.email.user,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        // Send the email
        const transporter = nodemailer.createTransport(config.email);
        await transporter.sendMail(mailOptions);

        res.json({
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});




// Password reset route
router.post('/reset-password', async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword
        } = req.body;

        // Find the user with the provided email and OTP
        const user = await User.findOne({
            email,
            otp
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        user.otp = undefined;
        await user.save();

        res.json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});

module.exports = router;