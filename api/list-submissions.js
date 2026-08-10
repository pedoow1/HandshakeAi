const { getSupabase } = require('./_supabase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { adminKey, search, from, to } = req.body || {};

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: 'Invalid admin key.' });
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase is not configured.' });
    return;
  }

  let query = supabase
    .from('submissions')
    .select('email, code, amount, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (search && typeof search === 'string' && search.trim()) {
    query = query.ilike('email', `%${search.trim()}%`);
  }
  if (from && typeof from === 'string') {
    query = query.gte('created_at', new Date(from).toISOString());
  }
  if (to && typeof to === 'string') {
    // include the whole "to" day
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    query = query.lte('created_at', end.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: 'Lookup failed. Try again.' });
    return;
  }

  const rows = data || [];
  const total_clients = rows.length;
  const total_revenue = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  res.status(200).json({ rows, total_clients, total_revenue });
};
