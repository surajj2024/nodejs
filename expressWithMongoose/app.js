const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override')

mongoose.connect('mongodb://127.0.0.1:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// To parse incoming JSON in POST request body:
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy'];

// To check All products
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});


// To Post a new product
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send({ 'success': true, newProduct });
})

// To check specific product
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.send(product);
});


// update a specific product
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.send({ 'Updated': true, product });
})


// Delete a specific product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.send(deletedProduct);
})


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})


