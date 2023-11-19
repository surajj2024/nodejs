const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
// const employee = require('./controllers/employeeController');
// const bodyParser = require('body-parser');
const employeeRoute = require('./routes/employeeRoute')


mongoose.connect("mongodb://127.0.0.1:27017/company");

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', employeeRoute);

app.listen(port, () => {
    console.log(`Starting server on port ${port}`);
});