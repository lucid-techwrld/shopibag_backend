const express = require('express')
const router = express.Router()
const {getAllProduct, addProduct, getProductByID, getProductCategory} = require('../controller/productController')

router.get('/all', getAllProduct)
router.get('/category/:category', getProductCategory)
router.get('/:id', getProductByID)
router.post('/add', addProduct)



module.exports = router