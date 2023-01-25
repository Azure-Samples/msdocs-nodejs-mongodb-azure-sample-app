const jwt = require("jsonwebtoken");
const { RevokedTokenModel } = require("../models/revokedToken");

const secret = process.env.JWT_SECRET;

// The isAuth middleware function
module.exports.isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Not authenticated." });
    return;
  }
  const token = authHeader.split(" ")[1];
  const revokedToken = await RevokedTokenModel.findOne({ token: token });
  if (revokedToken) {
    res.status(401).json({ message: "Token has been revoked." });
    return;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secret);
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
    return;
  }
  if (!decodedToken) {
    res.status(401).json({ message: "Not authenticated." });
    return;
  }
  req.id = decodedToken.id;
  next();
};
