const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Here we go");
})


module.exports = router;