require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const expHbs = require('express-handlebars')
const multer  = require('multer')

const userRouter = require('./routes/user')

const upload = multer({ dest: 'uploads/' })

const app = express()

// handlebars Middleware
app.engine('hbs', expHbs({ extname: 'hbs'  }))
app.set('view engine', 'hbs')


// session

app.use(session({
    secret: "Mowgli",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 9000000
    }

}))



// Middlewares
app.use(express.static('uploads'))
app.use(express.static('css'))
app.use(express.urlencoded({extended: false}))


// DataBase
const {DATABASE_URL} = process.env

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) throw err

    console.log('Connected')
})



app.use('/', userRouter)



app.listen(3000, (res, req) => console.log('Server Started'))



