const crypto = require('crypto');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, adminKey } = req.body || {};

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: 'Invalid admin key.' });
    return;
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email.' });
    return;
  }

  const secret = process.env.CODE_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Server not configured correctly.' });
    return;
  }

  const normalized = email.trim().toLowerCase();
  const hmac = crypto.createHmac('sha256', secret).update(normalized).digest('hex');
  const code = hmac.slice(0, 8).toUpperCase();

  res.status(200).json({ code });
};
