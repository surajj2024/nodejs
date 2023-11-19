const Employee = require('../models/employeeModel')
// const express = require('express');
// const router = express.Router();

const insertEmployee = async (req, res) => {
    try {
        const employee = new Employee({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password
        });


        const result = await employee.save();
        res.send(`Registration has been successfully ${result}`)



    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {
    insertEmployee
};