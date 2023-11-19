let express = require('express');
const validateUsers = require('../middleware/validation');
const wrapAsync = require('../middleware/error')
const {authentication, adminToken} = require('../middleware/authentication');
const User = require('../models/users.model');
const { createNewUser, getAllUser, userDetail, updateUser, deleteUser, login, changeRole } = require('../controllers/user.controller');




const router = express.Router()


// get all users
router.get('/all', authentication, getAllUser);

// Create a new user
router.post('/create', validateUsers, createNewUser)

// user details
router.get('/detail/:id', userDetail);


// update a specific user
router.put('/:id', validateUsers, updateUser)

// delete a specific user
router.delete('/delete/:id',  deleteUser);

// login a user
router.post('/login', login);



// change admin role
router.get('/changeRole', authentication, adminToken, changeRole); 


module.exports = router;

