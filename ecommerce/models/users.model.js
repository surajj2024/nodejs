const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); //for web tokens

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minLength: [4, "Minimum length is 4"],
        maxLength: [40, "Maximum length is 20"]
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        maxLength: [1, "Type M or F"]
    },

    phone: {
        type: Number,
        required: true,
        min: [10, "Not more than 10 digit"]
    },

    password: {
        type: String,
        required: true,
        minLength: [6, "password is Too weak"]
    },

    confirmPassword: {
        type: String,
        required: true,
        minLength: [6, "password is Too weak"]
    },

    role:{
        type: String,
        default: 'user',
        // required: true,
        enum: ['user', 'admin']
    }

})



const User = mongoose.model('User', userSchema);


module.exports = User;