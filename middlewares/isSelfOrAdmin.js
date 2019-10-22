module.exports = (req, res, next) => {
  const id = Number(req.params.userId);
  if (req.user && (req.user.isAdmin || req.user.id === id)) {
    next();
  } else {
    res.sendStatus(403);
  }
};
