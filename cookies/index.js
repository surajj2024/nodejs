const express = require('express');
const app = express();
const port = 8080;
const cookieParser = require('cookie-parser')

app.use(cookieParser('thisismysecret'));

app.get('/', (req, res) => {
    const {
        name = 'kumar'
    } = req.cookies;
    res.send(`Hey There ${name}`)
});

app.get('/setname', (req, res) => {
    res.cookie('name', 'Suraj');
    res.send("Send you a cookie");
})

app.get('/signedCookies', (req, res) => {
    res.cookie('fruit', 'grape', {
        signed: true
    })

    res.send("OKIEE DOKKIEE");
})

app.get('/verifyFruit', (req, res) => {
    console.log(req.cookies);
    // res.send(req.cookies);
    console.log(req.signedCookies);
    res.send(req.signedCookies);
})



app.listen(port, () => {
    console.log(`App is listening on ${port}`)
})