module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { adminKey } = req.body || {};

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: 'Wrong admin key.' });
    return;
  }

  res.status(200).json({ ok: true });
};
