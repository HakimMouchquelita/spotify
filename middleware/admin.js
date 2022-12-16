const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, validToken) => {
    if (err) {
      return res.status(400).send("Invalid token.");
    } else {
      if (!validToken.isAdmin)
        return res.status(403).send("Access denied. You are not an admin.");
      req.user = validToken;
      next();
    }
  });
};
