const { getSupabase } = require('./_supabase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { code, adminKey } = req.body || {};

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: 'Invalid admin key.' });
    return;
  }

  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Enter the code the client sent you.' });
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase is not configured — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' });
    return;
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('email, created_at')
    .eq('code', code.trim().toUpperCase())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: 'Lookup failed. Try again.' });
    return;
  }

  if (!data) {
    res.status(404).json({ error: 'No submission found for this code.' });
    return;
  }

  res.status(200).json({ email: data.email, submitted_at: data.created_at });
};
