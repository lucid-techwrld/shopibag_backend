const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL; // replace with your URL
const supabaseKey = process.env.SUPABASE_ROLE_KEY; // replace with your anon/public key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
