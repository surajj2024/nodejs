const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const path = require('path');



const mongoose = require('mongoose');

const UserRouter = require('./api/User')

mongoose.connect('mongodb+srv://surajj:surajj@cluster0.35dyfgb.mongodb.net/UserDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})