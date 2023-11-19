const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/users.model');
const AppError = require('./AppError');
const Joi = require('joi'); //for validation of api requests
const error = require('./middleware/error');
const validation = require('./middleware/validation');
const jwt = require('jsonwebtoken'); //for web tokens



app.set('views', path.join(__dirname, 'views'));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));




const userRoute = require("./routes/user.route");
app.use("/user", userRoute);


app.get('/', async (req, res) => {
    const users = await User.find({});
    res.send(users);
});


app.post('/', validateUsers, wrapAsync(async (req, res, next) => {
    const newUsers = new User(req.body);
    await newUsers.save();
    res.send({ 'success': true, message: "Passwords, Email and Phone number are valid and Password is strong", newUsers });
}))


app.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    res.send(user);
}));


// update a specific user
app.put('/:id', validateUsers, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.send({ 'Updated': true, user });
}))

app.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new AppError('User not found', 500);
    }
    const deletedUsers = await User.findByIdAndDelete(id, { runValidators: true, new: true });

    res.send({ 'deleted': true, message: "User deleted successfully", deletedUsers });
}))



app.use((req, res, next) => {
    // res.status(404).send('PAGE NOT FOUND');
    next(new AppError('PAGE NOT FOUND', 404))
});



app.use(error)
app.use(validation)

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).send(message);
});



// mongoose.set("")
mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})








// reference for previous code

// app.post('/', wrapAsync(async (req, res, next) => {

//     const userSchema = Joi.object({
//         fullName: Joi.string().required(),
//         email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
//         gender: Joi.string().required().max(1).valid('M', 'F', 'm', 'f'),
//         phone: Joi.number().required().min(1000000000).max(9999999999),
//         password: Joi.string().min(3).max(15).required().label('Password'),
//         confirmPassword: Joi.any().equal(Joi.ref('password'))
//             .required()
//             .label('Confirm password')
//             .options({ messages: { 'any.only': '{{#label}} does not match' } })
//     })

//     const { error } = userSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new AppError(msg, 400)
//     }


//     const newUsers = new User(req.body);
//     const { password, confirmPassword, email, phone } = req.body;

//     const passwordStrength = zxcvbn(password);
//     const score = passwordStrength.score;

//     if (score < 3) {
//         throw new AppError('Passwords is weak', 400);
//     }

//     if (password !== confirmPassword) {
//         throw new AppError('Passwords do not match', 400);
//     }

//     // Email validation regex pattern
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         throw new AppError("Invalid email", 400)
//     }

//     // Phone number validation regex pattern
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(phone)) {
//         throw new AppError("Invalid phone number", 400)
//     }

//     await newUsers.save();
//     res.send({ 'success': true, message: "Passwords, Email and Phone number are valid and Password is strong", newUsers });
// })) 

