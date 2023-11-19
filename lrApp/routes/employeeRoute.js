const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const employeeController = require('../controllers/employeeController')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', employeeController.insertEmployee, );


module.exports = router;