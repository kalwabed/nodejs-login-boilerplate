const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Login Page
router.get('/login', (req, res) => res.render('login'))

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true,
    })(req, res, next)
})

// Logout handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out!')
    res.redirect('/')
})

// Register Page
router.get('/register', (req, res) => res.render('register'))

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all fields!' })
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Password not match!' })
    }

    // Check password length
    if (password < 6) {
        errors.push({ msg: 'Password should be at least 6 characters!' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // Check email if exist
                    errors.push({ msg: 'Email is already registered!' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                    })
                } else {
                    // New user
                    const newUser = new User({
                        name,
                        email,
                        password,
                    })

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            // Set password to hash
                            newUser.password = hash
                            // Save user
                            newUser
                                .save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'You are now registered!'
                                    )
                                    res.redirect('/auth/login')
                                })
                                .catch(err => console.log(err))
                        })
                    )
                }
            })
            .catch(err => console.log(err))
    }
})

module.exports = router
