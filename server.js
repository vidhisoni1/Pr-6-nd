require('./config/db')
const express = require('express')
// const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const blogSchema = require('./models/blogSchema')
const { upload } = require('./multer')
const userSchema = require('./models/userSchema')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.use(express.static('uploads'))

app.get('/', async (req, res) => {
    const blogs = await blogSchema.find()
    res.render('pages/home', { blogs })
})

app.get('/add', (req, res) => {
    if (req.cookies.v_user) {
        return res.render('pages/add')
    }
    res.redirect('/login')
})

app.post('/add', upload, async (req, res) => {
    let data = req.body
    if (req.file) {
        data = { ...data, image: req.file.filename, username: req.cookies.v_user }
    }

    const newData = await blogSchema(data)
    await newData.save()
    res.redirect('/')
})

app.get('/signup', async (req, res) => {
    if (req.cookies.v_user) {
        return res.redirect('/')
    }
    res.render('pages/signup')
})

app.post('/signup', async (req, res) => {
    const data = req.body
    const user = await userSchema(data)
    await user.save()
    res.redirect('/login')
})

app.get('/login', async (req, res) => {
    if (req.cookies.v_user) {
        return res.redirect('/')
    }
    res.render('pages/login')
})

app.post('/login', async (req, res) => {
    const data = req.body
    const user = await userSchema.findOne({ email: data.email, password: data.password })
    if (!user) {
        return res.redirect('/login')
    }
    res.cookie('v_user', user.name, {
        maxAge: 1000 * 60 * 60
    })
    res.redirect('/')
})

app.get('/logout', async (req, res) => {
    res.clearCookie('v_user')
    res.redirect('/')
})

app.listen(8000, () => {
    console.log('listening on port', 8000)
})
