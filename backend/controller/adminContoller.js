const supabase = require('../utils/supabaseClient')

const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!data || !data.session) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const token = data.session.access_token;
  const refresh = data.session.refresh_token;

  // Set cookies (httpOnly, secure in prod)

  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('sb-token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'Strict' : 'Lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.cookie('sb-refresh-token', refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'Strict' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ message: 'Login successful' });
}

const logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.clearCookie('sb-token');
  res.clearCookie('sb-refresh-token');

  res.json({ message: 'Logout successful' });
}
module.exports = {
  login,
  logout
};