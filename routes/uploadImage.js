const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controller/uploadImageController');
const verifyAdmin = require('../middleware/verifyAdmin')

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Store temp files here

router.post('/upload', verifyAdmin, upload.single('image'), uploadImage);

module.exports = router;
