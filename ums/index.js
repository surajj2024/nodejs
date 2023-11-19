const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', './views/users')
app.set('views', './views/admin')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// for user routes
const userRoute = require('./routes/userRoute')
app.use('/', userRoute);


// for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute);



mongoose.connect('mongodb://127.0.0.1:27017/user_management_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});