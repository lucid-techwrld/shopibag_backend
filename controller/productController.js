const Products = require('../data/productsData')
const Product = require('../models/productShcema')
const supabase = require('../utils/supabaseClient')

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).json({success: true, products})
    } catch (error) {
        return res.json({success: false, msg: error})
    }
    
}

const getProductByID = (req, res) => {
    const {id} = req.params
    
    if(!id) {
        return res.json({success: false, message: `Invalid id`})
    } 
    let matchingProduct = Products.find((product)=> {
        return product.id == Number(id)
    })

    if(!matchingProduct)  {
        return res.json({success: false, message: `Product with the id ${id} does not exist`})
    }
    return res.json({success: true, matchingProduct})
} 


const addProduct = async (req, res) => {
    console.log(req.body)
    const {category, description, imageUrl, name, price, quantity } = req.body
    const imagePath = imageUrl.split('/').slice(-2).join('/');

    if(!category || !description || !imageUrl || !name || !price || !quantity) {
        await supabase.storage
                    .from('shopibag-product-images')
                    .remove([imagePath]);
        return res.json({success: false, message:'Invalid Credential'})
     } 
    try {
            const newProduct = new Product({
                    name,
                    price,
                    description,
                    quantity,
                    imageUrl,
                    category
                }) 
            await newProduct.save()
            return res.status(201).json({ message: 'Product added successfully', newProduct });
    } catch (error) {
        console.log(error.message, 'Error uplaoding product')
        await supabase.storage
              .from('shopibag-product-images')
              .remove([imagePath]);
        return res.status(500).json({ error: 'Failed to save product' });
    }
}

module.exports = {getAllProduct, addProduct, getProductByID};