const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const port = 3000;
const methodOverride = require('method-override');
const path = require('path');

const app = express();
app.use(express.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://surajj:surajj@cluster0.35dyfgb.mongodb.net/password', {
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


// Routes
app.use('/auth', authRoutes);

// Start the server

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});