const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const connectDB = require('./config/mongoDB')
const products = require('./routes/productRoute')
const uploadImage = require('./routes/uploadImage')
const adminLogin = require('./routes/adminLoginRouter')


const app = express()


app.use(cookieParser())
app.use('/api/image/', uploadImage)
app.use(cors({credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./admin'))

const PORT =  process.env.PORT || 5000
connectDB()


app.get('/', (req, res) => {
    res.json({
        "message": "Welcom to ShopIbag API"
    })
})

app.use('/api/v1/products', products)
app.use('/admin', adminLogin)


app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, "./admin/login/login.html"))
})



/*app.all('*', (req, res) => {
    res.status(404).send('404 Page not Found')
})*/



app.listen(PORT, () => {
    console.log('Server running on PORT', PORT)
})