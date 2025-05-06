const fs = require('fs');
const supabase = require('../utils/supabaseClient');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path, mimetype, originalname } = req.file;
    const fileBuffer = fs.readFileSync(path);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('shopibag-product-images')
      .upload(`product-images/${Date.now()}-${originalname}`, fileBuffer, {
        contentType: mimetype,
        upsert: false,
      });

    // Delete local temp file
    try {
      fs.unlinkSync(path);
    } catch (err) {
      console.error('Error deleting temp file:', err.message);
    }

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || !data.path) {
      return res.status(500).json({ error: 'Failed to upload image to Supabase' });
    }

    // Construct the Public URL manually
    const publicUrl = `https://dsxqmfvboofjqjrvicwg.supabase.co/storage/v1/object/public/shopibag-product-images/${encodeURIComponent(data.path)}`;
    

    res.json({ publicUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Upload failed on server' });
  }
};

module.exports = { uploadImage };
