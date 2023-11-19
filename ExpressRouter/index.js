const express = require("express");
const app = express();
const port = 8080;
const shelterRoutes = require('./routes/shelters')
const dogRoutes = require('./routes/dogs')
const adminRoutes = require('./routes/admin')


app.use('/admin', adminRoutes);
app.use('/shelter', shelterRoutes);
app.use('/dog', dogRoutes);



app.listen(port, () => {
    console.log(`Listening on ${port}`);
});