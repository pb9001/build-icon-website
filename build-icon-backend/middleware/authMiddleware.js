const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token Missing"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.admin = decoded;

    next();

  } catch (err) {

    return res.status(403).json({
      message: "Invalid Token"
    });

  }

}

module.exports = verifyToken;