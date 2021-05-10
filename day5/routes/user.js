const express = require('express')
const session = require('express-session')
const fs = require('fs')
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const router = express.Router()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const CampgroundModel = require('../models/Campground')
const UserModel = require('../models/User')



router.use(express.static('css'))
router.use(express.urlencoded({extended: false}))

router.get('/', (req, res) => {
    console.log('Request for Get request for HomePage')
    res.render('home')
})


router.get('/signUp', async (req, res) => {
    console.log('Request for Get request for SignUp Page')
    res.render('signUp')
})


router.post('/campground/new', async (req, res) => {

    console.log('Request for post request for checkSignUp Page')
    console.log(req.body)



    const salt = await bcrypt.genSalt(10)
    
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    const data = {
        name : req.body.name,
        email : req.body.email,
        password: hashedPassword
    }

    try {

        const newUserDoc = new UserModel(data)

        const savedUserDoc = await newUserDoc.save()
        
        console.log('Data Savedto DB')

        req.session.isLoggedIn = true
        req.session.user = data

        res.render('camp')
        
    } catch (error) {
        console.log(error)
        res.send(`Internal error ${error._message}`)
        
    }
} )


router.get('/login', (req, res) => {
    console.log('Request for Get request for login Page')    
    res.render('login')
})


router.post('/campground/newL', async (req, res) => {

    console.log('Request for Post request for login Page')
    
    try {
        const userData = await UserModel.findOne({email : req.body.email});
        
        const isMatching = await bcrypt.compare(req.body.password , userData.password)
        
        const reult = {
            name : userData.name
        }
        

        if (isMatching){
            req.session.isLoggedIn = true
            req.session.user = req.body
            console.log('Email and Password matches')
            res.render('camp')
        }
        else{
            console.log('Wrong Password')
            res.redirect('/login')    
        }

    } catch (error) {
        console.log("Wrong email or password")
        res.redirect('/login')
    }


    
})



router.post('/campgrounds',(req, res) => {
    console.log('Request for Post request for Camp Upload page')

    res.render('home2')
} )


router.post('/campgroundsaved', upload.single('image') ,async (req, res) => {

    console.log('Request for Post request for Camp save image')
    console.log(req.file)
    console.log(req.body)

    let data = {
        name : req.body.name,
        price: req.body.price,
        location : req.body.location,
        image : {
                data: fs.readFileSync(path.join('uploads/' + req.file.filename)),
                contentType: 'image/png'
    },
        description : req.body.description,
        createAt : Date.now
    }

     try {

        const newUserDoc = new CampgroundModel(data)

        const savedUserDoc = await newUserDoc.save()
        
        console.log('Data Savedto DB')

        res.redirect('/')
        
    } catch (error) {
        console.log(error)
        res.send(`Internal error ${error._message}`)
        
    }
    
})



module.exports = router