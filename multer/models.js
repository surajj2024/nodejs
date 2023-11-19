const mongoose = require('mongoose');

const ImgSchema = mongoose.Schema({
    name : String,
    image: {
        data: Buffer,
        contentType: String
    }
})


module.exports = ImageModel = mongoose.model('Image', ImgSchema)