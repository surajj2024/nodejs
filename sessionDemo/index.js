const express = require("express");
const app = express();
const port = 8080;
const session = require('express-session')

app.use(session({
    secret: 'thisisnotagoodsecret'
}));




app.get('/viewcount', (req, res) => {
    // res.send("Connected");
    if (req.session.count) {
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    res.send(`You have view ${req.session.count} times`);

})

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
});