const verifyRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Accès interdit. Aucun rôle trouvé." });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit" });
  }

  next();
};

module.exports = verifyRole;
