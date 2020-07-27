const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//NPM package for validation
const Joi = require('@hapi/joi');
//Import User model
const User = require('../model/user');

//Create a schema for validating the data
const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(4).required()
});

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return res.status(400).send(err);
        if (!user) {
            res.status(400).send('Invalid username or password!')
        } else {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(400).send('Invalid username or password!')
            } else {
                const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
                res.header('auth-token', token).json({"userid": user._id, "token": token, "name": user.name});
            }
        }
    })
});

router.post('/register', (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 
    
    var hashPassword = bcrypt.hashSync(req.body.password, 12);

    User.findOne({email: req.body.email}, (err, data) => {
        if (err) return res.status(400).send(err);
        if (data) {
            res.status(400).send('Email already exist!')
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            });

            newUser.save((err, user) => {
                if (err) return res.status(400).send(err);
                const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
                res.header('auth-token', token).json({"userid": user._id, "token": token, "name": user.name});
            })
        }
    })    

});

module.exports = router;