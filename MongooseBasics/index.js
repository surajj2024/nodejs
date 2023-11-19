/* // getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/movieApp');
    console.log("Connection Open");

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

const Movie = mongoose.model('Movie', movieSchema);

const amadeus = new Movie({
    title: 'Amdeus',
    year: 1986,
    score: 9.2,
    rating: 'R'
}); */

const mongoose = require('mongoose');






const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

const Movie = mongoose.model('Movie', movieSchema);

// async function createMovie() {
//     try {
//         let res = await Movie.create({ title: "learn node", year: 2023, score: 9.2, rating: "5" })
//         console.log(res)
//     } catch (error) {
//         console.log(error);
//     }
// }





// async function findAll() {
//     try {
//         let res = await Movie.find()
//         console.log(res)
//     } catch (error) {
//         console.log(error);
//     }
// }

// createMovie()

// findAll();


const post = async () => {
    // const data = req.body;
    // console.log(data)

    let todo = await Movie.create({ title: "learn mongo", year: 2023, score: 9.2, rating: "5" });
    console.log(todo)
}

// post();



mongoose.connect('mongodb://127.0.0.1:27017/movieApp')
    .then(() => {
        console.log("listening on port")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })







// const amadeus = new Movie({ title: 'Amadeus', year: 1986, score: 9.2, rating: 'R' });


/* Movie.insertMany([
    { title: 'Amelie', year: 2001, score: 8.3, rating: 'R' },
    { title: 'Alien', year: 1979, score: 8.1, rating: 'R' },
    { title: 'The Iron Giant', year: 1999, score: 7.5, rating: 'PG' },
    { title: 'Stand By Me', year: 1986, score: 8.6, rating: 'R' },
    { title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13' }
])
    .then(data => {
        console.log("IT WORKED!")
        console.log(data);
    }) */






