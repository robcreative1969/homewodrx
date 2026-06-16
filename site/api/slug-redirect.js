// Redirect underscore workout/movement slugs to hyphenated equivalents
// e.g. /workouts/fight_gone_bad → /workouts/fight-gone-bad
module.exports = (req, res) => {
  const { slug, base } = req.query;
  if (!slug || !base) {
    res.status(400).send('Missing slug or base');
    return;
  }
  const clean = slug.replace(/_/g, '-');
  res.setHeader('Location', `/${base}/${clean}`);
  res.status(301).end();
};
