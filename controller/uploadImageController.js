const fs = require('fs');
const supabase = require('../utils/supabaseClient');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path, mimetype, originalname } = req.file;
    const fileBuffer = fs.readFileSync(path);

    const { data, error } = await supabase.storage
      .from('shopibag-product-images')
      .upload(`product-images/${Date.now()}-${originalname}`, fileBuffer, {
        contentType: mimetype,
        upsert: false,
      });

    // Delete local temp file
    fs.unlinkSync(path);

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: error.message });
    }

    const { data: publicData } = supabase.storage
      .from('shopibag-product-images')
      .getPublicUrl(data.path);

    res.json({ publicUrl: publicData.publicUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Upload failed on server' });
  }
};

module.exports = { uploadImage };
