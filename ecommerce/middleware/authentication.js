const jwt = require('jsonwebtoken');
const AppError = require('../AppError');
const wrapAsync = require("./error")
const User = require('../models/users.model');
const error = require('./error');


exports.adminToken = (req, res, next)=> {
    // console.log(req.body);
    // console.log(req.headers);
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        throw new AppError('No token provided', 401);
    }
    
    jwt.verify(token, "kjsdlkjoifwsjfsiojrewljj", async(err, token) => {


       const id = token.id;
        // console.log(id);
        const user = await User.findById(id);
        // console.log(user);
        if (!user) {
                throw new AppError('user not found', 404);
            }
        // console.log("user");
        if(user.role === 'admin') {
            // console.log("admin");
            const { _id } = req.body;
            // console.log(_id);
            if(_id){
                // console.log("new user changed");
                const user = await User.findByIdAndUpdate(_id, {role: 'admin'}, { runValidators: true, new: true });
                // console.log(user);
                return res.send({ 'Updated': 'ToAdmin', user });

            }
            else{
               throw new AppError('user not found', 404);
            }
        }if(user.role === 'user'){
            throw new AppError('You Are Not Admin', 500);
        }
        if(err) {
            throw new AppError('Invalid token', 401);
        }
        next();
        
    })
}



exports.authentication = (req, res, next) =>{
    // console.log(req.body);
    // console.log(req.headers);
    const authHeader = req.headers.authorization;



    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        throw new AppError('No token provided', 401);
    }
    
    jwt.verify(token, "kjsdlkjoifwsjfsiojrewljj", (err, token) => {

        if(err) {
            throw new AppError('Invalid token', 401);
        }
    })
    next();
}



