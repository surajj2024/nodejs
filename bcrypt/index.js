const bcrypt = require('bcrypt');

// const hashPassword = async (pw) => {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(pw, salt);
//     console.log(salt);
//     console.log(hash);
// }

const hashPassword = async (pw) => {
    const hash = await bcrypt.hash(pw, 12);
    // console.log(salt);
    console.log(hash);
}


const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    console.log(result);
    if (result) {
        console.log('Login successful');
    } else {
        console.log('Login failed');
    }
}


// hashPassword('monkey');
// login('monkeys', '$2b$12$EydMHjlKEDf1aNN5xaRc2OR6aVu4KeOCKf05G4Fj/u9EFDnJoV7qy');
login('monkey', '$2b$12$URFjcKmifXiAgOdtLwYzeeJmlTpX5v5JQr7S0a53MXcmiRbsNMklG');