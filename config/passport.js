const Strategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new Strategy({ usernameField: 'email' }, (email, password, done) => {
            // Check user
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'That email is not registered!',
                        })
                    }

                    // Check password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err

                        if (isMatch) {
                            return done(null, user)
                        } else
                            return done(null, false, {
                                message: 'Password is incorrect!',
                            })
                    })
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
