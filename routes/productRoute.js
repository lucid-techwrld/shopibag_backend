const express = require('express')
const router = express.Router()
const {getAllProduct, addProduct, getProductByID} = require('../controller/productController')

router.get('/all', getAllProduct)
router.get('/:id', getProductByID)
router.post('/add', addProduct)


module.exports = router