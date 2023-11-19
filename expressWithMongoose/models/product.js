const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price is not in negative range'],
    },
    category: {
        type: String,
        lowercase: true,
        required: true,
        enum: ['fruit', 'vegetable', 'dairy']
    }

})



const Product = mongoose.model('Product', productSchema);

module.exports = Product;