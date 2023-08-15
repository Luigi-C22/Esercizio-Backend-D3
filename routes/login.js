const express = require('express')
const login = express.Router();
const bcrypt = require('bcrypt');
const AuthorModel = require('../models/authorModel');


login.post('/login', async (req, res) => {
    const user = await AuthorModel.findOne({ email: req.body.email})

    if (!user ) {
        return res.status(404).send({
            statusCode: 404,
            message: "User not found!"
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).send({
            statusCode: 400,
            message: "Password non valida."
        })
    }

    res.status(200).send({
        statusCode: 200,
        messagge: "Login effettuato con successo",
        userName: user.name,
        email: user.email,
    });
});


module.exports = login;