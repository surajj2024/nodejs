const mongoose = require('mongoose');
const Users = require('./models/users.model');



mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })



const users =
    [{ "fullName": "York Jacquest", "email": "yjacquest0@fastcompany.com", "gender": "F", "phone": "3594091640", "password": "Nfp0iAjBE1kt" },
    { "fullName": "Torry Gaylard", "email": "tgaylard1@mayoclinic.com", "gender": "F", "phone": "5301732607", "password": "Z2grrxu" },
    { "fullName": "Bryn O'Cahsedy", "email": "bocahsedy2@friendfeed.com", "gender": "F", "phone": "9498932141", "password": "KSOOWVW" },
    { "fullName": "Verine Ilyuchyov", "email": "vilyuchyov3@rambler.ru", "gender": "F", "phone": "3606610446", "password": "uQxOiJ" },
    { "fullName": "Cyb Rye", "email": "crye4@networksolutions.com", "gender": "F", "phone": "4436971028", "password": "dP1a5rzxnr7t" },
    { "fullName": "Desirae Shergill", "email": "dshergill5@surveymonkey.com", "gender": "M", "phone": "1863705955", "password": "NT26xkf6lZ" },
    { "fullName": "Mollie Basten", "email": "mbasten6@instagram.com", "gender": "F", "phone": "1504343213", "password": "uz4E0h" },
    { "fullName": "Frances Cymper", "email": "fcymper7@europa.eu", "gender": "M", "phone": "8545104751", "password": "1x6dZw0M" },
    { "fullName": "Denis Dei", "email": "ddei8@ucla.edu", "gender": "M", "phone": "9597845336", "password": "6at5aT" },
    { "fullName": "Ellerey Dawson", "email": "edawson9@technorati.com", "gender": "M", "phone": "7439126975", "password": "FiwoK2ex3zK" },
    { "fullName": "Robby Handke", "email": "rhandkea@moonfruit.com", "gender": "M", "phone": "3847879140", "password": "yVg1VTRu" },
    { "fullName": "Kay Braden", "email": "kbradenb@skyrock.com", "gender": "F", "phone": "1272229494", "password": "wIQ37JwQBP5" },
    { "fullName": "Bartholomeus Oxenbury", "email": "boxenburyc@theglobeandmail.com", "gender": "F", "phone": "7236903280", "password": "i00gJO" },
    { "fullName": "Eve Westlake", "email": "ewestlaked@prweb.com", "gender": "F", "phone": "3119852530", "password": "fdB4ahvA" },
    { "fullName": "Ingrid Renner", "email": "irennere@sina.com.cn", "gender": "M", "phone": "1588193256", "password": "VJnsN2p" },
    { "fullName": "Jerrome Goslin", "email": "jgoslinf@godaddy.com", "gender": "M", "phone": "9352232332", "password": "oExvSrQT" },
    { "fullName": "Paten Koeppke", "email": "pkoeppkeg@dell.com", "gender": "M", "phone": "2421325728", "password": "mXSwq47" },
    { "fullName": "Ban Andresser", "email": "bandresserh@amazon.com", "gender": "F", "phone": "4718339263", "password": "Hobycs2xT" },
    { "fullName": "Elizabet Stain", "email": "estaini@gnu.org", "gender": "F", "phone": "3874404034", "password": "uIzfc7Tnti" },
    { "fullName": "Nollie Curado", "email": "ncuradoj@barnesandnoble.com", "gender": "M", "phone": "7701424418", "password": "u2xJY6zo" },
    { "fullName": "Vita Kuhndel", "email": "vkuhndelk@mysql.com", "gender": "F", "phone": "1439265805", "password": "NSxHaU" },
    { "fullName": "Agnesse Ferrers", "email": "aferrersl@alibaba.com", "gender": "F", "phone": "2133783504", "password": "tBO0FxAEn" },
    { "fullName": "Modesta Bolitho", "email": "mbolithom@kickstarter.com", "gender": "F", "phone": "3284814550", "password": "QsHaDZuVX7" },
    { "fullName": "Lurline Janas", "email": "ljanasn@foxnews.com", "gender": "M", "phone": "7726630670", "password": "fbeyphYklzg" },
    { "fullName": "Dix Saltsberger", "email": "dsaltsbergero@mac.com", "gender": "M", "phone": "1309982242", "password": "cCnbP6eanV" },
    { "fullName": "Robinia Henzley", "email": "rhenzleyp@vk.com", "gender": "F", "phone": "5155185456", "password": "FMMPLvwn" },
    { "fullName": "Valle Threadgill", "email": "vthreadgillq@scientificamerican.com", "gender": "F", "phone": "4492686300", "password": "mZGNqDlyZzWR" },
    { "fullName": "Humfrid Boschmann", "email": "hboschmannr@51.la", "gender": "F", "phone": "6829911525", "password": "E3aFlVFtB2" },
    { "fullName": "Monty Knapper", "email": "mknappers@tripod.com", "gender": "M", "phone": "1208773464", "password": "AxnpXID4r" },
    { "fullName": "Harli Marc", "email": "hmarct@huffingtonpost.com", "gender": "M", "phone": "3132965129", "password": "N2Eh23uEI5" },
    { "fullName": "Pascal Kubasiewicz", "email": "pkubasiewiczu@senate.gov", "gender": "M", "phone": "7658860356", "password": "VmhfGtaH737" },
    { "fullName": "Gaby Morgon", "email": "gmorgonv@rakuten.co.jp", "gender": "F", "phone": "1843024588", "password": "UJ6Fi8V9ErAg" },
    { "fullName": "Adelaide Gerant", "email": "agerantw@miitbeian.gov.cn", "gender": "M", "phone": "3602229062", "password": "zV4E4vC3eX" },
    { "fullName": "Scottie Wycliff", "email": "swycliffx@bloglines.com", "gender": "F", "phone": "6998034287", "password": "AnrCBV" },
    { "fullName": "Orv McBain", "email": "omcbainy@parallels.com", "gender": "M", "phone": "6106568439", "password": "YNoRP2JTTdI" },
    { "fullName": "Hillary Worsham", "email": "hworshamz@tripadvisor.com", "gender": "F", "phone": "6462368202", "password": "Et93NnhSd" },
    { "fullName": "Stefano Matyukon", "email": "smatyukon10@bloglines.com", "gender": "M", "phone": "5573953714", "password": "cRPpiFYbNC" },
    { "fullName": "Agna Dolle", "email": "adolle11@taobao.com", "gender": "M", "phone": "3477775818", "password": "3uRbnZ71bCb" },
    { "fullName": "Jo Hadden", "email": "jhadden12@paginegialle.it", "gender": "M", "phone": "8445140201", "password": "liYP6hNT" },
    { "fullName": "Denise Nassi", "email": "dnassi13@php.net", "gender": "F", "phone": "5458325921", "password": "yQADd1ztp" },
    { "fullName": "Tobiah Blench", "email": "tblench14@aboutads.info", "gender": "F", "phone": "2162663129", "password": "gtYBk1" },
    { "fullName": "Rivkah Tessier", "email": "rtessier15@shutterfly.com", "gender": "F", "phone": "9326057793", "password": "2MzE6E1a" },
    { "fullName": "Rosamond Iannuzzi", "email": "riannuzzi16@topsy.com", "gender": "F", "phone": "7421546045", "password": "BkLTjLtc" },
    { "fullName": "Murvyn Cloney", "email": "mcloney17@time.com", "gender": "F", "phone": "9923504785", "password": "d4o8yn3ajCn" },
    { "fullName": "Nickie Sibery", "email": "nsibery18@yolasite.com", "gender": "F", "phone": "8495421828", "password": "IXMz7m" },
    { "fullName": "Ardath Dowse", "email": "adowse19@army.mil", "gender": "M", "phone": "9276645812", "password": "z0i0vvP1NU" },
    { "fullName": "Saloma Cadagan", "email": "scadagan1a@blog.com", "gender": "F", "phone": "2676351464", "password": "CFHT1AVw" },
    { "fullName": "Sayers Guislin", "email": "sguislin1b@businesswire.com", "gender": "F", "phone": "2843797441", "password": "Acr1xHJ" },
    { "fullName": "Latrena Dullingham", "email": "ldullingham1c@shinystat.com", "gender": "M", "phone": "6588117098", "password": "Wl6YXLXT0" },
    { "fullName": "Elane Carcass", "email": "ecarcass1d@japanpost.jp", "gender": "F", "phone": "5898273711", "password": "CkLXBu08lW9" }];




    Users.insertMany(users)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })