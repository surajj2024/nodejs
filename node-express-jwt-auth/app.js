const express = require('express');
const mongoose = require('mongoose');
const port = 3000;
const authRoutes = require('./routes/authRoutes');

const app = express();


// middleware
app.use(express.static('public'));
app.use(express.json());



// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://suraj:Kum@r0720@cluster0.symlual.mongodb.net/'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    app.listen(port);
    console.log(`Listening on port ${port}`);
  })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);