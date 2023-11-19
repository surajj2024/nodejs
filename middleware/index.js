const port = 3000;
const express = require('express');
const app = express();
var morgan = require('morgan');


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
    res.send("You need a password")
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

app.get('/dogs', (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("Wooof");
});

app.use((req, res) => {
    res.status(404).send("404 PAGE NOT FOUND");
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});