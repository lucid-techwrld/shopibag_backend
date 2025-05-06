const supabase = require('../utils/supabaseClient')

const verifyAdmin = async (req, res, next) => {
  const token = req.cookies['sb-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (!process.env.ADMIN_UID) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_UID is not set' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (data.user.id !== process.env.ADMIN_UID) {
    return res.status(403).json({ error: 'Forbidden: Not an admin' });
  }

  req.admin = data.user;

  next();
};

module.exports = verifyAdmin;