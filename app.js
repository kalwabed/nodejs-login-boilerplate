const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Passport config
require('./config/passport')(passport)

// DB config
const PORT = process.env.PORT || 5000
const db = require('./config/keys').MongoURI
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Parser
app.use(express.urlencoded({ extended: false }))

// Session
app.use(
    session({
        secret: 'unknown',
        resave: true,
        saveUninitialized: true,
    })
)

// Passport mid
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// ROUTES
const RRindex = require('./router/index')
const RRauth = require('./router/auth')
app.use('/', RRindex)
app.use('/auth', RRauth)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))
