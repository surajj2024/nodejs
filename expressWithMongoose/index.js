const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');
const AppError = require('./AppError');



mongoose.connect('mongodb://127.0.0.1:27017/farmStand2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
})

app.get('/products/new', (req, res) => {
    throw new AppError('NOT ALLOWED', 401);
    res.render('products/new.ejs', { categories });
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    // console.log(newProduct);
    // res.send("Making your product");
    res.redirect(`/products/${newProduct._id}`);
})


app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    // console.log(product);
    res.render('products/show.ejs', { product });
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit.ejs', { product, categories });
})


app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // console.log(req.body);
    // res.send("Put request");
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req, res) => {
    // res.send("Deleted the post");
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).send(message);
})


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})


