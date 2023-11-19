const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/relationshipDemo', { useNewUrlParser: true, useUnifiedTopology: true })


    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: { id: false },
            street: String,
            city: String,
            state: String,
            country: String
        }
    ]
})


const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const u = new User({
        first: 'Harry',
        last: 'Potter'
    })

    u.addresses.push({
        street: '123 sesimi. street',
        city: 'New Delhi',
        state: 'New Delhi',
        country: 'INDIA'
    })
    const res = await u.save();
    console.log(res);
}


const addAddress = async (id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: 'hanuman mandir',
        city: 'Kiriburu',
        state: 'Jharkhand',
        country: 'INDIA'
    })
    const res = await user.save();
    console.log(res);
}


// makeUser();
addAddress('64730bb58df66b0410f99114');
























