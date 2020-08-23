const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const key = require('../config/dbconfig');
const { token } = require('morgan');

router.get('/', (req, res) => {
    res.send('hello');
});

//@desc add new user
//@route POST /register
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            msg = "Email already exaist";
            return res.status(400).json(msg);
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash
                newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err))
            })
        })

    })
});

//@route POST /login
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //Find user by email
    User.findOne({ email })

    //check user
    .then(user => {
        if (!user) {

            return res.status(404).json();
        }
        //console.log(email);
        //check match password
        console.log("password");
        console.log(user.password);
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    //res.json({ msg: 'Success' });
                    //user matched
                    const payload = { id: user.id, name: user.name, email: user.email }
                        //sign token

                    jwt.sign(payload, key.secret, { expiresIn: 3600 }, (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    });


                } else {
                    console.log('dont match');
                    return res.status(404).json();
                }
            });

    });
});


module.exports = router;