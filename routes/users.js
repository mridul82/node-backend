const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

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

module.exports = router;