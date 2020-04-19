const router = require('express').Router()
const { authenticated } = require('../config/isAuth')

router.get('/', (req, res) => res.render('welcome'))

router.get('/dashboard', authenticated, (req, res) =>
    res.render('dashboard', {
        name: req.user.name,
    })
)

module.exports = router
