// const { validateUsers } = require('../app');
const User = require('../models/users.model');
const wrapAsync = require("../middleware/error")
const AppError = require('../AppError');
const jwt = require('jsonwebtoken');


exports.getAllUser =  wrapAsync((async (req, res) => {
    const users = await User.find({});
    res.send(users);
}))


exports.createNewUser = wrapAsync((async (req, res, next) => {
    const newUsers = new User(req.body);

    await newUsers.save();
    res.send({ 'success': true, message: "Passwords, Email and Phone number are valid and Password is strong", newUsers });
}))

exports.userDetail = wrapAsync((async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    res.send(user);
}))

exports.updateUser = wrapAsync((async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.send({ 'Updated': true, user });
}))



exports.deleteUser = wrapAsync((async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    const deletedUsers = await User.findByIdAndDelete(id, { runValidators: true, new: true });

    res.send({ 'deleted': true, message: "User deleted successfully", deletedUsers });
}))


exports.login = wrapAsync((async (req, res, next) => {
    // check if the user exists
    const user = await User.findOne({ email: req.body.email});
    if(user) {
        // check password matches
        const result = req.body.password === user.password;
        if(result) {
            res.send({ 'login': true, message: "Login successful",token:jwt.sign({id:user._id} ,"kjsdlkjoifwsjfsiojrewljj")});
        }else{
            throw new AppError('Wrong Password', 500);
        }
    }else{
        throw new AppError('Wrong email', 500);
    }
}))



exports.changeRole = wrapAsync(async (req, res, next) => {

    });


