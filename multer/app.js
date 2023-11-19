const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 8080;
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');




// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for file upload
app.use(fileUpload({
    useTempFiles: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const ImageModel = require('./models')

const Storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: Storage
})

// Configuration 
cloudinary.config({
  cloud_name: "dyhtxxubi",
  api_key: "396269716375817",
  api_secret: "lWnQiSNz3fL5H5y5TqVQep-lsjE"
});


// Upload

const res = cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', {public_id: "olympic_flag"})

res.then((data) => {
  console.log(data);
  console.log(data.secure_url);
}).catch((err) => {
  console.log(err);
});


// Generate 
const url = cloudinary.url("olympic_flag", {
  width: 100,
  height: 150,
  Crop: 'fill'
});



// The output url
console.log(url);
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag

// const upload = multer({storage: storage})

app.get('/', (req, res) => {
    console.log('req.body', req.body);
    res.send('Hello World!');
});

app.post('/upload', upload.single('testImage'),  (req, res) => {
    console.log('req.file', req.file);
    const  saveImage = new ImageModel({
        name: req.body.name,
        img: {
            data: fs.readFileSync('uploads/' + req.file.filename),
            contentType: "image/png"
        }
    })

    saveImage.save()
    .then((res) => console.log('image is saved'))
    .catch((err) => console.log(err, "error has occured"));
    res.send('Image saved!');
});

const DB = 'mongodb+srv://surajdutech:surajj@cluster0.9vb6d38.mongodb.net/multer';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    
    console.log("MONGO CONNECTION OPEN");

}).catch((err) => {
    console.log(err);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
