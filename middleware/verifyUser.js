const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt; // Get the JWT from the cookie

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: Please login and try again",
      });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Login session expired" });
  }
};

module.exports = authMiddleware;
