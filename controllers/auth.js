const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Auth = require('../models/User');

exports.signUp = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new Auth({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message : 'Auth created'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error}));
};

exports.logIn = (req, res) => {
    Auth.findOne({email : req.body.email})
        .then(user => {
            if(!user) {
                return res.status(401).json({ error : 'Unknown user'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error : 'Incorrect password'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        ),
                        expiresIn: 3600*24
                    });
                })
                .catch(error => res.status(400).json(error));
        })
        .catch(error => res.status(400).json(error));

};

exports.getAccount = (req, res) => {

    Auth.findOne({_id : req.params.userId})
        .then((user) => res.status(200).json(user))
        .catch(error => res.status(400).json(error));
}
