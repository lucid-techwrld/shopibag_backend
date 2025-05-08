const supabase = require('./supabaseClient');

/**
 * Deletes an image from Supabase storage.
 * @param {string} imagePath - The path of the image to delete.
 * @returns {Promise<void>} - Resolves if the deletion is successful, rejects otherwise.
 */
const deleteImageFromSupabase = async (imagePath) => {
  try {
    const { error } = await supabase.storage.from('shopibag-product-images').remove([imagePath]);
    if (error) {
      console.error('Error deleting image from Supabase:', error.message);
      throw new Error('Failed to delete image from Supabase');
    }
    console.log('Image deleted successfully from Supabase:', imagePath);
  } catch (error) {
    console.error('Error in deleteImageFromSupabase:', error.message);
    throw error;
  }
};

module.exports = { deleteImageFromSupabase };