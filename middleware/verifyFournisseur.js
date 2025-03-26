const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role.toLowerCase())) {
      return res.status(403).json({
        message: `Forbidden: Requires ${allowedRoles.join(" or ")} role`,
        yourRole: req.user.role
      });
    }

    next();
  };
};

module.exports = verifyRole;