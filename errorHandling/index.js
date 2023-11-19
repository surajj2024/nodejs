const port = 3000;
const express = require('express');
const app = express();
var morgan = require('morgan');
const AppError = require('./AppError');

app.use(morgan('dev')); //it show status code and response time in console for every request
// app.use(morgan('common')); //it show status code and response time in console for every request

app.use((req, res, next) => {
    // req.method = 'GET';
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
});

const verifyPassword = (req, res, next) => {
    // console.log(req.query);
    const { password } = req.query;
    if (password === 'node') {
        next();
    }
    throw new AppError('Password is Required', 401);
    // res.send("You need a password");
    // throw new Error('Password is required');
}



/* app.use((req, res, next) => {
    // res.send("HIJAKED");
    console.log("This is my first middleware");
    return next(); //if we don't call the next then it end in previous line of code
});

app.use((req, res, next) => {
    // res.send("HIJAKED");
    console.log("This is second first middleware");
    return next();
});
 */



app.get('/', (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("Home page");
});

app.get('/secret', verifyPassword, (req, res) => {
    res.send("My secret");
});

app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin', 403);
});

app.get('/dogs', (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("Wooof");
});

app.get('/error', (req, res) => {
    chicken.fly();
});

app.use((req, res) => {
    res.status(404).send("402 PAGE NOT FOUND");
})


// app.use((err, req, res, next) => {
//     // console.log("err");
//     // // console.log(err);
//     // console.log("err");
//     // res.status(500).send("500 PAGE NOT FOUND");
//     console.log(err);
//     console.log("err");
//     next(err); //go to default express error handler


// });

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message);
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});