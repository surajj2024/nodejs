const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./users');
// const users = require('./users');
const port = 8080;




app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults);
});




function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        // console.log(page);
        const limit = parseInt(req.query.limit);
        // console.log(limit);


        const startIndex = (page - 1) * limit;

        const endIndex = page * limit;
        // console.log(endIndex);
        const pages = await User.countDocuments().exec();
        // console.log(total);
        const totalPages = pages / limit;


        const results = {
            totalPages,
            limit,
            page
        }


        // if (endIndex < await model.countDocuments().exec()) {
        //     // console.log(model.countDocuments().exec());
        //     results.next = {
        //         page: page + 1,
        //         limit: limit
        //     }
        // }


        // if (startIndex > 0) {
        //     results.previous = {
        //         page: page - 1,
        //         limit: limit
        //     }
        // }

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results
            next();
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }
}


mongoose.connect('mongodb://localhost:27017/pagination', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});









































// const users = [{
//         id: 1,
//         name: 'user1'
//     },
//     {
//         id: 2,
//         name: 'user2'
//     },
//     {
//         id: 3,
//         name: 'user3'
//     },
//     {
//         id: 4,
//         name: 'user4'
//     },
//     {
//         id: 5,
//         name: 'user5'
//     },
//     {
//         id: 6,
//         name: 'user6'
//     },
//     {
//         id: 7,
//         name: 'user7'
//     }
// ]

// const posts = [{
//     id: 1,
//     name: "Irena"
// }, {
//     id: 2,
//     name: "Sherm"
// }, {
//     id: 3,
//     name: "Mikael"
// }, {
//     id: 4,
//     name: "Emelia"
// }, {
//     id: 5,
//     name: "Rafaelita"
// }, {
//     id: 6,
//     name: "Fayth"
// }, {
//     id: 7,
//     name: "Viole"
// }, {
//     id: 8,
//     name: "Perren"
// }, {
//     id: 9,
//     name: "Myrtie"
// }, {
//     id: 10,
//     name: "Hartwell"
// }, {
//     id: 11,
//     name: "Antonino"
// }, {
//     id: 12,
//     name: "Layney"
// }, {
//     id: 13,
//     name: "Adam"
// }, {
//     id: 14,
//     name: "Rossie"
// }, {
//     id: 15,
//     name: "Lucais"
// }, {
//     id: 16,
//     name: "Benoit"
// }, {
//     id: 17,
//     name: "Alec"
// }, {
//     id: 18,
//     name: "Sascha"
// }, {
//     id: 19,
//     name: "Jody"
// }, {
//     id: 20,
//     name: "Adaline"
// }]

// app.get('/posts', paginatedResults(posts), (req, res) => {
//     res.json(res.paginatedResults);
// });